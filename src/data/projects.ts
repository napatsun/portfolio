/**
 * Projects content — source: docs/content.md §5 "Projects Section".
 *
 * Titles, tags, years, bullet descriptions, and GitHub URLs are verbatim from
 * the source doc; do not paraphrase, reorder, or add entries (agent.md §2
 * "Never invent content"). No project in content.md has a demo URL, so
 * `demoUrl` is omitted everywhere rather than fabricated.
 */

/** Which real visualization a project's card renders (vs. the placeholder). */
export interface EquityCurveVisualization {
  kind: 'equity-curve'
}

export interface ChatDemoVisualization {
  kind: 'chat-demo'
}

export type ProjectVisualization = EquityCurveVisualization | ChatDemoVisualization

export interface Project {
  /** Stable identifier — used as the React key and for anchor/aria wiring. */
  id: string
  title: string
  tags: string[]
  year: number
  /** Bullet points, verbatim from content.md §5, rendered as <li>. */
  description: string[]
  /**
   * Whether content.md §5 asks for a data visualization on this project:
   * - price-forecasting → interactive backtest/equity-curve chart
   * - kan-kluay → not needed (ER diagram instead of a data chart)
   * - line-chatbot → "Consider an animated chat demo instead of a data chart"
   */
  needsVisualization: boolean
  /**
   * The concrete visualization to render, when it exists. Projects with
   * `needsVisualization: true` but no `visualization` yet still show the
   * neutral placeholder.
   */
  visualization?: ProjectVisualization
  githubUrl?: string
  demoUrl?: string
}

export const projectsHeading = 'Projects'

export const projects: Project[] = [
  {
    id: 'price-forecasting',
    title: 'Price Direction & Return Forecasting',
    tags: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'Scikit-learn'],
    year: 2026,
    description: [
      'Built a dual-model ML system (classification for price direction + regression for daily returns) to forecast gold price (XAU/USD) movements, using 6 years of historical price and macroeconomic data (DXY, VIX, oil, S&P 500, bond yields).',
      'Engineered 69 features (volatility windows, rolling correlations, technical indicators) and used Time Series Split to prevent data leakage.',
      'Compared 8 models (Logistic Regression, Random Forest, XGBoost, LightGBM, CatBoost, Ensemble), evaluated using RMSE, MAE, R², F1-score, and directional accuracy.',
      'Combined signals from LightGBM (direction) and the Ensemble Regressor (returns) into a trading strategy, then backtested from Jan 2024–Mar 2026, achieving a total return of 20.66%, a win rate of 53.76%, and a max drawdown of -3.16%.',
    ],
    needsVisualization: true,
    // Chart itself is illustrative (see src/data/equityCurve.ts) — only the
    // three summary statistics are real, and the caption says so.
    visualization: { kind: 'equity-curve' },
    githubUrl: 'https://github.com/napatsun/goldpriceforecast',
  },
  {
    id: 'kan-kluay',
    title: 'Kan-Kluay Shopping — E-Commerce Database System',
    tags: ['PostgreSQL'],
    year: 2026,
    description: [
      'Collaborated with a team of 6 to design a normalized relational schema (11 tables) for an e-commerce platform, resolving transitive dependency issues in the Order and Order_Item tables to reach 3NF and reduce data redundancy.',
      'Enforced business rules through schema-level constraints, such as price locking at purchase time (price_at_purchase), ON DELETE CASCADE/RESTRICT policies, and CRUD permission control for 3 user roles (Buyer, Seller, Admin).',
    ],
    needsVisualization: false,
    githubUrl: 'https://github.com/napatsun/KanKluay_Shopping',
  },
  {
    id: 'line-chatbot-rag',
    title: 'LINE Chatbot RAG',
    tags: ['Python', 'Flask', 'LangChain', 'Pinecone', 'Sentence-Transformers', 'OpenRouter'],
    year: 2026,
    description: [
      'Developed a RAG-based LINE chatbot that retrieves shop data from a Pinecone vector database and generates natural Thai-language responses via an LLM (OpenRouter).',
      'Used semantic search with Sentence-Transformers (all-MiniLM-L6-v2) to embed and search café information (menu, prices, opening hours).',
      'Designed an end-to-end pipeline (Retrieve–Augment–Generate) connected to the LINE Messaging API for real-time customer support.',
      'Deployed a Flask webhook server with ngrok tunneling for live testing.',
    ],
    needsVisualization: true,
    // Animated mock chat (see src/data/chatDemo.ts) — clearly captioned as
    // illustrative, never presented as a real customer log.
    visualization: { kind: 'chat-demo' },
    githubUrl: 'https://github.com/napatsun/LINE_Chatbot_RAG',
  },
]
