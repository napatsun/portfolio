/**
 * Skills content — source: docs/content.md §4 "Skills / Tech Stack Section".
 *
 * Categories and items are verbatim from the source doc; do not paraphrase,
 * reorder, or add entries (agent.md §2 "Never invent content"). Notably the
 * Databases entry keeps the parenthetical "Pinecone (Vector Database)".
 *
 * The component maps over `skillCategories` — no category names are hardcoded
 * in JSX, so edits here are the single source of truth.
 */

export interface SkillCategory {
  category: string
  items: string[]
}

export const skillsHeading = 'Skills & Tech Stack'

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    items: ['Python', 'SQL', 'Java', 'C', 'C++', 'HTML', 'CSS'],
  },
  {
    category: 'Data & Machine Learning',
    items: [
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Seaborn',
      'Scikit-learn',
      'XGBoost',
      'LightGBM',
      'CatBoost',
      'TensorFlow',
    ],
  },
  {
    category: 'NLP & LLM',
    items: ['Hugging Face', 'LangChain', 'Sentence-Transformers', 'OpenRouter API'],
  },
  {
    category: 'MLOps & Backend',
    items: ['Docker', 'Flask'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'Pinecone (Vector Database)'],
  },
  {
    category: 'Tools',
    items: ['Git'],
  },
]
