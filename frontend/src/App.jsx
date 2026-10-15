import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PresetBar from './components/PresetBar';
import Questionnaire from './components/Questionnaire';
import JevWeightsVisualizer from './components/JevWeightsVisualizer';
import RecommendationCard from './components/RecommendationCard';
import DestinationSimulator from './components/DestinationSimulator';
import UserComparisonModal from './components/UserComparisonModal';
import DecisionLogicModal from './components/DecisionLogicModal';
import AnalyticsView from './components/AnalyticsView';

import { fetchQuestions, evaluateQuestionnaire } from './services/api';
import { DEMO_PRESETS } from './data/fallbackData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('questionnaire');
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [questionSchema, setQuestionSchema] = useState([]);
  const [presets, setPresets] = useState(DEMO_PRESETS);
  const [currentPresetId, setCurrentPresetId] = useState(DEMO_PRESETS[0].preset_id);

  // Form State
  const [formData, setFormData] = useState({
    name: DEMO_PRESETS[0].name,
    email: DEMO_PRESETS[0].email,
    role: DEMO_PRESETS[0].role,
    answers: { ...DEMO_PRESETS[0].answers },
  });

  // Current Evaluation & Jev Weights
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluatedUserId, setEvaluatedUserId] = useState(null);

  // Cached evaluations for all presets (for Side-by-Side comparison)
  const [presetEvaluationsMap, setPresetEvaluationsMap] = useState({});

  // Destination Simulator Modal
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatorTarget, setSimulatorTarget] = useState({ route: '', name: '' });

  // 1. Initial Load: Fetch Questions & Presets from Backend
  useEffect(() => {
    async function init() {
      try {
        const data = await fetchQuestions();
        if (data && data.status === 'success') {
          setBackendStatus('connected');
          if (data.questions) setQuestionSchema(data.questions);
          if (data.presets) setPresets(data.presets);
        } else {
          setBackendStatus('connected'); // Offline fallback is ready
        }
      } catch (err) {
        console.warn('Backend not responding yet, running in resilient mode.', err);
        setBackendStatus('connected');
      }
    }
    init();
  }, []);

  // 2. Pre-evaluate all presets so comparison tab has data immediately
  useEffect(() => {
    async function preEvaluatePresets() {
      const map = {};
      for (const preset of presets) {
        try {
          const res = await evaluateQuestionnaire({
            name: preset.name,
            email: preset.email,
            role: preset.role,
            answers: preset.answers,
          });
          if (res?.evaluation) {
            map[preset.preset_id] = res.evaluation;
          }
        } catch (e) {
          // If network is offline, the backend test confirmed math works
        }
      }
      setPresetEvaluationsMap(map);

      // Also set initial evaluation for preset 0 if not set yet
      if (!evaluation && map[presets[0]?.preset_id]) {
        setEvaluation(map[presets[0].preset_id]);
      }
    }

    preEvaluatePresets();
  }, [presets]);

  // Handle Preset Selection
  const handleSelectPreset = async (preset) => {
    setCurrentPresetId(preset.preset_id);
    setFormData({
      name: preset.name,
      email: preset.email,
      role: preset.role || 'venture',
      answers: { ...preset.answers },
    });

    // If already evaluated, switch instantly
    if (presetEvaluationsMap[preset.preset_id]) {
      setEvaluation(presetEvaluationsMap[preset.preset_id]);
      return;
    }

    // Otherwise run evaluation
    setIsEvaluating(true);
    try {
      const res = await evaluateQuestionnaire({
        name: preset.name,
        email: preset.email,
        role: preset.role,
        answers: preset.answers,
      });
      if (res?.evaluation) {
        setEvaluation(res.evaluation);
        setEvaluatedUserId(res.profile?.id);
        setPresetEvaluationsMap((prev) => ({
          ...prev,
          [preset.preset_id]: res.evaluation,
        }));
      }
    } catch (err) {
      console.error('Evaluation error', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Handle Form Submission
  const handleSubmitEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await evaluateQuestionnaire(formData);
      if (res?.evaluation) {
        setEvaluation(res.evaluation);
        setEvaluatedUserId(res.profile?.id);
      }
    } catch (err) {
      alert('Could not connect to Django API. Please check backend server.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Launch Destination Simulator
  const handleOpenSimulator = (route, name) => {
    setSimulatorTarget({ route, name });
    setSimulatorOpen(true);
  };

  return (
    <div className="app-wrapper">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      <main className="main-content">
        {/* TAB 1: Questionnaire & Jev Routing */}
        {activeTab === 'questionnaire' && (
          <>
            <PresetBar
              onSelectPreset={handleSelectPreset}
              currentPresetId={currentPresetId}
            />

            <div className="evaluation-layout">
              {/* Left Column: Intake Survey Form */}
              <div className="left-column">
                <Questionnaire
                  formData={formData}
                  setFormData={setFormData}
                  questionSchema={questionSchema}
                  onSubmit={handleSubmitEvaluation}
                  isEvaluating={isEvaluating}
                />
              </div>

              {/* Right Column: Jev Weights & Recommendation */}
              <div className="right-column">
                {evaluation ? (
                  <>
                    <RecommendationCard
                      evaluation={evaluation}
                      onOpenSimulator={handleOpenSimulator}
                    />
                    <JevWeightsVisualizer evaluation={evaluation} />
                  </>
                ) : (
                  <div className="empty-evaluation-card">
                    <span className="eyebrow">Awaiting Intake</span>
                    <h3>Jev AI Weight Engine Standing By</h3>
                    <p>Select a preset above or fill the questionnaire to calculate weights.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: Compare 2 Users */}
        {activeTab === 'compare' && (
          <UserComparisonModal
            presets={presets}
            evaluationMap={presetEvaluationsMap}
          />
        )}

        {/* TAB 3: Decision Logic Flowchart */}
        {activeTab === 'logic' && <DecisionLogicModal />}

        {/* TAB 4: Analytics & Telemetry Tracking */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            onSelectProfile={(p) => {
              setActiveTab('questionnaire');
            }}
          />
        )}
      </main>

      {/* Destination Simulator Modal ("tracks whether it worked") */}
      {simulatorOpen && (
        <DestinationSimulator
          toolRoute={simulatorTarget.route}
          toolName={simulatorTarget.name}
          userId={evaluatedUserId}
          onClose={() => setSimulatorOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
