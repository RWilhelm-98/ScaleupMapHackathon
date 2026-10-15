import React from 'react';

export default function Questionnaire({
  formData,
  setFormData,
  questionSchema,
  onSubmit,
  isEvaluating,
}) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoalToggle = (goalValue) => {
    setFormData((prev) => {
      const current = prev.answers.platform_goals || [];
      const exists = current.includes(goalValue);
      let updated;
      if (exists) {
        updated = current.filter((g) => g !== goalValue);
      } else {
        if (current.length >= 3) {
          updated = [...current.slice(1), goalValue];
        } else {
          updated = [...current, goalValue];
        }
      }
      return {
        ...prev,
        answers: {
          ...prev.answers,
          platform_goals: updated,
        },
      };
    });
  };

  const handleAnswerSelect = (questionId, optionValue) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionValue,
      },
    }));
  };

  return (
    <div className="questionnaire-card">
      <div className="card-header">
        <span className="eyebrow">Smart Intake Survey</span>
        <h2 className="card-title">Founder Onboarding &amp; Readiness Diagnostic</h2>
        <p className="card-subtitle">
          Answers calibrate the Jev AI decision engine to generate your 6-dimensional weight profile and route you to the highest leverage tool.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Basic Founder Profile */}
        <div className="form-section">
          <div className="section-title">Founder Profile</div>
          <div className="grid-2-col">
            <div className="input-group">
              <label>Founder Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Maya Patel"
                required
              />
            </div>
            <div className="input-group">
              <label>Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="founder@company.com"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Questions */}
        {questionSchema && questionSchema.length > 0 ? (
          questionSchema.map((q, idx) => {
            const isMulti = q.type === 'multi';
            const selectedVal = formData.answers[q.id];

            return (
              <div key={q.id} className="form-section">
                <div className="question-header">
                  <span className="question-number">0{idx + 1}</span>
                  <div>
                    <h3 className="question-title">{q.title}</h3>
                    <p className="question-subtitle">{q.subtitle}</p>
                  </div>
                </div>

                <div className="options-grid">
                  {q.options.map((opt) => {
                    const isSelected = isMulti
                      ? (selectedVal || []).includes(opt.value)
                      : selectedVal === opt.value;

                    return (
                      <div
                        key={opt.value}
                        className={`option-card ${isSelected ? 'active' : ''}`}
                        onClick={() =>
                          isMulti
                            ? handleGoalToggle(opt.value)
                            : handleAnswerSelect(q.id, opt.value)
                        }
                      >
                        <div className="option-top">
                          <span className={`custom-checkbox ${isMulti ? 'multi' : 'radio'} ${isSelected ? 'checked' : ''}`}>
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span className="option-label">{opt.label}</span>
                        </div>
                        <p className="option-desc">{opt.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="loading-state">Loading questionnaire schema from backend...</div>
        )}

        <div className="form-submit-row">
          <button
            type="submit"
            className="btn-primary-pill"
            disabled={isEvaluating}
          >
            {isEvaluating ? (
              <>
                <span className="spinner"></span>
                Computing Jev AI Weights...
              </>
            ) : (
              'Run Jev AI Evaluation & Route'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
