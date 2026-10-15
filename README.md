# ScaleupMap Smart Onboarding & Jev AI Weighted Decision Engine

> **Challenge 2: Smarter Onboarding** — Built for ScaleupMap with Jev AI decision modeling, multi-factor weight calibration, and automated tool routing.

---

## 🌟 Executive Summary

This project implements an intelligent onboarding system for [ScaleupMap](https://scaleupmap.com) using the specifications in [`scaleupmap-platform-reference.md`](file:///C:/NAIT/Personal%20Projects/HackAThon/scaleupmap-platform-reference.md). 

Instead of treating onboarding as a static questionnaire, this system evaluates founder responses using a **Jev AI System-1 Multi-Factor Scoring Engine** that outputs a normalized **6-dimensional cognitive weight vector**:
1. `strategic_clarity` (Problem-solution fit, positioning, and target ICP)
2. `traction_readiness` (Early customer velocity, retention, and sales repeatability)
3. `capital_readiness` (Readiness for investor diligence, pitch deck, and data room)
4. `investor_fit` (Alignment with angels, institutional VCs, and non-dilutive grants)
5. `execution_velocity` (Sprint discipline, KPI rigor, and operational throughput)
6. `risk_mitigation` (Proactive detection and mitigation of investor red flags)

The engine calculates affinity scores across all 7 platform destinations from `scaleupmap-platform-reference.md`:
- **ScaleupMap Score™ & Risk Mitigation** (`/dashboard/score`)
- **North Star Sprint & Execution Coach** (`/coach/north-star-sprint`)
- **Investment Memo & Tearsheet Workbench** (`/dashboard/memo`)
- **Investor & Grants Capital Directory** (`/entities#static-investors`)
- **Coach Journey Map & Lean Canvas** (`/coach?view=map`)
- **Pitch Deck Score & Diagnostic** (`/dashboard/score/deck`)
- **Founder OS / AI Business Co-Founder** (`/dashboard/venture-chat`)

It then routes the user, provides an interactive **Destination Simulator** with telemetry tracking (*"tracks whether it worked"*), delivers **personalized email coaching tips** (Bonus 1), and generates a **30-day engagement retention calendar** (Bonus 2).

---

## 🚀 Key Features

| Requirement | Implementation in System |
|---|---|
| **Collects answers about the user** | Multi-step dynamic survey: stage, multi-select platform goals, deck status, team size, primary bottleneck, capital timeline. |
| **Stores them as a profile** | Django ORM models: [`UserProfile`](file:///C:/NAIT/Personal%20Projects/HackAThon/backend/scaleupmap/onboarding/models.py#L4-L18) and [`JevWeightProfile`](file:///C:/NAIT/Personal%20Projects/HackAThon/backend/scaleupmap/onboarding/models.py#L21-L63). |
| **Decides which tool they need** | [`compute_jev_weights`](file:///C:/NAIT/Personal%20Projects/HackAThon/backend/scaleupmap/onboarding/engine.py#L328-L432) calculates 6-dimensional Jev weights and Softmax candidate tool distribution with margin-based confidence. |
| **Sends them there & tracks whether it worked** | Interactive **Destination Simulator** + [`ToolInteractionTrack`](file:///C:/NAIT/Personal%20Projects/HackAThon/backend/scaleupmap/onboarding/models.py#L65-L76) logging session events, workflow completion, and exports. |
| **Two different users getting two different results** | 1-click presets bar + dedicated **Side-by-Side User Comparison** tab showing User A vs. User B with visual weight diffs and distinct destinations. |
| **Decision logic display** | **Decision Logic Tab** with visual interactive flowchart, mathematical weights matrix, and Python algorithm code. |
| **Bonus 1: Email coaching tips** | Dynamic email tips generated for Day 1, Day 4, and Day 10 based on stage and primary bottleneck. |
| **Bonus 2: 30-day engagement calendar** | Automated milestone schedule guiding the founder week-by-week. |

---

## 👥 Two Different Users Getting Two Different Results

### User A: Maya Patel (Pre-Seed Ideation)
- **Journey Stage:** Looking for an idea (`looking_for_idea`)
- **Platform Goals:** Validate strategic direction, win early customers
- **Deck Status:** None yet (`none`)
- **Bottleneck:** Problem-Solution Fit & Value Proposition
- **Jev AI Dimensional Focus:** `strategic_clarity` (0.84), `risk_mitigation` (0.35), `capital_readiness` (0.12)
- **Selected Destination:** **Coach Journey Map & Lean Canvas** (`/coach?view=map`)
- **Rationale:** High strategic clarity urgency requires defining hypotheses and value proposition before creating pitch collateral.

### User B: David Vance (Seed Round Raiser)
- **Journey Stage:** Raising a first round (`raising_first_round`)
- **Platform Goals:** Raise funding, expose investor blind spots, find investors
- **Deck Status:** Draft needs review (`draft_needs_review`)
- **Bottleneck:** Diligence Readiness & Investor Scrutiny
- **Jev AI Dimensional Focus:** `capital_readiness` (0.94), `risk_mitigation` (0.88), `investor_fit` (0.80)
- **Selected Destination:** **ScaleupMap Score™ & Risk Mitigation** (`/dashboard/score`) / **Investment Memo** (`/dashboard/memo`)
- **Rationale:** Immediate 30-day round closing requires uncovering diligence blind spots and generating institutional memos.

---

## 📐 Mathematical Formulation of Jev AI Scoring

For each dimension $d \in \mathcal{D}$ and tool route $t \in \mathcal{T}$:

$$\text{RawScore}_d = \text{Base}_d + \sum_{q \in \text{Answers}} w_{q, d}$$

$$\text{ToolAffinity}_t = \text{BaseAffinity}_t + \sum_{q \in \text{Answers}} \alpha_{q, t}$$

### Normalization
$$\text{JevWeight}_d = \text{clip}\left( \frac{\text{RawScore}_d}{\max_{k} \text{RawScore}_k \times 1.05}, 0.12, 0.98 \right)$$

$$\text{ToolProbability}_t = \frac{\text{ToolAffinity}_t}{\sum_{j \in \mathcal{T}} \text{ToolAffinity}_j} \times 100$$

$$\text{Confidence} = \text{clip}\left(0.72 + 0.40 \times \frac{\text{Score}_{\text{top}} - \text{Score}_{\text{runner-up}}}{\text{Score}_{\text{top}}}, 0.72, 0.98\right)$$

---

## 🛠️ Architecture & Project Structure

```
├── backend/
│   ├── scaleupmap/
│   │   ├── manage.py
│   │   ├── onboarding/
│   │   │   ├── models.py            # UserProfile, JevWeightProfile, ToolInteractionTrack
│   │   │   ├── engine.py            # Jev AI scoring engine, schemas, presets
│   │   │   ├── views.py             # API endpoints (questions, evaluate, track, analytics)
│   │   │   ├── urls.py              # /api/ routes
│   │   │   ├── tests.py             # Unit and integration test suite
│   │   │   └── management/commands/ # seed_demo_data command
│   │   └── scaleupmap/
│   │       ├── settings.py          # CORS, apps, database
│   │       └── urls.py
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main application orchestrator
│   │   ├── App.css                  # ScaleupMap branding and responsive styles
│   │   ├── index.css                # CSS variables, typography tokens
│   │   ├── components/
│   │   │   ├── Header.jsx           # ScaleupMap header with live status
│   │   │   ├── PresetBar.jsx        # 1-click user archetype switcher
│   │   │   ├── Questionnaire.jsx    # Smart survey form
│   │   │   ├── JevWeightsVisualizer.jsx # 6D tensor and candidate tool distribution
│   │   │   ├── RecommendationCard.jsx   # Top tool, email tips, 30-day calendar
│   │   │   ├── DestinationSimulator.jsx # Telemetry tracking simulator
│   │   │   ├── UserComparisonModal.jsx  # Side-by-side comparison mode
│   │   │   ├── DecisionLogicModal.jsx   # Flowchart, matrix, code viewer
│   │   │   └── AnalyticsView.jsx        # Telemetry conversion stats & profiles table
│   │   ├── services/
│   │   │   └── api.js               # Frontend-backend HTTP client
│   │   └── data/
│   │       └── fallbackData.js      # Metadata and fallback schema
│   ├── index.html                   # DM Sans & DM Serif Display Google fonts
│   └── vite.config.js               # Dev server & /api proxy
└── scaleupmap-platform-reference.md # Official platform specification
```

---

## 🚦 How to Run the Projects

### 1. Backend (Django)
```powershell
cd "backend\scaleupmap"
# Run migrations (already applied)
..\venv\Scripts\python.exe manage.py migrate

# Seed sample demo profiles (already seeded)
..\venv\Scripts\python.exe manage.py seed_demo_data

# Run test suite
..\venv\Scripts\python.exe manage.py test onboarding

# Start server
..\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

### 2. Frontend (React + Vite)
```powershell
cd "frontend"
# Install dependencies (already installed)
npm.cmd install

# Start Vite dev server
npm.cmd run dev
```

Visit **`http://localhost:5173`** in your browser.
The API is live at **`http://127.0.0.1:8000/api/`**.
