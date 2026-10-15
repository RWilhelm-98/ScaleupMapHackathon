import React from 'react';
import { DEMO_PRESETS } from '../data/fallbackData';

export default function PresetBar({ onSelectPreset, currentPresetId }) {
  return (
    <div className="preset-bar-container">
      <div className="preset-bar-header">
        <span className="eyebrow">Challenge 2 Quick Presets</span>
        <span className="preset-hint">Instant 1-click test: "Two different users getting two different results"</span>
      </div>

      <div className="preset-cards-grid">
        {DEMO_PRESETS.map((preset) => {
          const isSelected = currentPresetId === preset.preset_id;
          return (
            <button
              key={preset.preset_id}
              type="button"
              className={`preset-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectPreset(preset)}
            >
              <div className="preset-top">
                <span className="preset-avatar">{preset.name.charAt(0)}</span>
                <div className="preset-title-wrap">
                  <span className="preset-name">{preset.name}</span>
                  <span className="preset-persona">{preset.persona}</span>
                </div>
              </div>
              <p className="preset-desc">{preset.tagline}</p>
              <div className="preset-target">
                <span className="target-label">Routes To:</span>
                <span className="target-route">{preset.expected_outcome.recommended_tool}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
