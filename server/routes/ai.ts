import { Router } from 'express';
import { db } from '../config/database';
import { asyncRoute, ApiError, requiredString } from '../lib/http';
import { rateLimit } from '../middleware/rateLimit';
import { generateJson } from '../services/geminiService';

const router = Router();
router.use(rateLimit());
const disclaimer = 'AI-generated information is for medicine-catalog discovery and education only; it is not medical advice. Consult a licensed clinician or pharmacist before starting, stopping, or changing any medicine.';

interface CatalogMedicine {
  id: string;
  name: string;
  saltName: string;
  therapeuticClass: string;
  brandEquivalents?: Array<{ brandName: string }>;
}

const symptomClassTerms: Array<{ terms: string[]; therapeuticClass: string }> = [
  { terms: ['fever', 'headache', 'pain', 'ache'], therapeuticClass: 'Analgesic & Antipyretic' },
  { terms: ['acidity', 'heartburn', 'reflux', 'gastric'], therapeuticClass: 'Antacid & Anti-Ulcerant' },
  { terms: ['cholesterol', 'lipid'], therapeuticClass: 'Lipid Lowering & Cardiovascular' },
  { terms: ['diabetes', 'sugar', 'glucose'], therapeuticClass: 'Endocrine & Anti-Diabetic' },
  { terms: ['allergy', 'cold', 'sneezing'], therapeuticClass: 'Anti-Allergic & Respiratory' },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const catalogFallback = (query: string, catalog: CatalogMedicine[]) => {
  const normalizedQuery = normalize(query);
  const words = normalizedQuery.split(' ').filter(Boolean);
  const symptomMatch = symptomClassTerms.find(({ terms }) => terms.some((term) => words.includes(term)));
  return catalog
    .map((medicine) => {
      const searchable = [medicine.name, medicine.saltName, ...(medicine.brandEquivalents?.map(({ brandName }) => brandName) || [])].map(normalize);
      const brandMatch = searchable.some((term) => term.includes(normalizedQuery));
      const wordMatches = words.filter((word) => searchable.some((term) => term.includes(word))).length;
      const classMatch = symptomMatch?.therapeuticClass === medicine.therapeuticClass;
      const score = brandMatch ? 0.95 : classMatch ? 0.7 : words.length ? wordMatches / words.length : 0;
      return { medicine, score, brandMatch, classMatch };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5)
    .map(({ medicine, score, brandMatch, classMatch }) => ({
      medicineId: medicine.id,
      confidence: Number(score.toFixed(2)),
      rationale: brandMatch ? 'Matched a brand name or salt name in the GenericMed catalog.' : classMatch ? 'Matched the catalog class for the terms in your search.' : 'Matched your search terms in the GenericMed catalog.',
    }));
};

router.post('/search', asyncRoute(async (req, res) => {
  const query = requiredString(req.body.query, 'query').slice(0, 300);
  const rows = db.prepare('SELECT data FROM medicines ORDER BY name').all() as Array<{ data: string }>;
  const catalog = rows.map(({ data }) => JSON.parse(data) as CatalogMedicine);
  const fallbackSuggestions = catalogFallback(query, catalog);
  let suggestions = fallbackSuggestions;
  let source: 'catalog_fallback' | 'gemini' = 'catalog_fallback';
  try {
    const answer = await generateJson<{ suggestions: Array<{ medicineId: string; confidence: number; rationale: string }> }>('search', { query, catalog }, `Match this natural-language medicine-discovery request to the supplied catalog only. The request can mention symptoms, a brand, a salt, or a therapeutic need. Do not diagnose, recommend treatment, or invent medicines. When a symptom is mentioned, explain only the catalog-class match and encourage professional review. Search: ${query}\nCatalog: ${JSON.stringify(catalog)}\nReturn {"suggestions":[{"medicineId":"catalog id","confidence":0-1,"rationale":"brief catalog-match reason"}]}.`);
    if (answer.suggestions.length) {
      suggestions = answer.suggestions;
      source = 'gemini';
    }
  } catch {
    // A deterministic catalog match keeps discovery useful when the optional AI service is unavailable.
  }
  const allowed = new Set(catalog.map(medicine => medicine.id));
  res.json({ data: { suggestions: suggestions.filter(item => allowed.has(item.medicineId)).slice(0, 5), source, disclaimer } });
}));

router.post('/interactions', asyncRoute(async (req, res) => {
  const medicines = req.body.medicines;
  if (!Array.isArray(medicines) || medicines.length < 2 || medicines.length > 10 || medicines.some(item => typeof item !== 'string' || !item.trim())) throw new ApiError(400, 'VALIDATION_ERROR', 'medicines must contain 2 to 10 medicine names');
  const answer = await generateJson<{ severity: 'unknown' | 'review'; summary: string; cautions: string[] }>('interactions', medicines, `Provide an educational interaction-screening summary for: ${JSON.stringify(medicines)}. Do not declare combinations safe, do not diagnose, and do not give treatment instructions. Return only {"severity":"unknown"|"review","summary":"brief cautious statement","cautions":["specific questions to ask a clinician or pharmacist"]}.`);
  res.json({ data: { ...answer, disclaimer } });
}));

router.post('/dosage', asyncRoute(async (req, res) => {
  const medicine = requiredString(req.body.medicine, 'medicine').slice(0, 200);
  const answer = await generateJson<{ safetyGuidance: string[] }>('dosage', { medicine, age: req.body.age, weight: req.body.weight, condition: req.body.condition }, `Provide only general safety questions and red flags to discuss with a clinician or pharmacist before using ${medicine}. Do not provide a dose, schedule, diagnosis, or personalized recommendation. Return {"safetyGuidance":["..."]}.`);
  res.json({ data: { ...answer, disclaimer } });
}));
export default router;
