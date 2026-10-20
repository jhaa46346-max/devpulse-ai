# DevPulse AI — Developer Intelligence & Security Platform

> **"Understand. Secure. Improve. Ship."**  
> *DevPulse AI is an enterprise-grade developer intelligence platform combining semantic code comprehension, static AST cybersecurity analysis, automated code optimization, and a project-grounded AI assistant.*

---

## 1. Product Overview

DevPulse AI safeguards and optimizes codebases across their entire lifecycle. It provides engineering teams with:
* **Deep Code Understanding**: Dissects data flow, architectural dependencies, and semantic symbol maps.
* **Intelligent Bug Detection**: Uncovers latent runtime exceptions, race conditions, and unhandled states.
* **Cybersecurity & SAST Engine**: Audits code against OWASP Top 10, CWE catalogs, hardcoded secrets, and unsafe deserialization.
* **Automated Code Optimization**: Generates direct refactoring diffs, complexity reductions, and performance tweaks.
* **Documentation & Test Synthesis**: Instantly produces JSDoc/docstrings and unit tests (Jest, Pytest).
* **Composite Health & Security Scores**: Transparent algorithmic scoring evaluating software maintainability and vulnerability debt.
* **DevPulse AI Assistant**: Contextual engineering companion with project-level awareness.

---

## 2. Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide React.
* **Backend Architecture**: Next.js Server Components & Route Handlers, Node.js.
* **Database (Phase 2)**: PostgreSQL, Prisma ORM.
* **AI Engine (Phase 4 & 6)**: OpenAI API (GPT-4o structured reasoning schemas).
* **Static Analysis (Phase 5)**: Semgrep AST rule engine + Custom SAST heuristics.
* **Deployment Target**: Vercel (Edge/Serverless) + Supabase/Neon PostgreSQL.

---

## 3. Project Structure

```text
devpulse-ai/
├── app/
│   ├── layout.tsx                # Root layout, theme fonts & metadata
│   ├── page.tsx                  # Public DevPulse AI landing page
│   ├── globals.css               # Design tokens, cyber aesthetics, glow styles
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard shell (Sidebar + Header + Mobile Drawer)
│   │   ├── page.tsx              # Dashboard overview (metrics, recent projects, AI feed)
│   │   ├── projects/page.tsx     # Project catalog & health scores
│   │   ├── analyzer/page.tsx     # Code Analyzer workbench
│   │   ├── security/page.tsx     # Security & Vulnerability Hub
│   │   ├── assistant/page.tsx    # DevPulse AI Assistant conversational UI
│   │   ├── reports/page.tsx      # Quality & Security executive reports
│   │   └── settings/page.tsx     # Workspace, model, and scanner settings
│   ├── projects/page.tsx         # Route forwarder to /dashboard/projects
│   ├── analyzer/page.tsx         # Route forwarder to /dashboard/analyzer
│   ├── security/page.tsx         # Route forwarder to /dashboard/security
│   ├── reports/page.tsx          # Route forwarder to /dashboard/reports
│   └── settings/page.tsx         # Route forwarder to /dashboard/settings
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Landing public navbar
│   │   ├── Footer.tsx            # Landing footer & status indicator
│   │   ├── Sidebar.tsx           # Dashboard persistent sidebar
│   │   └── Header.tsx            # Dashboard top navbar & breadcrumbs
│   ├── landing/
│   │   ├── HeroSection.tsx       # Hero, CTA, & interactive code review simulation
│   │   ├── FeatureGrid.tsx       # Core capabilities showcase
│   │   ├── HowItWorks.tsx        # 3-step workflow pipeline
│   │   ├── SecuritySection.tsx   # Security principles & CWE matrix
│   │   ├── AICapabilities.tsx    # AI Assistant showcase
│   │   └── CTASection.tsx        # Bottom conversion banner
│   └── ui/
│       ├── Button.tsx            # Reusable button with variants
│       ├── Badge.tsx             # Severity & status badges
│       ├── Card.tsx              # Dark-mode glassmorphic container
│       └── MetricCard.tsx        # Metric analytics card with trends
├── lib/
│   └── utils.ts                  # Classnames & formatting helpers
├── types/
│   └── index.ts                  # Domain TypeScript interfaces
├── .env.example                  # Environment configuration template
└── README.md                     # Platform documentation
```

---

## 4. Development & Installation

### Prerequisites
* Node.js `>= 18.0.0`
* npm `>= 9.0.0`

### Setup Instructions
1. Navigate to the project directory:
   ```bash
   cd devpulse-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Launch local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to preview the landing page, or `http://localhost:3000/dashboard` for the console.

### Default Demo Credentials
* **Email**: `developer@devpulse.ai`
* **Password**: `DevPulse2026!`

### Build & Production Verification
```bash
# Run integration tests
node tests/test_crud.mjs
node tests/test_auth.mjs

# Production build check
npm run build
npm run start
```

---

## 5. Security & Isolation Architecture

* **Zero Secret Storage**: API keys and auth secrets are managed strictly server-side through environment variables.
* **No Server Execution of Untrusted Code**: Uploaded source code is parsed strictly as syntax trees (ASTs) without executing binaries or scripts on the host server.
* **Triaged Finding Confidence**: Every flagged finding is categorized as *Confirmed Static AST*, *Potential Heuristic*, or *Informational* to minimize false positives.
* **Transparent Scoring**: Security score formulas explicitly deduct points based on MITRE CWE severity weights rather than black-box algorithms.

---

## 6. Development Roadmap & Completed Phases

- [x] **Phase 1: Foundation Shell** (Next.js 16, TypeScript, Tailwind CSS v4, Landing Page, Dashboard Shell, Navigation, Dark Mode Cybersecurity Aesthetic)
- [x] **Phase 2: Database & Prisma CRUD** (Prisma ORM, SQLite/PostgreSQL schema, Project CRUD, Live Aggregations, Comprehensive Seed Data, Automated Test Suite)
- [x] **Phase 3: Authentication & Protection** (Bcrypt password hashing, Jose JWT HTTP-only cookies, Session DB model, Protected Route Middleware, Login/Signup UIs)
- [x] **Phase 4: Code Analyzer Engine** (Dual-engine: OpenAI GPT-4o / Deterministic AST, complexity metrics, syntax triage, automated refactoring diffs, test generation)
- [x] **Phase 5: Security SAST Scanner** (Comprehensive CWE detection: SQLi, Secrets, XSS, Cmd Injection, SSRF, Path Traversal, Weak Crypto; transparent score deductions)
- [x] **Phase 6: Project-Aware AI Assistant** (Contextual chat API, persistent ChatSession & ChatMessage DB models, project context injection, rich markdown & code copy)
- [x] **Phase 7: Reports & Health Metrics** (JSON & Markdown executive export endpoints, transparent score penalty formulas, 4-factor health breakdown)
- [x] **Phase 8: GitHub Integration & PR Reviews** (PR review simulator, diff visualizer, inline security findings, quality scorecard, PR audit workflows)

---

## 7. Verification & Test Suites

DevPulse AI features automated integration test suites for all layers:
```bash
# 1. Project CRUD & Aggregation Tests
node tests/test_crud.mjs

# 2. Authentication, Cookie, and Route Guard Tests
node tests/test_auth.mjs

# 3. Full 10-Point End-to-End Test Suite across all APIs
node tests/test_full_suite.mjs
```
