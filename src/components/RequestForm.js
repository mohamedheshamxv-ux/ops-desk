import React, { useMemo, useState } from 'react';
import './RequestForm.css';

const CATEGORY_OPTIONS = ['IT', 'HR', 'Facilities'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

export default function RequestForm({ onSubmitRequest }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('IT');
  const [priority, setPriority] = useState('Low');
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | submitting | success

  const canSubmit = useMemo(() => {
    return submitStatus !== 'submitting';
  }, [submitStatus]);

  function validate(next) {
    const nextErrors = {};

    if (!next.title.trim()) nextErrors.title = 'Title is required.';
    if (!next.description.trim()) nextErrors.description = 'Description is required.';

    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitStatus('idle');

    const payload = {
      title,
      description,
      category,
      priority,
    };

    const nextErrors = validate(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitStatus('submitting');
    try {
      if (typeof onSubmitRequest === 'function') {
        await onSubmitRequest(payload);
      }

      setTitle('');
      setDescription('');
      setCategory('IT');
      setPriority('Low');
      setErrors({});
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('idle');
      throw err;
    }
  }

  const titleHasError = Boolean(errors.title);
  const descriptionHasError = Boolean(errors.description);

  return (
    <section className="od-requestForm" aria-label="Standardized Request Form">
      <header className="od-requestForm__header">
        <h2 className="od-requestForm__title">New Request</h2>
        <p className="od-requestForm__subtitle">
          Provide details so the right team can triage quickly.
        </p>
      </header>

      <form className="od-requestForm__card" onSubmit={handleSubmit} noValidate>
        <div className="od-requestForm__grid">
          <div className="od-requestForm__field od-requestForm__field--full">
            <label className="od-requestForm__label" htmlFor="od-title">
              Title <span className="od-requestForm__required">*</span>
            </label>
            <input
              id="od-title"
              className={`od-requestForm__input ${titleHasError ? 'is-error' : ''}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the request"
              aria-invalid={titleHasError || undefined}
              aria-describedby={titleHasError ? 'od-title-error' : undefined}
            />
            {titleHasError ? (
              <div id="od-title-error" className="od-requestForm__error" role="alert">
                {errors.title}
              </div>
            ) : null}
          </div>

          <div className="od-requestForm__field od-requestForm__field--full">
            <label className="od-requestForm__label" htmlFor="od-description">
              Description <span className="od-requestForm__required">*</span>
            </label>
            <textarea
              id="od-description"
              className={`od-requestForm__textarea ${descriptionHasError ? 'is-error' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context, impact, and any helpful details"
              rows={6}
              aria-invalid={descriptionHasError || undefined}
              aria-describedby={descriptionHasError ? 'od-description-error' : undefined}
            />
            {descriptionHasError ? (
              <div
                id="od-description-error"
                className="od-requestForm__error"
                role="alert"
              >
                {errors.description}
              </div>
            ) : null}
          </div>

          <div className="od-requestForm__field">
            <label className="od-requestForm__label" htmlFor="od-category">
              Category
            </label>
            <select
              id="od-category"
              className="od-requestForm__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="od-requestForm__field">
            <label className="od-requestForm__label" htmlFor="od-priority">
              Priority
            </label>
            <select
              id="od-priority"
              className="od-requestForm__select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="od-requestForm__actions">
          <button
            className="od-requestForm__button"
            type="submit"
            disabled={!canSubmit}
          >
            {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Request'}
          </button>

          {submitStatus === 'success' ? (
            <div className="od-requestForm__success" role="status">
              Request submitted.
            </div>
          ) : null}
        </div>
      </form>
    </section>
  );
}
