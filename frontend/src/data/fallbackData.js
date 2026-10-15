// Fallback questionnaire schema & tools definitions
export const TOOLS_MAP = {
  "/dashboard/score": {
    name: "ScaleupMap Score™ & Risk Mitigation",
    category: "Venture Intelligence",
    description: "Investor-grade snapshot measuring venture risk, blind spots, and investability before meeting investors.",
    badge: "Core Diagnostic",
    icon: "chart-bar",
  },
  "/coach/north-star-sprint": {
    name: "North Star Sprint & Execution Coach",
    category: "Execution & Growth",
    description: "Weekly structured sprint framework to win customers, accelerate traction, and keep the team aligned.",
    badge: "High Velocity",
    icon: "target",
  },
  "/dashboard/memo": {
    name: "Investment Memo & Tearsheet Workbench",
    category: "Fundraising",
    description: "Automated investor-ready memos and one-page tearsheets that synthesize key metrics for capital raising.",
    badge: "Investor Ready",
    icon: "file-text",
  },
  "/entities#static-investors": {
    name: "Investor & Grants Capital Directory",
    category: "Capital Access",
    description: "Direct dealflow discovery connecting startups with active angel syndicates, venture funds, and non-dilutive grants.",
    badge: "Capital Matching",
    icon: "database",
  },
  "/coach?view=map": {
    name: "Coach Journey Map & Lean Canvas",
    category: "Strategy & Validation",
    description: "Visual milestone map and strategic canvas to validate venture direction and test problem-solution fit.",
    badge: "Strategic Foundation",
    icon: "map",
  },
  "/dashboard/score/deck": {
    name: "Pitch Deck Score & Diagnostic",
    category: "Pitch Preparation",
    description: "AI analysis of slide deck storytelling, financial projections, and presentation rigor.",
    badge: "Deck Review",
    icon: "presentation",
  },
  "/dashboard/venture-chat": {
    name: "Founder OS / AI Business Co-Founder",
    category: "AI Co-Founder",
    description: "24/7 strategic sparring partner assisting solo founders in modeling assumptions and unblocking hurdles.",
    badge: "Always-on Advisory",
    icon: "bot",
  },
};

export const DIMENSIONS_INFO = {
  strategic_clarity: {
    label: "Strategic Clarity",
    description: "Clarity of value proposition, ICP, and problem-solution fit.",
    color: "#3b82f6",
  },
  traction_readiness: {
    label: "Traction Readiness",
    description: "Customer velocity, retention, and go-to-market mechanics.",
    color: "#10b981",
  },
  capital_readiness: {
    label: "Capital Readiness",
    description: "Institutional materials, memo, financial narrative.",
    color: "#8b5cf6",
  },
  investor_fit: {
    label: "Investor & Grant Fit",
    description: "Alignment with angels, institutional funds, and non-dilutive capital.",
    color: "#f59e0b",
  },
  execution_velocity: {
    label: "Execution Velocity",
    description: "Sprint cadence, weekly goal setting, and team throughput.",
    color: "#06b6d4",
  },
  risk_mitigation: {
    label: "Risk Mitigation",
    description: "Pre-empting diligence red flags and blind spots.",
    color: "#ef4444",
  },
};

export const DEMO_PRESETS = [
  {
    preset_id: "founder_pre_seed_ideation",
    name: "Maya Patel",
    email: "maya@validatestartup.io",
    persona: "Pre-Seed Ideation Founder",
    tagline: "Solo builder validating direction & problem-solution fit",
    role: "venture",
    answers: {
      journey_stage: "looking_for_idea",
      platform_goals: ["validate_direction", "win_customers"],
      pitch_deck_status: "none",
      team_size: "solo",
      primary_bottleneck: "problem_solution",
      capital_timeline: "bootstrapped",
    },
    expected_outcome: {
      recommended_tool: "Coach Journey Map & Lean Canvas",
      route: "/coach?view=map",
      focus: "Strategic Clarity & Problem Discovery",
    },
  },
  {
    preset_id: "founder_seed_fundraising",
    name: "David Vance",
    email: "david@hypermesh.ai",
    persona: "Seed Round Raiser",
    tagline: "Raising $1.5M seed round with draft deck in next 30 days",
    role: "venture",
    answers: {
      journey_stage: "raising_first_round",
      platform_goals: ["raise_funding", "investor_blind_spots", "find_funding"],
      pitch_deck_status: "draft_needs_review",
      team_size: "2_to_5",
      primary_bottleneck: "diligence_readiness",
      capital_timeline: "immediate_30d",
    },
    expected_outcome: {
      recommended_tool: "ScaleupMap Score™ & Risk Mitigation",
      route: "/dashboard/score",
      focus: "Capital Readiness & Investor Diligence",
    },
  },
  {
    preset_id: "founder_early_traction_execution",
    name: "Elena Rostova",
    email: "elena@scalegear.tech",
    persona: "Early Traction Operator",
    tagline: "Post-MVP product with 10 paying pilots, needing weekly execution cadence",
    role: "venture",
    answers: {
      journey_stage: "early_traction",
      platform_goals: ["win_customers", "execution_focus"],
      pitch_deck_status: "draft_needs_review",
      team_size: "2_to_5",
      primary_bottleneck: "team_cadence",
      capital_timeline: "3_6_months",
    },
    expected_outcome: {
      recommended_tool: "North Star Sprint & Execution Coach",
      route: "/coach/north-star-sprint",
      focus: "Execution Velocity & Customer Sprints",
    },
  },
];
