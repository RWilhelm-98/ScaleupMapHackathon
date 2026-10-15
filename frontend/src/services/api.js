// API service connecting to Django backend

const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE}/questions/`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend API not reachable directly, trying relative /api/...", err);
    try {
      const res2 = await fetch('/api/questions/');
      if (!res2.ok) throw new Error(`HTTP error ${res2.status}`);
      return await res2.json();
    } catch (e) {
      console.error("Failed to load questions from backend", e);
      return null;
    }
  }
}

export async function evaluateQuestionnaire(payload) {
  try {
    const res = await fetch(`${API_BASE}/evaluate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    try {
      const res2 = await fetch('/api/evaluate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res2.ok) throw new Error(`HTTP error ${res2.status}`);
      return await res2.json();
    } catch (e) {
      console.error("Evaluation API error", e);
      throw e;
    }
  }
}

export async function trackInteraction(payload) {
  try {
    const res = await fetch(`${API_BASE}/track/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    try {
      const res2 = await fetch('/api/track/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res2.json();
    } catch (e) {
      console.warn("Tracking failed", e);
      return { status: "local_recorded" };
    }
  }
}

export async function fetchProfiles() {
  try {
    const res = await fetch(`${API_BASE}/profiles/`);
    return await res.json();
  } catch (err) {
    try {
      const res2 = await fetch('/api/profiles/');
      return await res2.json();
    } catch (e) {
      return { status: "offline", profiles: [] };
    }
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics/`);
    return await res.json();
  } catch (err) {
    try {
      const res2 = await fetch('/api/analytics/');
      return await res2.json();
    } catch (e) {
      return { status: "offline", metrics: {} };
    }
  }
}
