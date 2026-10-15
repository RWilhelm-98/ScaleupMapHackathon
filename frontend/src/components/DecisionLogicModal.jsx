import React, { useState } from 'react';

export default function DecisionLogicModal() {
  const [activeSubTab, setActiveSubTab] = useState('flowchart');

  return (
    <div className="logic-container">
      <div className="logic-header">
        <span className="eyebrow">Architecture &amp; Algorithm</span>
        <h2 className="logic-title">Decision Logic &amp; Jev AI Weight Engine</h2>
        <p className="logic-subtitle">
          How intake responses are converted into 6 cognitive dimensional weights and mapped to ScaleupMap platform tools.
        </p>
      </div>

      <div className="sub-tab-nav">
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'flowchart' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('flowchart')}
        >
          Visual Flowchart
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('matrix')}
        >
          Weights Matrix &amp; Math
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('code')}
        >
          Backend Scoring Engine Code
        </button>
      </div>

      {/* Visual Flowchart */}
      {activeSubTab === 'flowchart' && (
        <div className="flowchart-board">
          <div className="flowchart-step">
            <div className="flow-step-num">Step 1</div>
            <div className="flow-card">
              <h4>Intake Questionnaire</h4>
              <p>Founder stage, multi-select goals, pitch deck status, team size, bottleneck, runway timeline.</p>
              <div className="flow-tags">
                <span>Stage (6)</span>
                <span>Goals (6)</span>
                <span>Deck (4)</span>
              </div>
            </div>
          </div>

          <div className="flow-arrow">➜</div>

          <div className="flowchart-step">
            <div className="flow-step-num">Step 2</div>
            <div className="flow-card highlighted">
              <h4>Jev AI Weight Engine</h4>
              <p>Computes 6-dimensional normalized vector: Strategic, Traction, Capital, Investor Fit, Velocity, Risk.</p>
              <div className="flow-tags">
                <span>Normalized Tensor</span>
                <span>Soft-Clipped [0.1, 1.0]</span>
              </div>
            </div>
          </div>

          <div className="flow-arrow">➜</div>

          <div className="flowchart-step">
            <div className="flow-step-num">Step 3</div>
            <div className="flow-card">
              <h4>Tool Affinity Matching</h4>
              <p>Calculates dot product across 7 ScaleupMap platform tools to generate probability distribution.</p>
              <div className="flow-tags">
                <span>Venture Score</span>
                <span>North Star</span>
                <span>Memo</span>
              </div>
            </div>
          </div>

          <div className="flow-arrow">➜</div>

          <div className="flowchart-step">
            <div className="flow-step-num">Step 4</div>
            <div className="flow-card">
              <h4>Automated Routing</h4>
              <p>Routes to optimal tool, generates tailored email coaching tips and 30-day milestone calendar.</p>
              <div className="flow-tags">
                <span>Deep Link</span>
                <span>Email Tips</span>
                <span>30-Day Calendar</span>
              </div>
            </div>
          </div>

          <div className="flow-arrow">➜</div>

          <div className="flowchart-step">
            <div className="flow-step-num">Step 5</div>
            <div className="flow-card">
              <h4>Telemetry &amp; Feedback</h4>
              <p>Django backend records user tool actions (session started, workflow completed) to measure conversion.</p>
              <div className="flow-tags">
                <span>ToolInteractionTrack</span>
                <span>Conversion Rate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weights Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="matrix-table-card">
          <h3 className="card-title-sm">Multi-Factor Weight Scoring Spreadsheet</h3>
          <p className="card-caption">
            Matrix showing the primary dimensional weight delta and tool affinity assigned to each survey parameter:
          </p>

          <div className="table-responsive">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Intake Variable</th>
                  <th>Option Value</th>
                  <th>Primary Jev Dimension</th>
                  <th>Dimension Weight</th>
                  <th>Primary Target Tool</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Journey Stage</td>
                  <td><code>looking_for_idea</code></td>
                  <td>Strategic Clarity</td>
                  <td>+0.25</td>
                  <td><code>/coach?view=map</code></td>
                </tr>
                <tr>
                  <td>Journey Stage</td>
                  <td><code>building_mvp</code></td>
                  <td>Execution Velocity</td>
                  <td>+0.70</td>
                  <td><code>/coach/north-star-sprint</code></td>
                </tr>
                <tr>
                  <td>Journey Stage</td>
                  <td><code>early_traction</code></td>
                  <td>Traction Readiness</td>
                  <td>+0.75</td>
                  <td><code>/coach/north-star-sprint</code></td>
                </tr>
                <tr>
                  <td>Journey Stage</td>
                  <td><code>raising_first_round</code></td>
                  <td>Capital Readiness</td>
                  <td>+0.85</td>
                  <td><code>/dashboard/memo</code></td>
                </tr>
                <tr>
                  <td>Platform Goal</td>
                  <td><code>validate_direction</code></td>
                  <td>Strategic Clarity</td>
                  <td>+0.40</td>
                  <td><code>/coach?view=map</code></td>
                </tr>
                <tr>
                  <td>Platform Goal</td>
                  <td><code>win_customers</code></td>
                  <td>Traction Readiness</td>
                  <td>+0.40</td>
                  <td><code>/coach/north-star-sprint</code></td>
                </tr>
                <tr>
                  <td>Platform Goal</td>
                  <td><code>raise_funding</code></td>
                  <td>Capital Readiness</td>
                  <td>+0.45</td>
                  <td><code>/dashboard/memo</code></td>
                </tr>
                <tr>
                  <td>Platform Goal</td>
                  <td><code>find_funding</code></td>
                  <td>Investor Fit</td>
                  <td>+0.45</td>
                  <td><code>/entities#static-investors</code></td>
                </tr>
                <tr>
                  <td>Platform Goal</td>
                  <td><code>investor_blind_spots</code></td>
                  <td>Risk Mitigation</td>
                  <td>+0.45</td>
                  <td><code>/dashboard/score</code></td>
                </tr>
                <tr>
                  <td>Pitch Deck Status</td>
                  <td><code>draft_needs_review</code></td>
                  <td>Risk Mitigation</td>
                  <td>+0.30</td>
                  <td><code>/dashboard/score/deck</code></td>
                </tr>
                <tr>
                  <td>Primary Bottleneck</td>
                  <td><code>diligence_readiness</code></td>
                  <td>Risk Mitigation</td>
                  <td>+0.55</td>
                  <td><code>/dashboard/score</code></td>
                </tr>
                <tr>
                  <td>Capital Timeline</td>
                  <td><code>immediate_30d</code></td>
                  <td>Capital Readiness</td>
                  <td>+0.50</td>
                  <td><code>/dashboard/memo</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Code Viewer */}
      {activeSubTab === 'code' && (
        <div className="code-viewer-card">
          <div className="code-header">
            <span>backend/scaleupmap/onboarding/engine.py</span>
            <span className="code-lang">Python 3.13 / Django 6.1</span>
          </div>
          <pre className="code-snippet">
{`def compute_jev_weights(answers: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Initialize dimensional raw accumulators
    dim_scores = {dim: 0.10 for dim in DIMENSIONS}
    tool_scores = {route: 5.0 for route in TOOLS_MAP.keys()}

    # 2. Accumulate weights from Journey Stage, Goals, Deck, Team, Bottleneck, Runway
    apply_option("journey_stage", answers.get("journey_stage"))
    for g in answers.get("platform_goals", []):
        apply_option("platform_goals", g)
    apply_option("pitch_deck_status", answers.get("pitch_deck_status"))
    apply_option("team_size", answers.get("team_size"))
    apply_option("primary_bottleneck", answers.get("primary_bottleneck"))
    apply_option("capital_timeline", answers.get("capital_timeline"))

    # 3. Normalize into [0.12, 0.98] Jev tensor
    max_dim = max(dim_scores.values()) or 1.0
    normalized_weights = {
        d: round(min(0.98, max(0.12, (score / (max_dim * 1.05)))), 3)
        for d, score in dim_scores.items()
    }

    # 4. Compute Softmax Distribution across 7 ScaleupMap tools
    total_tool_score = sum(tool_scores.values()) or 1.0
    normalized_tool_scores = {
        route: round((score / total_tool_score) * 100, 1)
        for route, score in tool_scores.items()
    }

    # 5. Route to Top Tool & Generate Rationale + Email Tips + 30-Day Milestones
    best_route, best_raw_score = sorted(tool_scores.items(), key=lambda x: x[1], reverse=True)[0]
    return {
        "dimensional_weights": normalized_weights,
        "tool_scores": normalized_tool_scores,
        "recommendation": build_recommendation(best_route, ...),
        "email_tips": generate_email_tips(...),
        "engagement_milestones": generate_engagement_milestones(...)
    }`}
          </pre>
        </div>
      )}
    </div>
  );
}
