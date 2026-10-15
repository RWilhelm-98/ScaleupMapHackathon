import React, { useState } from 'react';

export default function RecommendationCard({ evaluation, onOpenSimulator }) {
  const [showEmailTips, setShowEmailTips] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);

  if (!evaluation) return null;

  const { recommendation, email_tips, engagement_milestones } = evaluation;

  return (
    <div className="recommendation-hero-card">
      <div className="rec-eyebrow-row">
        <span className="eyebrow">Optimal Tool Destination</span>
        <span className="rec-badge">{recommendation.badge || 'Recommended'}</span>
      </div>

      <div className="rec-header-row">
        <div>
          <h2 className="rec-title">{recommendation.name}</h2>
          <div className="rec-route-tag">
            <span className="tag-prefix">Platform Destination:</span>
            <code>{recommendation.route}</code>
          </div>
        </div>

        <div className="cta-action-box">
          <button
            type="button"
            className="btn-launch-pill"
            onClick={() => onOpenSimulator(recommendation.route, recommendation.name)}
          >
            Launch Tool &amp; Test Tracking
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4.166 10H15.833M15.833 10L10.833 5M15.833 10L10.833 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <p className="rec-desc">{recommendation.description}</p>

      {/* Jev Decision Logic Rationale */}
      <div className="rationale-box">
        <div className="rationale-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4FBBEA" />
          </svg>
          <span>Jev AI Decision Rationale</span>
        </div>
        <p className="rationale-text">{recommendation.rationale}</p>
      </div>

      {/* Secondary Tool Card */}
      {recommendation.secondary_tool && (
        <div className="secondary-tool-card">
          <div className="sec-label">Complementary Secondary Tool:</div>
          <div className="sec-title-row">
            <strong>{recommendation.secondary_tool.name}</strong>
            <code>{recommendation.secondary_tool.route}</code>
          </div>
          <p className="sec-desc">{recommendation.secondary_tool.description}</p>
        </div>
      )}

      {/* Bonus Features: Email Tips & 30-Day Milestones */}
      <div className="bonus-toggles-row">
        <button
          type="button"
          className={`btn-subtle-toggle ${showEmailTips ? 'active' : ''}`}
          onClick={() => setShowEmailTips(!showEmailTips)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {showEmailTips ? 'Hide Email Tips (Bonus 1)' : 'View Personalized Email Tips (Bonus 1)'}
        </button>

        <button
          type="button"
          className={`btn-subtle-toggle ${showMilestones ? 'active' : ''}`}
          onClick={() => setShowMilestones(!showMilestones)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {showMilestones ? 'Hide 30-Day Calendar (Bonus 2)' : 'View 30-Day Retention Calendar (Bonus 2)'}
        </button>
      </div>

      {/* Expanded Email Tips */}
      {showEmailTips && email_tips && (
        <div className="bonus-drawer">
          <h4 className="drawer-title">Automated Email Coaching Sequence (Tailored to Profile)</h4>
          <div className="email-tips-grid">
            {email_tips.map((tip, idx) => (
              <div key={idx} className="email-tip-card">
                <div className="email-subject">{tip.subject}</div>
                <div className="email-summary">{tip.summary}</div>
                <div className="email-body">{tip.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded 30-Day Milestones */}
      {showMilestones && engagement_milestones && (
        <div className="bonus-drawer">
          <h4 className="drawer-title">30-Day Founder Engagement &amp; Retention Milestones</h4>
          <div className="milestones-timeline">
            {engagement_milestones.map((ms, idx) => (
              <div key={idx} className="milestone-item">
                <div className="milestone-day-badge">Day {ms.day}</div>
                <div className="milestone-content">
                  <div className="milestone-title">{ms.title}</div>
                  <div className="milestone-desc">{ms.description}</div>
                  <div className="milestone-route"><code>{ms.route}</code></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
