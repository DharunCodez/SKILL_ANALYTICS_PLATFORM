# SkillSync: Advanced Skill Tracking & Analytics Platform

SkillSync is a comprehensive full-stack application designed to help professionals track their skill growth, visualize proficiency balance, and receive personalized learning recommendations.

## 🚀 Phase 1: Project Foundation & Architecture

This repository contains the core architecture, database design, and UI/UX framework for Review 1.

### 📁 Project Structure
```text
f:/PBL Project/
├── frontend/          # React.js UI (Client)
├── backend/           # Node.js & Express API (Server)
├── DOCS/              # Documentation for Phase 1 Review
│   ├── TECH_STACK.md  # Technology justification & System Architecture
│   ├── DATABASE.md    # ER Diagrams & Schema Design
│   └── UI_UX.md       # Design philosophy & User Journey
├── .gitignore         # Version control exclusion rules
└── README.md          # Project entry point
```

## 🛠️ Tech Stack (MERN)
- **M**ongoDB: NoSQL database for flexible data storage.
- **E**xpress.js: Fast backend framework for building APIs.
- **R**eact.js: Component-based library for a dynamic user interface.
- **N**ode.js: JavaScript runtime for the server.

---

## 📖 Quick Links for Reviewers
1. **[Technical Justification & Architecture](./DOCS/TECH_STACK.md)**
   - Why MERN?
   - System Flow Diagram.
2. **[Database & Entity Design](./DOCS/DATABASE.md)**
   - Schema definitions and relationships.
3. **[UI/UX Design Philosophy](./DOCS/UI_UX.md)**
   - Color palette and wireframe logic.

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 1. Clone & Install Dependencies
```bash
# Install root dependencies
npm install

# Install both backend and frontend dependencies
npm run install-all
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Run Locally
```bash
# Run both frontend and backend concurrently
npm start
```
The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 🌿 GitHub Workflow & Branching Strategy
We follow a standard **Feature Branching** strategy to ensure code quality:
- `main`: Production-ready code.
- `develop`: Integration branch for features.
- `feature/*`: Individual features (e.g., `feature/login`, `feature/dashboard`).

---

## 👨‍💻 Project By
[Your Name/Team Name]
PBL Project - Review 1
