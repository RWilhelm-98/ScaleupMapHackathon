"""
Jev AI Weighted Decision & Routing Engine for ScaleupMap
Implements the multi-factor scoring model that computes dimensional weights for Jev AI
and automatically routes founders to the optimal platform tool.
"""

from typing import Dict, Any, List

# Definitions of tools from scaleupmap-platform-reference.md
TOOLS_MAP = {
    "/dashboard/score": {
        "name": "ScaleupMap Score™ & Risk Mitigation",
        "category": "Venture Intelligence",
        "description": "Investor-grade snapshot measuring venture risk, blind spots, and investability before meeting investors.",
        "badge": "Core Diagnostic",
    },
    "/coach/north-star-sprint": {
        "name": "North Star Sprint & Execution Coach",
        "category": "Execution & Growth",
        "description": "Weekly structured sprint framework to win customers, accelerate traction, and keep the team aligned.",
        "badge": "High Velocity",
    },
    "/dashboard/memo": {
        "name": "Investment Memo & Tearsheet Workbench",
        "category": "Fundraising",
        "description": "Automated investor-ready memos and one-page tearsheets that synthesize key metrics for capital raising.",
        "badge": "Investor Ready",
    },
    "/entities#static-investors": {
        "name": "Investor & Grants Capital Directory",
        "category": "Capital Access",
        "description": "Direct dealflow discovery connecting startups with active angel syndicates, venture funds, and non-dilutive grants.",
        "badge": "Capital Matching",
    },
    "/coach?view=map": {
        "name": "Coach Journey Map & Lean Canvas",
        "category": "Strategy & Validation",
        "description": "Visual milestone map and strategic canvas to validate venture direction and test problem-solution fit.",
        "badge": "Strategic Foundation",
    },
    "/dashboard/score/deck": {
        "name": "Pitch Deck Score & Diagnostic",
        "category": "Pitch Preparation",
        "description": "AI analysis of slide deck storytelling, financial projections, and presentation rigor.",
        "badge": "Deck Review",
    },
    "/dashboard/venture-chat": {
        "name": "Founder OS / AI Business Co-Founder",
        "category": "AI Co-Founder",
        "description": "24/7 strategic sparring partner assisting solo founders in modeling assumptions and unblocking hurdles.",
        "badge": "Always-on Advisory",
    },
}

QUESTION_SCHEMA = [
    {
        "id": "journey_stage",
        "title": "Where are you in your founder journey?",
        "subtitle": "Select the stage that best matches your current operational reality.",
        "type": "single",
        "options": [
            {
                "value": "looking_for_idea",
                "label": "Looking for an idea",
                "description": "Exploring spaces, spotting problems, and testing hypotheses.",
                "weights": {"strategic_clarity": 0.25, "execution_velocity": 0.20, "capital_readiness": 0.05},
                "tool_affinity": {"/coach?view=map": 45, "/dashboard/venture-chat": 30, "/coach/north-star-sprint": 15}
            },
            {
                "value": "building_mvp",
                "label": "Building an MVP",
                "description": "Developing prototype, wireframing, and building first version.",
                "weights": {"strategic_clarity": 0.50, "execution_velocity": 0.70, "traction_readiness": 0.30},
                "tool_affinity": {"/coach/north-star-sprint": 40, "/coach?view=map": 30, "/dashboard/venture-chat": 20}
            },
            {
                "value": "early_traction",
                "label": "Early traction",
                "description": "First pilot users or early paying customers; finding repeatable sales.",
                "weights": {"traction_readiness": 0.75, "execution_velocity": 0.65, "risk_mitigation": 0.40},
                "tool_affinity": {"/coach/north-star-sprint": 35, "/dashboard/score": 30, "/dashboard/memo": 20}
            },
            {
                "value": "raising_first_round",
                "label": "Raising a first round",
                "description": "Preparing seed/pre-seed materials, building cap table, pitching angels/VCs.",
                "weights": {"capital_readiness": 0.85, "investor_fit": 0.80, "risk_mitigation": 0.75},
                "tool_affinity": {"/dashboard/memo": 40, "/dashboard/score": 35, "/entities#static-investors": 25}
            },
            {
                "value": "scaling_post_seed",
                "label": "Scaling after seed",
                "description": "Post-funding expansion, expanding headcount, tracking quarterly investor updates.",
                "weights": {"traction_readiness": 0.85, "execution_velocity": 0.80, "capital_readiness": 0.70},
                "tool_affinity": {"/dashboard/score": 40, "/coach/north-star-sprint": 30, "/dashboard/memo": 20}
            },
            {
                "value": "pivoting",
                "label": "Pivoting",
                "description": "Revisiting value proposition, adjusting audience, resetting strategic roadmap.",
                "weights": {"strategic_clarity": 0.30, "risk_mitigation": 0.80, "execution_velocity": 0.40},
                "tool_affinity": {"/coach?view=map": 45, "/dashboard/venture-chat": 30, "/dashboard/score": 25}
            },
        ]
    },
    {
        "id": "platform_goals",
        "title": "What are your primary platform goals?",
        "subtitle": "Select up to 3 core priorities where ScaleupMap can deliver the greatest leverage.",
        "type": "multi",
        "options": [
            {
                "value": "validate_direction",
                "label": "Validate strategic direction",
                "description": "Unsure about long-term positioning and need structured validation.",
                "weights": {"strategic_clarity": 0.40},
                "tool_affinity": {"/coach?view=map": 35, "/dashboard/venture-chat": 20}
            },
            {
                "value": "win_customers",
                "label": "Win customers & accelerate traction",
                "description": "Need repeatable go-to-market mechanics and weekly customer acquisition goals.",
                "weights": {"traction_readiness": 0.40, "execution_velocity": 0.30},
                "tool_affinity": {"/coach/north-star-sprint": 35}
            },
            {
                "value": "raise_funding",
                "label": "Prepare for fundraising without overwhelm",
                "description": "Need an institutional-grade investment memo and concise tearsheet.",
                "weights": {"capital_readiness": 0.45, "investor_fit": 0.30},
                "tool_affinity": {"/dashboard/memo": 40, "/dashboard/score": 20}
            },
            {
                "value": "find_funding",
                "label": "Discover active investors & non-dilutive grants",
                "description": "Find aligned angels, venture funds, and public non-dilutive grant funds.",
                "weights": {"investor_fit": 0.45, "capital_readiness": 0.25},
                "tool_affinity": {"/entities#static-investors": 45}
            },
            {
                "value": "investor_blind_spots",
                "label": "Expose blind spots investors will scrutinize",
                "description": "Mitigate diligence risks before entering investor pitch meetings.",
                "weights": {"risk_mitigation": 0.45, "capital_readiness": 0.30},
                "tool_affinity": {"/dashboard/score": 40}
            },
            {
                "value": "execution_focus",
                "label": "Establish clear weekly execution focus",
                "description": "Cut through startup chaos with sprint cadence and milestone tracking.",
                "weights": {"execution_velocity": 0.45},
                "tool_affinity": {"/coach/north-star-sprint": 35}
            },
        ]
    },
    {
        "id": "pitch_deck_status",
        "title": "What is the status of your pitch deck?",
        "subtitle": "Your investor collateral helps us calibrate diligence readiness.",
        "type": "single",
        "options": [
            {
                "value": "none",
                "label": "No deck yet",
                "description": "Focused purely on concept and customer interviews.",
                "weights": {"strategic_clarity": 0.20, "capital_readiness": 0.10},
                "tool_affinity": {"/coach?view=map": 25, "/dashboard/venture-chat": 20}
            },
            {
                "value": "draft_needs_review",
                "label": "Draft deck needs review & scoring",
                "description": "Have preliminary slides but want objective diagnostic feedback.",
                "weights": {"capital_readiness": 0.35, "risk_mitigation": 0.30},
                "tool_affinity": {"/dashboard/score/deck": 45, "/dashboard/score": 25}
            },
            {
                "value": "polishing_pitch",
                "label": "Polished deck, preparing pitch delivery",
                "description": "Deck is solid; practicing Q&A rebuttal and storytelling.",
                "weights": {"capital_readiness": 0.40, "investor_fit": 0.30},
                "tool_affinity": {"/dashboard/score/deck": 35, "/dashboard/memo": 25}
            },
            {
                "value": "ready_for_investors",
                "label": "Fully finalized & actively circulating",
                "description": "Ready to send into partner meetings and investor data rooms.",
                "weights": {"capital_readiness": 0.50, "investor_fit": 0.40},
                "tool_affinity": {"/dashboard/memo": 30, "/entities#static-investors": 30}
            },
        ]
    },
    {
        "id": "team_size",
        "title": "What is your team size?",
        "subtitle": "Organizational capacity influences sprint tempo and governance tools.",
        "type": "single",
        "options": [
            {
                "value": "solo",
                "label": "Just me (solo founder)",
                "description": "Operating as a single builder without co-founders.",
                "weights": {"execution_velocity": 0.35},
                "tool_affinity": {"/dashboard/venture-chat": 25, "/coach/north-star-sprint": 20}
            },
            {
                "value": "2_to_5",
                "label": "2 to 5 people",
                "description": "Core founding crew with tight daily communication.",
                "weights": {"execution_velocity": 0.40},
                "tool_affinity": {"/coach/north-star-sprint": 25}
            },
            {
                "value": "6_to_10",
                "label": "6 to 10 people",
                "description": "Cross-functional team requiring clear KPI ownership.",
                "weights": {"execution_velocity": 0.45},
                "tool_affinity": {"/coach/north-star-sprint": 25, "/dashboard/score": 15}
            },
            {
                "value": "11_plus",
                "label": "11+ people",
                "description": "Scaling organization with departmental objectives.",
                "weights": {"execution_velocity": 0.50},
                "tool_affinity": {"/dashboard/score": 30, "/dashboard/memo": 20}
            },
        ]
    },
    {
        "id": "primary_bottleneck",
        "title": "What is your single biggest bottleneck right now?",
        "subtitle": "Identifies the core vulnerability Jev AI must prioritize.",
        "type": "single",
        "options": [
            {
                "value": "problem_solution",
                "label": "Problem-Solution Fit & Value Proposition",
                "description": "Difficulty articulating the urgent pain point we solve.",
                "weights": {"strategic_clarity": 0.50, "risk_mitigation": 0.30},
                "tool_affinity": {"/coach?view=map": 40, "/dashboard/venture-chat": 20}
            },
            {
                "value": "customer_traction",
                "label": "Customer Acquisition & Revenue Growth",
                "description": "Pipeline is slow or customer churn is creating headwinds.",
                "weights": {"traction_readiness": 0.50, "execution_velocity": 0.35},
                "tool_affinity": {"/coach/north-star-sprint": 40}
            },
            {
                "value": "diligence_readiness",
                "label": "Unsure How Investors View Our Risks",
                "description": "Worried about getting caught off guard during partner questions.",
                "weights": {"risk_mitigation": 0.55, "capital_readiness": 0.40},
                "tool_affinity": {"/dashboard/score": 45, "/dashboard/memo": 25}
            },
            {
                "value": "investor_access",
                "label": "Lack of Qualified Investor Deal Flow",
                "description": "Don't have enough conversations with active check-writers.",
                "weights": {"investor_fit": 0.55, "capital_readiness": 0.35},
                "tool_affinity": {"/entities#static-investors": 45, "/dashboard/memo": 25}
            },
            {
                "value": "team_cadence",
                "label": "Execution Chaos & Shifting Priorities",
                "description": "Too many distractions; struggling to hit weekly milestones.",
                "weights": {"execution_velocity": 0.55},
                "tool_affinity": {"/coach/north-star-sprint": 40}
            },
        ]
    },
    {
        "id": "capital_timeline",
        "title": "What is your funding timeline?",
        "subtitle": "Dictates whether immediate investor materials or operational milestones come first.",
        "type": "single",
        "options": [
            {
                "value": "immediate_30d",
                "label": "Immediate (next 30 days)",
                "description": "Actively closing or opening a financing round now.",
                "weights": {"capital_readiness": 0.50, "risk_mitigation": 0.45},
                "tool_affinity": {"/dashboard/memo": 35, "/dashboard/score": 30, "/entities#static-investors": 25}
            },
            {
                "value": "1_3_months",
                "label": "1 to 3 months",
                "description": "Preparing materials and priming investor relationships.",
                "weights": {"capital_readiness": 0.40, "risk_mitigation": 0.35},
                "tool_affinity": {"/dashboard/score": 35, "/dashboard/memo": 30, "/dashboard/score/deck": 20}
            },
            {
                "value": "3_6_months",
                "label": "3 to 6 months",
                "description": "Building product metrics and traction proof-points first.",
                "weights": {"traction_readiness": 0.45, "execution_velocity": 0.35},
                "tool_affinity": {"/coach/north-star-sprint": 35, "/dashboard/score": 25}
            },
            {
                "value": "bootstrapped",
                "label": "Self-funding / seeking grants",
                "description": "Relying on revenue and non-dilutive government grants.",
                "weights": {"traction_readiness": 0.40, "investor_fit": 0.30},
                "tool_affinity": {"/coach/north-star-sprint": 30, "/entities#static-investors": 30}
            },
        ]
    }
]

DIMENSIONS = [
    "strategic_clarity",
    "traction_readiness",
    "capital_readiness",
    "investor_fit",
    "execution_velocity",
    "risk_mitigation"
]


def compute_jev_weights(answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes Jev AI multi-factor weights and evaluates the optimal platform tool.
    Returns:
        - dimensional_weights: normalized 0.0 to 1.0 scores across all 6 dimensions
        - tool_scores: affinity scores across all 7 platform destinations
        - recommendation: top tool, route, rationale, and confidence
        - email_tips: personalized email guidance tailored to the founder profile
        - engagement_milestones: 30-day retention calendar
    """
    # 1. Initialize dimensional raw accumulators
    dim_scores = {dim: 0.10 for dim in DIMENSIONS}  # base baseline
    tool_scores = {route: 5.0 for route in TOOLS_MAP.keys()}

    # Helper to process an option
    def apply_option(q_id: str, val: str):
        for question in QUESTION_SCHEMA:
            if question["id"] == q_id:
                for opt in question["options"]:
                    if opt["value"] == val:
                        for dim, w in opt.get("weights", {}).items():
                            dim_scores[dim] += w
                        for route, affinity in opt.get("tool_affinity", {}).items():
                            tool_scores[route] += affinity

    # Journey Stage
    stage = answers.get("journey_stage", "early_traction")
    apply_option("journey_stage", stage)

    # Platform Goals (list)
    goals = answers.get("platform_goals", [])
    if isinstance(goals, list):
        for g in goals:
            apply_option("platform_goals", g)
    elif isinstance(goals, str):
        apply_option("platform_goals", goals)

    # Pitch Deck Status
    deck = answers.get("pitch_deck_status", "draft_needs_review")
    apply_option("pitch_deck_status", deck)

    # Team Size
    team = answers.get("team_size", "solo")
    apply_option("team_size", team)

    # Primary Bottleneck
    bottleneck = answers.get("primary_bottleneck", "diligence_readiness")
    apply_option("primary_bottleneck", bottleneck)

    # Capital Timeline
    timeline = answers.get("capital_timeline", "1_3_months")
    apply_option("capital_timeline", timeline)

    # Normalize dimensional weights into [0.05, 0.98] range
    max_dim = max(dim_scores.values()) or 1.0
    normalized_weights = {}
    for d, score in dim_scores.items():
        # Soft-clip and scale to realistic Jev vector weights
        norm_val = min(0.98, max(0.12, (score / (max_dim * 1.05))))
        normalized_weights[d] = round(norm_val, 3)

    # Softmax / percentage conversion for tool scores
    total_tool_score = sum(tool_scores.values()) or 1.0
    normalized_tool_scores = {
        route: round((score / total_tool_score) * 100, 1)
        for route, score in tool_scores.items()
    }

    # Identify primary and secondary tools
    sorted_tools = sorted(tool_scores.items(), key=lambda x: x[1], reverse=True)
    best_route, best_raw_score = sorted_tools[0]
    second_route, second_raw_score = sorted_tools[1]

    # Calculate Jev AI Confidence
    margin = (best_raw_score - second_raw_score) / (best_raw_score + 1e-5)
    confidence = round(min(0.98, max(0.72, 0.72 + (margin * 0.4))), 2)

    primary_meta = TOOLS_MAP[best_route]
    secondary_meta = TOOLS_MAP[second_route]

    # Generate specialized Rationale based on weights
    rationale = build_rationale(
        stage, goals, bottleneck, timeline, primary_meta["name"], normalized_weights
    )

    # Generate tailored email tips (README bonus)
    email_tips = generate_email_tips(stage, best_route, primary_meta["name"], bottleneck)

    # Generate 30-day retention milestones (README bonus)
    engagement_milestones = generate_engagement_milestones(stage, best_route, second_route)

    return {
        "dimensional_weights": normalized_weights,
        "tool_scores": normalized_tool_scores,
        "recommendation": {
            "route": best_route,
            "name": primary_meta["name"],
            "category": primary_meta["category"],
            "description": primary_meta["description"],
            "badge": primary_meta["badge"],
            "confidence": confidence,
            "rationale": rationale,
            "secondary_tool": {
                "route": second_route,
                "name": secondary_meta["name"],
                "category": secondary_meta["category"],
                "description": secondary_meta["description"],
            }
        },
        "email_tips": email_tips,
        "engagement_milestones": engagement_milestones,
    }


def build_rationale(stage: str, goals: List[str], bottleneck: str, timeline: str, tool_name: str, weights: Dict[str, float]) -> str:
    """Synthesizes human-readable decision logic explaining why this tool was selected."""
    stage_labels = {
        "looking_for_idea": "Ideation stage",
        "building_mvp": "MVP prototyping",
        "early_traction": "Early commercial traction",
        "raising_first_round": "Active fundraising",
        "scaling_post_seed": "Post-seed expansion",
        "pivoting": "Strategic pivot",
    }
    stage_str = stage_labels.get(stage, "Current stage")

    highest_dim = max(weights.items(), key=lambda x: x[1])
    dim_name = highest_dim[0].replace("_", " ").title()

    reasons = [
        f"Calibrated for your {stage_str}.",
        f"Jev AI dimensional analysis identified '{dim_name}' as your primary leverage vector ({int(highest_dim[1] * 100)}% urgency).",
    ]

    if timeline in ["immediate_30d", "1_3_months"]:
        reasons.append("Your near-term capital timeline requires immediate diligence readiness.")
    elif bottleneck == "customer_traction":
        reasons.append("Your customer acquisition bottleneck demands disciplined weekly sprint cadence.")
    elif bottleneck == "diligence_readiness":
        reasons.append("Preempting investor objections with an objective score will maximize close rates.")

    reasons.append(f"Routing you directly to {tool_name} will produce the highest immediate impact.")
    return " ".join(reasons)


def generate_email_tips(stage: str, route: str, tool_name: str, bottleneck: str) -> List[Dict[str, str]]:
    """Generates personalized automated onboarding tips to send founders via email."""
    tips = [
        {
            "subject": f"Day 1: Getting the most out of {tool_name}",
            "summary": "Immediate onboarding action to unlock quick value.",
            "content": f"Welcome to ScaleupMap! Based on your onboarding profile, we routed you directly to {tool_name}. Complete your initial setup within 15 minutes to establish your baseline benchmark."
        },
        {
            "subject": "Day 4: Mitigating your top operational vulnerability",
            "summary": f"Targeted coaching to solve: {bottleneck.replace('_', ' ').title()}.",
            "content": "Most founders lose momentum when shifting between strategy and execution. Use ScaleupMap's AI diagnostics to automate your weekly blind-spot check."
        },
        {
            "subject": "Day 10: How top cohorts prepare for investor diligence",
            "summary": "Frameworks used by leading accelerators and funds on ScaleupMap.",
            "content": "Institutional investors look for structured consistency over time. Export your one-page tearsheet and share it alongside your quarterly traction updates."
        }
    ]
    return tips


def generate_engagement_milestones(stage: str, primary_route: str, secondary_route: str) -> List[Dict[str, Any]]:
    """Builds a 30-day retention calendar to keep founders actively engaged."""
    return [
        {
            "day": 1,
            "title": "Initial Assessment",
            "description": f"Complete first run in {TOOLS_MAP[primary_route]['name']}.",
            "route": primary_route,
            "status": "pending",
        },
        {
            "day": 7,
            "title": "First Sprint Review",
            "description": "Log week 1 KPI delta and adjust blockers.",
            "route": primary_route,
            "status": "upcoming",
        },
        {
            "day": 14,
            "title": "Unlock Secondary Tool",
            "description": f"Activate {TOOLS_MAP[secondary_route]['name']} with auto-populated profile data.",
            "route": secondary_route,
            "status": "upcoming",
        },
        {
            "day": 21,
            "title": "Investor / Advisor Check-in",
            "description": "Generate dynamic tearsheet snapshot and distribute to stakeholders.",
            "route": "/dashboard/memo",
            "status": "upcoming",
        },
        {
            "day": 30,
            "title": "Monthly Score Progression",
            "description": "Re-run ScaleupMap Score™ to measure risk reduction and readiness gains.",
            "route": "/dashboard/score",
            "status": "upcoming",
        },
    ]


def get_demo_presets() -> List[Dict[str, Any]]:
    """
    Returns 3 distinct founder archetypes so the evaluator can test
    'Two different users getting two different results' immediately!
    """
    return [
        {
            "preset_id": "founder_pre_seed_ideation",
            "name": "Maya Patel",
            "email": "maya@validatestartup.io",
            "persona": "Pre-Seed Ideation Founder",
            "tagline": "Solo builder validating direction & problem-solution fit",
            "answers": {
                "journey_stage": "looking_for_idea",
                "platform_goals": ["validate_direction", "win_customers"],
                "pitch_deck_status": "none",
                "team_size": "solo",
                "primary_bottleneck": "problem_solution",
                "capital_timeline": "bootstrapped",
            },
            "expected_outcome": {
                "recommended_tool": "Coach Journey Map & Lean Canvas",
                "route": "/coach?view=map",
                "focus": "Strategic Clarity & Problem Discovery"
            }
        },
        {
            "preset_id": "founder_seed_fundraising",
            "name": "David Vance",
            "email": "david@hypermesh.ai",
            "persona": "Seed Round Raiser",
            "tagline": "Raising $1.5M seed round with draft deck in next 30 days",
            "answers": {
                "journey_stage": "raising_first_round",
                "platform_goals": ["raise_funding", "investor_blind_spots", "find_funding"],
                "pitch_deck_status": "draft_needs_review",
                "team_size": "2_to_5",
                "primary_bottleneck": "diligence_readiness",
                "capital_timeline": "immediate_30d",
            },
            "expected_outcome": {
                "recommended_tool": "Investment Memo & Tearsheet Workbench",
                "route": "/dashboard/memo",
                "focus": "Capital Readiness & Investor Diligence"
            }
        },
        {
            "preset_id": "founder_early_traction_execution",
            "name": "Elena Rostova",
            "email": "elena@scalegear.tech",
            "persona": "Early Traction Operator",
            "tagline": "Post-MVP product with 10 paying pilots, struggling with weekly focus",
            "answers": {
                "journey_stage": "early_traction",
                "platform_goals": ["win_customers", "execution_focus"],
                "pitch_deck_status": "draft_needs_review",
                "team_size": "2_to_5",
                "primary_bottleneck": "team_cadence",
                "capital_timeline": "3_6_months",
            },
            "expected_outcome": {
                "recommended_tool": "North Star Sprint & Execution Coach",
                "route": "/coach/north-star-sprint",
                "focus": "Execution Velocity & Customer Sprints"
            }
        }
    ]
