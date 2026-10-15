import React from 'react';

export default function Header({ activeTab, setActiveTab, backendStatus }) {
  return (
    <header className="scaleup-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="brand-logo-mark">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#3160AE" />
              <path d="M7 21L14 14L19 19L25 10" stroke="#4FBBEA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="25" cy="10" r="2.5" fill="#FFFFFF" />
            </svg>
          </div>
          <div>
            <div className="brand-name">
              ScaleupMap <span className="brand-tag">Jev AI Smart Onboarding</span>
            </div>
            <div className="brand-sub">The venture intelligence platform for the startup ecosystem</div>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-btn ${activeTab === 'questionnaire' ? 'active' : ''}`}
            onClick={() => setActiveTab('questionnaire')}
          >
            Questionnaire &amp; Jev AI
          </button>
          <button
            className={`nav-btn ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            Compare 2 Users
          </button>
          <button
            className={`nav-btn ${activeTab === 'logic' ? 'active' : ''}`}
            onClick={() => setActiveTab('logic')}
          >
            Decision Logic Flowchart
          </button>
          <button
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Live Tracking &amp; Analytics
          </button>
        </nav>

        <div className="header-status">
          <span className={`status-pill ${backendStatus === 'connected' ? 'connected' : 'connecting'}`}>
            <span className="dot"></span>
            {backendStatus === 'connected' ? 'Django API Ready' : 'Connecting to API'}
          </span>
        </div>
      </div>
    </header>
  );
}
