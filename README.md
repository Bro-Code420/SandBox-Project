# Skillup: AI-Driven Career Action Engine 🚀

> **Empowering career growth with quantified readiness and intelligent learning paths.**

Skillup is a modern, ML-powered career readiness platform designed to bridge the gap between where you are and where you want to be. It moves beyond static job descriptions by providing dynamic skill analysis, quantified readiness scores, and personalized 30-day learning roadmaps.

---

## 💡 The Problem
In today's fast-paced job market, professionals and students face three critical challenges:
1. **Directionless Growth**: Knowing the goal (e.g., "Senior Dev") but not the specific skill gaps.
2. **Information Overload**: Thousands of courses available, but no clear path on which ones actually matter for a specific role.
3. **Lack of Quantification**: No objective way to measure "How ready am I?" for a job before applying.

## ✨ The Solution: Skillup
Skillup transforms career planning from guesswork into a data-driven action plan:
- **Resumé Intelligence**: Instant extraction of skills and experience using AI.
- **Quantified Readiness**: Real-time scoring using **XGBoost** models to measure role fit.
- **Actionable Roadmaps**: 30-day sprints with curated resources (YouTube, Courses) prioritized by learning dependencies.
- **Explainable AI**: Transparent breakdown of *why* you received a certain score.

---

## 🛠️ Tech Stack: The Engine Behind Skillup

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14/15, Tailwind CSS, Framer Motion, Shadcn UI, Magic UI |
| **Backend (Data)** | Convex (Real-time Database & Backend Functions) |
| **Backend (ML)** | FastAPI (Python), XGBoost, Scikit-learn, NumPy |
| **Authentication** | Clerk (Secure Auth & User Management) |
| **Inference/Logic** | SVD-based Collaborative Filtering, Topological Sorting for Roadmaps |

---

## 🧠 Machine Learning & Innovation

### 1. Readiness Scoring (XGBoost)
We use a gradient-boosted decision tree model (XGBoost) to calculate a **Readiness Score**. The model considers:
- **Core Skill Coverage**: Matching user skills against industry-standard role requirements.
- **Experience Factor**: Weighting seniority (Junior vs. Senior) based on numerical years of experience.
- **Bonus Skill Impact**: Identifying niche skills that give candidates a competitive edge.

### 2. Personalized Recommendations (SVD CF)
Our recommendation engine uses **Singular Value Decomposition (SVD)** based collaborative filtering to suggest learning resources.
- **Collaborative Filtering**: Recommends resources that have been effective for users with similar profiles.
- **Content-Based Fallback**: Ensures recommendations remain relevant even for new users.

### 3. Intelligent Roadmap Generation
- **Topological Sorting**: Roadmaps aren't just lists; they are ordered lists. Our system uses graph theory (topological sort) to ensure you learn prerequisites (e.g., "HTML/CSS") before advanced topics (e.g., "React").
- **30-Day Sprint**: Automatically divides the learning path into 4 focused weeks.

---

## 🏗️ Architecture Flow

1. **User Onboarding**: Profile creation via Clerk & Convex.
2. **Analysis Trigger**: User uploads a resume or selects a target job role.
3. **ML Inference**:
    - The **Next.js** frontend sends data to the **FastAPI** backend.
    - **XGBoost** calculates the Readiness Score.
    - **SVD recommender** identifies the best learning resources.
4. **Data Persistence**: Results are stored in **Convex** for real-time dashboard updates.
5. **Action Plan**: System generates a 4-week roadmap with direct links to learning material.

---

## 🚀 Future Roadmap (Vision)
- **Real-time Job Matching**: Directly connecting high-readiness users with recruiters.
- **Enterprise Integration**: Helping HR teams identify internal skill gaps for upskilling.
- **Global Skill Analytics**: Providing industry-wide insights into emerging technology trends.

---

## 👨‍💻 Getting Started

### Prerequisites
- Node.js & pnpm
- Python 3.9+
- Convex Account
- Clerk Account

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Bro-Code420/SandBox-Project.git
   ```

2. **Frontend (Skillup)**
   ```bash
   cd Skillup
   pnpm install
   pnpm dev
   ```

3. **ML Backend**
   ```bash
   cd ml-backend
   python -m venv venv
   source venv/bin/activate  # .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn app.api.main:app --reload
   ```

4. **Convex**
   ```bash
   npx convex dev
   ```

---

**Built with ❤️ for the Hackathon Community.**
