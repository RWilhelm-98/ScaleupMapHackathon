from django.core.management.base import BaseCommand
from onboarding.engine import get_demo_presets, compute_jev_weights
from onboarding.models import UserProfile, JevWeightProfile, ToolInteractionTrack


class Command(BaseCommand):
    help = "Seed demo founder profiles and Jev AI evaluation weights"

    def handle(self, *args, **options):
        presets = get_demo_presets()
        for preset in presets:
            user, created = UserProfile.objects.get_or_create(
                email=preset["email"],
                defaults={
                    "name": preset["name"],
                    "role": "venture",
                    "journey_stage": preset["answers"]["journey_stage"],
                    "platform_goals": preset["answers"]["platform_goals"],
                    "team_size": preset["answers"]["team_size"],
                    "pitch_deck_status": preset["answers"]["pitch_deck_status"],
                    "primary_bottleneck": preset["answers"]["primary_bottleneck"],
                    "capital_timeline": preset["answers"]["capital_timeline"],
                    "raw_answers": preset["answers"],
                }
            )

            eval_res = compute_jev_weights(preset["answers"])
            weights = eval_res["dimensional_weights"]
            rec = eval_res["recommendation"]

            JevWeightProfile.objects.filter(user_profile=user).delete()
            jev_p = JevWeightProfile.objects.create(
                user_profile=user,
                strategic_clarity=weights["strategic_clarity"],
                traction_readiness=weights["traction_readiness"],
                capital_readiness=weights["capital_readiness"],
                investor_fit=weights["investor_fit"],
                execution_velocity=weights["execution_velocity"],
                risk_mitigation=weights["risk_mitigation"],
                tool_scores=eval_res["tool_scores"],
                recommended_tool_route=rec["route"],
                recommended_tool_name=rec["name"],
                confidence_score=rec["confidence"],
                decision_rationale=rec["rationale"],
                secondary_tool=rec["secondary_tool"],
                email_tips=eval_res["email_tips"],
                engagement_milestones=eval_res["engagement_milestones"],
            )

            # Record interaction tracks
            ToolInteractionTrack.objects.get_or_create(
                user_profile=user,
                tool_route=rec["route"],
                action="routed",
                defaults={"status": "success", "metadata": {"confidence": rec["confidence"]}}
            )
            ToolInteractionTrack.objects.get_or_create(
                user_profile=user,
                tool_route=rec["route"],
                action="tool_opened",
                defaults={"status": "success", "metadata": {"time_on_page_sec": 45}}
            )

            self.stdout.write(self.style.SUCCESS(f"Seeded {user.name} -> {rec['name']} ({rec['route']})"))
