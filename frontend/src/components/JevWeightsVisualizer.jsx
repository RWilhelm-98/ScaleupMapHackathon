import React from 'react';
import { DIMENSIONS_INFO, TOOLS_MAP } from '../data/fallbackData';

export default function JevWeightsVisualizer({ evaluation }) {
  if (!evaluation) return null;

  const { dimensional_weights, tool_scores, recommendation } = evaluation;

  return (
    <div className="jev-visualizer-container">
      {/* 6-Dimensional Jev Weights Tensor */}
      <div className="weights-card">
        <div className="card-top-row">
          <div>
            <span className="eyebrow">Calculated Weights</span>
            <h3 className="card-title-sm">Jev AI 6-Dimensional Cognitive Vector</h3>
          </div>
          <div className="confidence-pill">
            <span className="confidence-label">Confidence:</span>
            <span className="confidence-val">{Math.round((recommendation?.confidence || 0.85) * 100)}%</span>
          </div>
        </div>

        <p className="card-caption">
          Normalized weight tensor output by Jev AI's System-1 multi-factor model for this founder profile:
        </p>

        <div className="dimensions-bars-list">
          {Object.entries(dimensional_weights || {}).map(([dimKey, weightVal]) => {
            const meta = DIMENSIONS_INFO[dimKey] || {
              label: dimKey.replace('_', ' '),
              description: '',
              color: '#3160AE',
            };
            const pct = Math.round(weightVal * 100);

            return (
              <div key={dimKey} className="dimension-bar-row">
                <div className="dim-info-row">
                  <div className="dim-name-wrap">
                    <span className="dim-color-bullet" style={{ backgroundColor: meta.color }}></span>
                    <span className="dim-name">{meta.label}</span>
                  </div>
                  <span className="dim-val">{pct}% (w={weightVal.toFixed(3)})</span>
                </div>
                <div className="dim-track">
                  <div
                    className="dim-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: meta.color,
                    }}
                  ></div>
                </div>
                <div className="dim-sub">{meta.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool Affinity Distribution */}
      <div className="tools-distribution-card">
        <div className="card-top-row">
          <div>
            <span className="eyebrow">Routing Distribution</span>
            <h3 className="card-title-sm">Candidate Tool Affinity Scores</h3>
          </div>
        </div>

        <p className="card-caption">
          Softmax distribution across ScaleupMap's 7 platform tools from the platform reference:
        </p>

        <div className="tool-affinity-list">
          {Object.entries(tool_scores || {})
            .sort((a, b) => b[1] - a[1])
            .map(([route, score]) => {
              const tool = TOOLS_MAP[route] || { name: route, category: 'Tool' };
              const isWinner = recommendation?.route === route;

              return (
                <div key={route} className={`tool-affinity-row ${isWinner ? 'winner-row' : ''}`}>
                  <div className="tool-row-top">
                    <div className="tool-info-col">
                      <span className="tool-cat">{tool.category}</span>
                      <span className="tool-title-link">
                        {tool.name}
                        {isWinner && <span className="winner-badge">Selected Destination</span>}
                      </span>
                    </div>
                    <span className="tool-score-val">{score}%</span>
                  </div>
                  <div className="tool-track">
                    <div
                      className={`tool-fill ${isWinner ? 'winner-fill' : ''}`}
                      style={{ width: `${Math.min(100, score * 2.2)}%` }}
                    ></div>
                  </div>
                  <div className="tool-route-code">{route}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
