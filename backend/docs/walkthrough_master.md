# Mastering CareerLens: AI Job Assistant

Welcome to your AI-powered job application command center. This document explains "every aspect" of the system, from how we fetch data to how the AI coaches you for success.

---

## 1. Smart Discovery (The Magic Quick Fill)
**Goal**: Save time and ensure data accuracy by bypassing manual data entry.

- **The Scraper**: When you paste a URL, our backend uses `axios` and `cheerio` to fetch the raw HTML. We explicitly strip out noise like headers, footers, and scripts.
- **The AI Extraction**: The raw text is sent to Gemini with a specialized prompt. It is trained to ignore "Cookie Banners" and "Login Prompts" and focus strictly on the core Job Title, Company, and Role description.
- **Outcome**: A structured job record ready for analysis in seconds.

---

## 2. Contextual JD Analysis
**Goal**: Understand exactly what the recruiter is looking for.

- **Skill Extraction**: The system identifies **Required Skills** (hard requirements) and **Nice-to-Have** bonuses.
- **Seniority & Role**: The AI determines the seniority level (Junior, Senior, Lead) and the core focus of the role (e.g., Frontend, Backend, Management).
- **The Breakdown**: This data is stored as a structured JSON blob in the database, which fuels the scoring and prep logic.

---

## 3. Realistic 4-Factor Scoring
**Goal**: Provide a professional, unbiased evaluation of your fit.

We moved away from simple keyword matching to a weighted **Professional ATS Rubric**:
1. **Skill Alignment (40%)**: Does your technical stack match their mandatory requirements?
2. **Experience Fit (30%)**: Do you have the right seniority and industry background?
3. **Role Relevance (20%)**: How well does your past title and responsibility overlap with this new role?
4. **Quality & Clarity (10%)**: How well-formatted and impactful is your resume text?

---

## 4. Interview Mastery (The Prep Dashboard)
**Goal**: Pivot your weaknesses into strengths during the interview.

- **Probable Questions**: Based on the *gaps* identified (skills you don't have) and the *requirements* of the job, we predict the 5 most likely questions.
- **STAR Coaching**: For every question, the AI provides a **STAR** (Situation, Task, Action, Result) template.
- **Resume Optimization**: We suggest specific bullet-point rewrites that use the JD's exact language without lying, helping you pass the initial recruiter screening.

---

## 5. Technical Stack
- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons.
- **Backend**: Node.js + Express.
- **Database**: MySQL (storing jobs, analyses, and resumes as relational data with JSON columns).
- **AI**: Google Gemini Pro (3.1 High) via the Generative AI SDK.

---

## How to get the best results?
- **For Discovery**: Use direct job posting links (LinkedIn, Indeed, or Company Careers pages).
- **For Scoring**: Paste your **full** resume text (including bullet points), not just a summary. The more detail you provide, the more accurate the "Probable Questions" will be.

---

**Happy Hunting!** Your next career move starts here.
