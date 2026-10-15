import React, { useState } from 'react';
import { trackInteraction } from '../services/api';

export default function DestinationSimulator({ toolRoute, toolName, userId, onClose, onActionLogged }) {
  const [trackHistory, setTrackHistory] = useState([
    {
      action: 'routed',
      status: 'success',
      timestamp: new Date().toLocaleTimeString(),
      note: 'User arrived at recommended tool destination',
    },
  ]);
  const [isLogging, setIsLogging] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleSimulateAction = async (actionName, note) => {
    setIsLogging(true);
    const payload = {
      user_id: userId,
      tool_route: toolRoute,
      action: actionName,
      status: 'success',
      metadata: {
        note,
        step: activeStep,
        timestamp: new Date().toISOString(),
      },
    };

    const res = await trackInteraction(payload);
    setIsLogging(false);

    const newRecord = {
      action: actionName,
      status: res.status || 'success',
      timestamp: new Date().toLocaleTimeString(),
      note,
      id: res.track_id || Math.floor(Math.random() * 1000),
    };

    setTrackHistory((prev) => [newRecord, ...prev]);
    setActiveStep((prev) => prev + 1);

    if (onActionLogged) {
      onActionLogged(newRecord);
    }
  };

  return (
    <div className="simulator-overlay">
      <div className="simulator-modal">
        {/* Browser / Workbench Chrome */}
        <div className="simulator-browser-bar">
          <div className="browser-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="browser-address-bar">
            <span className="protocol">https://scaleupmap.com</span>
            <span className="path">{toolRoute}</span>
          </div>

          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="simulator-body">
          {/* Top Bar inside ScaleupMap */}
          <div className="sim-scaleup-nav">
            <div className="sim-nav-left">
              <span className="sim-brand">ScaleupMap</span>
              <span className="sim-crumb">/ {toolName}</span>
            </div>
            <div className="sim-tracking-badge">
              <span className="pulse-indicator"></span>
              Live Telemetry: Tracking Engagement
            </div>
          </div>

          {/* Interactive Workbench Content */}
          <div className="sim-workbench-content">
            <div className="sim-hero">
              <span className="eyebrow">Interactive Destination Workbench</span>
              <h2 className="sim-title">{toolName}</h2>
              <p className="sim-subtitle">
                The founder was automatically routed here based on their Jev AI weights. Test the interaction flow below to verify telemetry tracking.
              </p>
            </div>

            {/* Simulated Tool Mockup Actions */}
            <div className="sim-actions-grid">
              <div className="sim-action-card">
                <div className="sim-step-num">Step 01</div>
                <h4>Start First Session</h4>
                <p>Initialize diagnostic inputs or baseline metrics.</p>
                <button
                  type="button"
                  className="btn-sim-action"
                  disabled={isLogging}
                  onClick={() =>
                    handleSimulateAction(
                      'session_started',
                      'Founder initiated first assessment / sprint session'
                    )
                  }
                >
                  Log: Session Started
                </button>
              </div>

              <div className="sim-action-card">
                <div className="sim-step-num">Step 02</div>
                <h4>Complete Core Workflow</h4>
                <p>Generate memo, calculate score, or commit sprint goal.</p>
                <button
                  type="button"
                  className="btn-sim-action"
                  disabled={isLogging}
                  onClick={() =>
                    handleSimulateAction(
                      'workflow_completed',
                      'Founder completed first institutional milestone in tool'
                    )
                  }
                >
                  Log: Workflow Completed
                </button>
              </div>

              <div className="sim-action-card">
                <div className="sim-step-num">Step 03</div>
                <h4>Export or Apply</h4>
                <p>Export tearsheet PDF or submit investor application.</p>
                <button
                  type="button"
                  className="btn-sim-action"
                  disabled={isLogging}
                  onClick={() =>
                    handleSimulateAction(
                      'export_or_shared',
                      'Founder exported deliverables for investor sharing'
                    )
                  }
                >
                  Log: Exported / Shared
                </button>
              </div>
            </div>

            {/* Real-time Tracking Feed */}
            <div className="sim-telemetry-panel">
              <div className="telemetry-header">
                <h4>Django Backend Telemetry Feed (tracks whether it worked)</h4>
                <span className="events-count">{trackHistory.length} events logged to database</span>
              </div>

              <div className="telemetry-events-list">
                {trackHistory.map((ev, idx) => (
                  <div key={idx} className="telemetry-event-row">
                    <span className="event-time">{ev.timestamp}</span>
                    <span className="event-action">
                      <code>{ev.action}</code>
                    </span>
                    <span className="event-route">{toolRoute}</span>
                    <span className="event-status">{ev.status}</span>
                    <span className="event-note">{ev.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
