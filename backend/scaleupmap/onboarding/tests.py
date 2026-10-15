from django.test import TestCase, Client
from django.urls import reverse
import json
from .engine import compute_jev_weights, get_demo_presets
from .models import UserProfile, JevWeightProfile, ToolInteractionTrack


class JevEngineTests(TestCase):
    def test_two_different_users_get_two_different_results(self):
        """Validates that distinct founder profiles yield distinct Jev weights and routed tools."""
        presets = get_demo_presets()
        user_a = presets[0]  # Pre-seed Idea Stage (Maya)
        user_b = presets[1]  # Seed Round Raiser (David)

        eval_a = compute_jev_weights(user_a["answers"])
        eval_b = compute_jev_weights(user_b["answers"])

        # Tool recommendations should be different
        self.assertNotEqual(eval_a["recommendation"]["route"], eval_b["recommendation"]["route"])

        # Maya should be routed to Journey Map
        self.assertEqual(eval_a["recommendation"]["route"], "/coach?view=map")

        # David should be routed to Venture Score or Memo
        self.assertIn(eval_b["recommendation"]["route"], ["/dashboard/score", "/dashboard/memo"])

        # Jev weights must have all 6 dimensions
        for dim in ["strategic_clarity", "traction_readiness", "capital_readiness", "investor_fit", "execution_velocity", "risk_mitigation"]:
            self.assertIn(dim, eval_a["dimensional_weights"])
            self.assertIn(dim, eval_b["dimensional_weights"])

        # Maya should have higher strategic clarity need than capital readiness
        self.assertGreater(eval_a["dimensional_weights"]["strategic_clarity"], eval_a["dimensional_weights"]["capital_readiness"])

        # David should have higher capital readiness & risk mitigation
        self.assertGreater(eval_b["dimensional_weights"]["capital_readiness"], eval_a["dimensional_weights"]["capital_readiness"])


class OnboardingAPITests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_questions(self):
        response = self.client.get('/api/questions/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("questions", data)
        self.assertIn("dimensions", data)
        self.assertIn("presets", data)

    def test_evaluate_questionnaire_and_track(self):
        payload = {
            "name": "Sarah Connor",
            "email": "sarah@futureventures.co",
            "role": "venture",
            "answers": {
                "journey_stage": "raising_first_round",
                "platform_goals": ["raise_funding", "investor_blind_spots"],
                "pitch_deck_status": "draft_needs_review",
                "team_size": "2_to_5",
                "primary_bottleneck": "diligence_readiness",
                "capital_timeline": "immediate_30d"
            }
        }
        res = self.client.post(
            '/api/evaluate/',
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        user_id = data["profile"]["id"]

        # Check that database records were created
        self.assertTrue(UserProfile.objects.filter(id=user_id).exists())
        self.assertTrue(JevWeightProfile.objects.filter(user_profile_id=user_id).exists())
        self.assertTrue(ToolInteractionTrack.objects.filter(user_profile_id=user_id).exists())

        # Test tracking an interaction
        track_payload = {
            "user_id": user_id,
            "tool_route": data["evaluation"]["recommendation"]["route"],
            "action": "completed_first_run",
            "status": "success",
            "metadata": {"time_spent_seconds": 120}
        }
        track_res = self.client.post(
            '/api/track/',
            data=json.dumps(track_payload),
            content_type="application/json"
        )
        self.assertEqual(track_res.status_code, 200)
        self.assertEqual(track_res.json()["status"], "success")

        # Test listing profiles
        list_res = self.client.get('/api/profiles/')
        self.assertEqual(list_res.status_code, 200)
        self.assertGreaterEqual(list_res.json()["count"], 1)

        # Test analytics
        analytics_res = self.client.get('/api/analytics/')
        self.assertEqual(analytics_res.status_code, 200)
        self.assertGreaterEqual(analytics_res.json()["metrics"]["total_users"], 1)
