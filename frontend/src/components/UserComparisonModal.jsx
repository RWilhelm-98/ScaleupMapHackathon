import React, { useState } from 'react';
import { DEMO_PRESETS, DIMENSIONS_INFO } from '../data/fallbackData';

export default function UserComparisonModal({ presets = DEMO_PRESETS, evaluationMap = {} }) {
  const [userAIndex, setUserAIndex] = useState(0);
  const [userBIndex, setUserBIndex] = useState(1);

  const userA = presets[userAIndex] || presets[0];
  const userB = presets[userBIndex] || presets[1];

  const evalA = evaluationMap[userA.preset_id] || null;
  const evalB = evaluationMap[userB.preset_id] || null;

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <span className="eyebrow">Challenge 2 Proof</span>
        <h2 className="comparison-title">Two Different Users Getting Two Different Results</h2>
        <p className="comparison-subtitle">
          Compare two founder profiles side-by-side to observe how Jev AI calculates distinct dimensional weight vectors and routes them to completely different tools.
        </p>
      </div>

      {/* Selectors */}
      <div className="comparison-selectors">
        <div className="selector-box">
          <label>Founder Profile A:</label>
          <select value={userAIndex} onChange={(e) => setUserAIndex(Number(e.target.value))}>
            {presets.map((p, idx) => (
              <option key={p.preset_id} value={idx}>
                {p.name} ({p.persona})
              </option>
            ))}
          </select>
        </div>

        <div className="vs-badge">VS</div>

        <div className="selector-box">
          <label>Founder Profile B:</label>
          <select value={userBIndex} onChange={(e) => setUserBIndex(Number(e.target.value))}>
            {presets.map((p, idx) => (
              <option key={p.preset_id} value={idx}>
                {p.name} ({p.persona})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="comparison-grid">
        {/* User A Column */}
        <div className="user-col">
          <div className="user-col-header">
            <span className="col-tag">User A</span>
            <h3>{userA.name}</h3>
            <div className="user-persona-tag">{userA.persona}</div>
            <p className="user-tagline">{userA.tagline}</p>
          </div>

          {/* Questionnaire Answers */}
          <div className="col-section">
            <h4 className="section-heading">Input Answers</h4>
            <div className="answers-summary">
              <div className="ans-row">
                <span className="ans-k">Stage:</span>
                <span className="ans-v">{userA.answers.journey_stage.replace(/_/g, ' ')}</span>
              </div>
              <div className="ans-row">
                <span className="ans-k">Goals:</span>
                <span className="ans-v">{(userA.answers.platform_goals || []).join(', ').replace(/_/g, ' ')}</span>
              </div>
              <div className="ans-row">
                <span className="ans-k">Deck Status:</span>
                <span className="ans-v">{userA.answers.pitch_deck_status.replace(/_/g, ' ')}</span>
              </div>
              <div className="ans-row">
                <span className="ans-k">Bottleneck:</span>
                <span className="ans-v">{userA.answers.primary_bottleneck.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Jev Weights */}
          <div className="col-section">
            <h4 className="section-heading">Jev AI Dimensional Weights</h4>
            {evalA ? (
              <div className="weights-mini-list">
                {Object.entries(evalA.dimensional_weights || {}).map(([dim, val]) => (
                  <div key={dim} className="mini-weight-row">
                    <span className="dim-lbl">{DIMENSIONS_INFO[dim]?.label || dim}</span>
                    <div className="mini-track">
                      <div
                        className="mini-fill"
                        style={{
                          width: `${Math.round(val * 100)}%`,
                          backgroundColor: DIMENSIONS_INFO[dim]?.color || '#3160AE',
                        }}
                      ></div>
                    </div>
                    <span className="mini-val">{Math.round(val * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading-sub">Loading evaluation...</div>
            )}
          </div>

          {/* Resulting Route */}
          <div className="col-result-card user-a-result">
            <span className="res-badge">Routed Platform Tool</span>
            <h4 className="res-tool-name">{evalA?.recommendation?.name || userA.expected_outcome.recommended_tool}</h4>
            <code className="res-route">{evalA?.recommendation?.route || userA.expected_outcome.route}</code>
            <p className="res-rationale">{evalA?.recommendation?.rationale}</p>
          </div>
        </div>

        {/* User B Column */}
        <div className="user-col">
          <div className="user-col-header">
            <span className="col-tag">User B</span>
            <h3>{userB.name}</h3>
            <div className="user-persona-tag">{userB.persona}</div>
            <p className="user-tagline">{userB.tagline}</p>
          </div>

          {/* Questionnaire Answers */}
          <div className="col-section">
            <h4 className="section-heading">Input Answers</h4>
            <div className="answers-summary">
              <div className="ans-row">
                <span className="ans-k">Stage:</span>
                <span className="ans-v">{userB.answers.journey_stage.replace(/_/g, ' ')}</span>
              </div>
              <div className="ans-row">
                <span className="ans-k">Goals:</span>
                <span className="ans-v">{(userB.answers.platform_goals || []).join(', ').replace(/_/g, ' ')}</span>
              </div>
              <div className="ans-row">
                <span className="ans-k">Deck Status:</span>
                <span className="ans-v">{userB.answers.pitch_deck_status.replace(/_/g, ' ')}</span>
              </div>
              <div className="ans-row">
                <span className="ans-k">Bottleneck:</span>
                <span className="ans-v">{userB.answers.primary_bottleneck.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Jev Weights */}
          <div className="col-section">
            <h4 className="section-heading">Jev AI Dimensional Weights</h4>
            {evalB ? (
              <div className="weights-mini-list">
                {Object.entries(evalB.dimensional_weights || {}).map(([dim, val]) => (
                  <div key={dim} className="mini-weight-row">
                    <span className="dim-lbl">{DIMENSIONS_INFO[dim]?.label || dim}</span>
                    <div className="mini-track">
                      <div
                        className="mini-fill"
                        style={{
                          width: `${Math.round(val * 100)}%`,
                          backgroundColor: DIMENSIONS_INFO[dim]?.color || '#3160AE',
                        }}
                      ></div>
                    </div>
                    <span className="mini-val">{Math.round(val * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading-sub">Loading evaluation...</div>
            )}
          </div>

          {/* Resulting Route */}
          <div className="col-result-card user-b-result">
            <span className="res-badge">Routed Platform Tool</span>
            <h4 className="res-tool-name">{evalB?.recommendation?.name || userB.expected_outcome.recommended_tool}</h4>
            <code className="res-route">{evalB?.recommendation?.route || userB.expected_outcome.route}</code>
            <p className="res-rationale">{evalB?.recommendation?.rationale}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
