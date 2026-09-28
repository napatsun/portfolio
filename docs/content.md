# Content — Actual Content for Portfolio Website

> Note: The text in this file is the actual content to be displayed on the website. Sections without information yet (e.g. project details) are clearly marked as `[TODO: ...]`. The agent must not fill in information that isn't real.

---

## 1. Navbar

- Logo/short name: `NK` or `Napat K.`
- Menu: Home | About | Skills | Projects | Contact
- Button: Dark/Light mode toggle (sun/moon icon)

---

## 2. Hero Section

**Headline:**
> Napat Kasemweerasan

**Subheadline (position/field):**
> Computer Engineering Student — Bridging Engineering, Machine Learning & Quantitative Finance

**Short tagline (1–2 lines):**
> A Computer Engineering student passionate about applying Machine Learning to Quantitative Finance, in order to uncover patterns and generate value from data.

**Call to Action:**
> Button "View Projects" → scrolls to the Projects section
> Button "Contact Me" → scrolls to the Contact section

---

## 3. About Section

**Heading:** About Me

**Content:**
> My name is Napat Kasemweerasan, and I'm currently studying Computer Engineering at King Mongkut's University of Technology Thonburi (KMUTT).
>
> My core interests lie at the intersection of **Computer Engineering**, **Machine Learning**, and **Quantitative Finance** — I believe that understanding both systems engineering and data modeling is key to building systems that aren't just "accurate," but genuinely "usable" in a financial world where data is constantly changing.
>


---

## 4. Skills / Tech Stack Section

**Heading:** Skills & Tech Stack

### Languages
Python, SQL, Java, C, C++, HTML, CSS

### Data & Machine Learning
Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, XGBoost, LightGBM, CatBoost, TensorFlow

### NLP & LLM
Hugging Face, LangChain, Sentence-Transformers, OpenRouter API

### MLOps & Backend
Docker, Flask

### Databases
PostgreSQL, Pinecone (Vector Database)

### Tools
Git

> Display recommendation: use an icon/badge per item, arranged in a grid by category, with progress bars or pill-style tags following the Navy/Gold design.

---

## 5. Projects Section

**Heading:** Projects

### 1. Price Direction & Return Forecasting
- **Technologies (tags):** Python, XGBoost, LightGBM, CatBoost, Scikit-learn
- **Year:** 2026
- **Description:**
  - Built a dual-model ML system (classification for price direction + regression for daily returns) to forecast gold price (XAU/USD) movements, using 6 years of historical price and macroeconomic data (DXY, VIX, oil, S&P 500, bond yields).
  - Engineered 69 features (volatility windows, rolling correlations, technical indicators) and used Time Series Split to prevent data leakage.
  - Compared 8 models (Logistic Regression, Random Forest, XGBoost, LightGBM, CatBoost, Ensemble), evaluated using RMSE, MAE, R², F1-score, and directional accuracy.
  - Combined signals from LightGBM (direction) and the Ensemble Regressor (returns) into a trading strategy, then backtested from Jan 2024–Mar 2026, achieving a total return of 20.66%, a win rate of 53.76%, and a max drawdown of -3.16%.
- **Data visualization to include:** An interactive graph showing backtest performance / equity curve, with tooltips displaying win rate, drawdown, and return on hover.
- GitHub link: https://github.com/napatsun/goldpriceforecast

### 2. Kan-Kluay Shopping — E-Commerce Database System
- **Technologies (tags):** PostgreSQL
- **Year:** 2026
- **Description:**
  - Collaborated with a team of 6 to design a normalized relational schema (11 tables) for an e-commerce platform, resolving transitive dependency issues in the Order and Order_Item tables to reach 3NF and reduce data redundancy.
  - Enforced business rules through schema-level constraints, such as price locking at purchase time (price_at_purchase), ON DELETE CASCADE/RESTRICT policies, and CRUD permission control for 3 user roles (Buyer, Seller, Admin).
- **Data visualization to include:** Not needed (show an ER diagram/schema instead of a data chart).
- GitHub link: https://github.com/napatsun/KanKluay_Shopping

### 3. LINE Chatbot RAG
- **Technologies (tags):** Python, Flask, LangChain, Pinecone, Sentence-Transformers, OpenRouter
- **Year:** 2026
- **Description:**
  - Developed a RAG-based LINE chatbot that retrieves shop data from a Pinecone vector database and generates natural Thai-language responses via an LLM (OpenRouter).
  - Used semantic search with Sentence-Transformers (all-MiniLM-L6-v2) to embed and search café information (menu, prices, opening hours).
  - Designed an end-to-end pipeline (Retrieve–Augment–Generate) connected to the LINE Messaging API for real-time customer support.
  - Deployed a Flask webhook server with ngrok tunneling for live testing.
- **Data visualization to include:** Consider an animated chat demo instead of a data chart.
- GitHub link: https://github.com/napatsun/LINE_Chatbot_RAG

---

## 6. Contact Section

**Heading:** Get in Touch

**Intro text:**
> Interested in collaborating, want to talk about a project, or just want to say hi? Reach out to me through the channels below.

**Form:**
- Name (required)
- Email (required, must be a valid email format)
- Message (required)
- Send button

**Contact channels:**
- Email: sunnapat1689@gmail.com
- GitHub: https://github.com/napatsun
- LinkedIn: https://www.linkedin.com/in/napat-kasemweerasan-32a444358/

---

## 7. Footer

> © 2026 Napat Kasemweerasan. Built with React