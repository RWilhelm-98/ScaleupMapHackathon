from django.db import models


class UserProfile(models.Model):
    name = models.CharField(max_length=150, default="Anonymous Founder")
    email = models.EmailField(blank=True, default="")
    role = models.CharField(max_length=50, default="venture")
    journey_stage = models.CharField(max_length=50)
    platform_goals = models.JSONField(default=list)
    team_size = models.CharField(max_length=50, default="solo")
    pitch_deck_status = models.CharField(max_length=50, default="none")
    primary_bottleneck = models.CharField(max_length=50, blank=True, default="")
    capital_timeline = models.CharField(max_length=50, blank=True, default="")
    raw_answers = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.journey_stage})"


class JevWeightProfile(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='jev_profiles')
    strategic_clarity = models.FloatField(default=0.0)
    traction_readiness = models.FloatField(default=0.0)
    capital_readiness = models.FloatField(default=0.0)
    investor_fit = models.FloatField(default=0.0)
    execution_velocity = models.FloatField(default=0.0)
    risk_mitigation = models.FloatField(default=0.0)
    
    tool_scores = models.JSONField(default=dict)
    recommended_tool_route = models.CharField(max_length=200)
    recommended_tool_name = models.CharField(max_length=200)
    confidence_score = models.FloatField(default=0.0)
    decision_rationale = models.TextField(default="")
    secondary_tool = models.JSONField(default=dict)
    email_tips = models.JSONField(default=list)
    engagement_milestones = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_profile_id,
            "weights": {
                "strategic_clarity": round(self.strategic_clarity, 3),
                "traction_readiness": round(self.traction_readiness, 3),
                "capital_readiness": round(self.capital_readiness, 3),
                "investor_fit": round(self.investor_fit, 3),
                "execution_velocity": round(self.execution_velocity, 3),
                "risk_mitigation": round(self.risk_mitigation, 3),
            },
            "tool_scores": self.tool_scores,
            "recommendation": {
                "route": self.recommended_tool_route,
                "name": self.recommended_tool_name,
                "confidence": round(self.confidence_score, 2),
                "rationale": self.decision_rationale,
                "secondary_tool": self.secondary_tool,
            },
            "email_tips": self.email_tips,
            "engagement_milestones": self.engagement_milestones,
            "created_at": self.created_at.isoformat(),
        }


class ToolInteractionTrack(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='interactions')
    tool_route = models.CharField(max_length=200)
    action = models.CharField(max_length=100)  # e.g., 'routed', 'tool_opened', 'task_completed'
    status = models.CharField(max_length=50, default="success")  # 'success', 'bounced', 'in_progress'
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_profile.name} - {self.action} on {self.tool_route}"
