import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import UserProfile, JevWeightProfile, ToolInteractionTrack
from .engine import (
    QUESTION_SCHEMA,
    TOOLS_MAP,
    DIMENSIONS,
    compute_jev_weights,
    get_demo_presets,
)


@require_http_methods(["GET"])
def get_questions_view(request):
    """Returns the question schema, dimensions, tools catalog, and demo presets."""
    return JsonResponse({
        "status": "success",
        "dimensions": {
            "strategic_clarity": "Clarity of problem-solution fit, positioning, and target ICP",
            "traction_readiness": "Early customer velocity, retention, and sales repeatability",
            "capital_readiness": "Readiness for investor diligence, pitch deck, and data room",
            "investor_fit": "Alignment with angels, institutional VCs, and non-dilutive grants",
            "execution_velocity": "Sprint discipline, KPI rigor, and operational throughput",
            "risk_mitigation": "Proactive detection and mitigation of investor red flags",
        },
        "tools": TOOLS_MAP,
        "questions": QUESTION_SCHEMA,
        "presets": get_demo_presets(),
    })


@csrf_exempt
@require_http_methods(["POST"])
def evaluate_view(request):
    """
    Evaluates questionnaire answers, generates Jev AI dimensional weights,
    stores profile and Jev results, and records routing event.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    name = data.get("name", "Founder").strip() or "Founder"
    email = data.get("email", "").strip()
    role = data.get("role", "venture")
    answers = data.get("answers", {})

    if not isinstance(answers, dict):
        return JsonResponse({"error": "Answers must be a JSON object"}, status=400)

    # Compute weights via Jev Engine
    evaluation = compute_jev_weights(answers)

    # Save User Profile
    user = UserProfile.objects.create(
        name=name,
        email=email,
        role=role,
        journey_stage=answers.get("journey_stage", ""),
        platform_goals=answers.get("platform_goals", []),
        team_size=answers.get("team_size", "solo"),
        pitch_deck_status=answers.get("pitch_deck_status", "none"),
        primary_bottleneck=answers.get("primary_bottleneck", ""),
        capital_timeline=answers.get("capital_timeline", ""),
        raw_answers=answers,
    )

    weights = evaluation["dimensional_weights"]
    rec = evaluation["recommendation"]

    # Save Jev Profile
    jev_profile = JevWeightProfile.objects.create(
        user_profile=user,
        strategic_clarity=weights["strategic_clarity"],
        traction_readiness=weights["traction_readiness"],
        capital_readiness=weights["capital_readiness"],
        investor_fit=weights["investor_fit"],
        execution_velocity=weights["execution_velocity"],
        risk_mitigation=weights["risk_mitigation"],
        tool_scores=evaluation["tool_scores"],
        recommended_tool_route=rec["route"],
        recommended_tool_name=rec["name"],
        confidence_score=rec["confidence"],
        decision_rationale=rec["rationale"],
        secondary_tool=rec["secondary_tool"],
        email_tips=evaluation["email_tips"],
        engagement_milestones=evaluation["engagement_milestones"],
    )

    # Initial interaction tracking event
    ToolInteractionTrack.objects.create(
        user_profile=user,
        tool_route=rec["route"],
        action="routed",
        status="success",
        metadata={"confidence": rec["confidence"], "stage": user.journey_stage},
    )

    return JsonResponse({
        "status": "success",
        "profile": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "journey_stage": user.journey_stage,
            "platform_goals": user.platform_goals,
            "team_size": user.team_size,
        },
        "evaluation": evaluation,
        "jev_profile_id": jev_profile.id,
    })


@csrf_exempt
@require_http_methods(["POST"])
def track_interaction_view(request):
    """
    Logs user tool navigation and interaction status
    (Satisfies README 'tracks whether it worked').
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    user_id = data.get("user_id")
    tool_route = data.get("tool_route", "")
    action = data.get("action", "tool_clicked")
    status = data.get("status", "success")
    metadata = data.get("metadata", {})

    user = None
    if user_id:
        try:
            user = UserProfile.objects.get(id=user_id)
        except UserProfile.DoesNotExist:
            user = None

    if not user:
        # Fallback to latest or create guest profile
        user = UserProfile.objects.last()
        if not user:
            user = UserProfile.objects.create(name="Guest Founder", journey_stage="early_traction")

    track = ToolInteractionTrack.objects.create(
        user_profile=user,
        tool_route=tool_route,
        action=action,
        status=status,
        metadata=metadata,
    )

    return JsonResponse({
        "status": "success",
        "track_id": track.id,
        "user_id": user.id,
        "action": track.action,
        "tool_route": track.tool_route,
        "recorded_at": track.created_at.isoformat(),
    })


@require_http_methods(["GET"])
def list_profiles_view(request):
    """Lists evaluated profiles to compare different users and their resulting Jev weights."""
    profiles_data = []
    for profile in JevWeightProfile.objects.select_related("user_profile").order_by("-created_at")[:20]:
        profiles_data.append({
            "id": profile.id,
            "user_id": profile.user_profile_id,
            "name": profile.user_profile.name,
            "email": profile.user_profile.email,
            "journey_stage": profile.user_profile.journey_stage,
            "weights": {
                "strategic_clarity": round(profile.strategic_clarity, 3),
                "traction_readiness": round(profile.traction_readiness, 3),
                "capital_readiness": round(profile.capital_readiness, 3),
                "investor_fit": round(profile.investor_fit, 3),
                "execution_velocity": round(profile.execution_velocity, 3),
                "risk_mitigation": round(profile.risk_mitigation, 3),
            },
            "recommended_tool": {
                "route": profile.recommended_tool_route,
                "name": profile.recommended_tool_name,
                "confidence": profile.confidence_score,
            },
            "created_at": profile.created_at.isoformat(),
        })

    return JsonResponse({"status": "success", "count": len(profiles_data), "profiles": profiles_data})


@require_http_methods(["GET"])
def get_analytics_view(request):
    """Returns routing analytics and conversion stats."""
    total_users = UserProfile.objects.count()
    total_evaluations = JevWeightProfile.objects.count()
    total_interactions = ToolInteractionTrack.objects.count()

    # Tool route counts
    routes_count = {}
    for p in JevWeightProfile.objects.all():
        routes_count[p.recommended_tool_route] = routes_count.get(p.recommended_tool_route, 0) + 1

    # Action counts
    actions_count = {}
    for t in ToolInteractionTrack.objects.all():
        actions_count[t.action] = actions_count.get(t.action, 0) + 1

    return JsonResponse({
        "status": "success",
        "metrics": {
            "total_users": total_users,
            "total_evaluations": total_evaluations,
            "total_tracked_actions": total_interactions,
            "routed_tools_distribution": routes_count,
            "interaction_types": actions_count,
        }
    })
