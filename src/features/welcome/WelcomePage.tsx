import { useEffect, useMemo, useRef, useState } from 'react';
import { COMPANY_PROFILES } from '../../lib/constants';
import { matchCompanyToProfile, matchLabel } from '../../lib/companyMatch';
import {
  fileToLogoDataUrl,
  normalizeHex,
  profileDefaultColors,
  resolveProfileLogoSrc,
} from '../../lib/themeUtils';
import { useTheme } from '../../context/ThemeContext';
import './welcome.css';

type Step = 1 | 2 | 3;

function colorInputValue(hex: string) {
  return (hex || '#000000').toLowerCase();
}

export function WelcomePage() {
  const { completeOnboarding, resolvedMode } = useTheme();
  const [step, setStep] = useState<Step>(1);
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [touched, setTouched] = useState({ name: false, company: false });
  const [customizeOverride, setCustomizeOverride] = useState(false);

  const defColors = profileDefaultColors('default');
  const [green, setGreen] = useState(defColors.green);
  const [blue, setBlue] = useState(defColors.blue);
  const [useDefaultColors, setUseDefaultColors] = useState(true);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoBusy, setLogoBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);

  const matchedId = useMemo(
    () => matchCompanyToProfile(companyName),
    [companyName],
  );

  const nameOk = displayName.trim().length > 0 && displayName.trim().length <= 40;
  const companyOk =
    companyName.trim().length > 0 && companyName.trim().length <= 80;
  const step2Ok = nameOk && companyOk;

  useEffect(() => {
    if (step === 2) nameRef.current?.focus();
  }, [step]);

  useEffect(() => {
    // Reset customize override when match changes
    setCustomizeOverride(false);
  }, [matchedId]);

  const onUploadLogo = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, etc.).');
      return;
    }
    setLogoBusy(true);
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      setLogoDataUrl(dataUrl);
    } catch {
      alert('Could not load that image. Try another file.');
    } finally {
      setLogoBusy(false);
    }
  };

  const finish = () => {
    if (!step2Ok) return;

    if (matchedId && !customizeOverride) {
      completeOnboarding({
        displayName: displayName.trim(),
        companyName: companyName.trim(),
        matchedProfileId: matchedId,
      });
      return;
    }

    completeOnboarding({
      displayName: displayName.trim(),
      companyName: companyName.trim(),
      matchedProfileId: null,
      green: useDefaultColors ? undefined : green,
      blue: useDefaultColors ? undefined : blue,
      logoDataUrl,
      useDefaultColors,
    });
  };

  const goNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      setTouched({ name: true, company: true });
      if (step2Ok) setStep(3);
    } else finish();
  };

  const previewGreen = useDefaultColors
    ? defColors.green
    : normalizeHex(green) || defColors.green;
  const previewBlue = useDefaultColors
    ? defColors.blue
    : normalizeHex(blue) || defColors.blue;
  const matchedProfile = matchedId ? COMPANY_PROFILES[matchedId] : null;
  const matchedProfileLogo = matchedId
    ? resolveProfileLogoSrc(matchedId, resolvedMode)
    : null;

  return (
    <div className="welcome-root" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-card">
        <div className="welcome-brand">
          <img
            src="/apple-touch-icon.png"
            alt=""
            className="welcome-app-icon"
            width={48}
            height={48}
          />
          <div>
            <div className="welcome-app-name">Amped Calc</div>
            <div className="welcome-app-tag">Field Calculator</div>
          </div>
        </div>

        <div className="welcome-progress" aria-label={`Step ${step} of 3`}>
          {([1, 2, 3] as Step[]).map((s) => (
            <span
              key={s}
              className={`welcome-dot${s === step ? ' active' : ''}${s < step ? ' done' : ''}`}
              aria-current={s === step ? 'step' : undefined}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="welcome-step">
            <h1 id="welcome-title" className="welcome-title">
              Welcome
            </h1>
            <p className="welcome-lead">
              A quick setup so Amped Calc feels like yours — name, company, and
              optional branding. Takes under a minute.
            </p>
            <ul className="welcome-bullets">
              <li>Preferred name for a personal touch</li>
              <li>Company match applies known logos &amp; colors</li>
              <li>Logo and colors are optional — skip anytime</li>
            </ul>
          </div>
        )}

        {step === 2 && (
          <div className="welcome-step">
            <h1 id="welcome-title" className="welcome-title">
              About you
            </h1>
            <p className="welcome-lead">How should we address you on this device?</p>

            <label className="welcome-label" htmlFor="welcome-name">
              Preferred name
            </label>
            <input
              ref={nameRef}
              id="welcome-name"
              className={`field welcome-field${touched.name && !nameOk ? ' welcome-field-error' : ''}`}
              type="text"
              autoComplete="nickname"
              maxLength={40}
              placeholder="e.g. John Smith"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  companyRef.current?.focus();
                }
              }}
            />
            {touched.name && !nameOk ? (
              <div className="welcome-error">Enter a preferred name.</div>
            ) : null}

            <label className="welcome-label" htmlFor="welcome-company">
              Company
            </label>
            <input
              ref={companyRef}
              id="welcome-company"
              className={`field welcome-field${touched.company && !companyOk ? ' welcome-field-error' : ''}`}
              type="text"
              autoComplete="organization"
              maxLength={80}
              placeholder="e.g. Amped Energy Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, company: true }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  goNext();
                }
              }}
            />
            {touched.company && !companyOk ? (
              <div className="welcome-error">Enter your company name.</div>
            ) : null}

            {companyName.trim() ? (
              matchedId ? (
                <div className="welcome-match ok" role="status">
                  Matched: <strong>{matchLabel(matchedId)}</strong> — logo &amp;
                  colors will be applied.
                </div>
              ) : (
                <div className="welcome-match" role="status">
                  No preset match — you can personalize branding next, or skip
                  and use the default look.
                </div>
              )
            ) : null}
          </div>
        )}

        {step === 3 && (
          <div className="welcome-step">
            <h1 id="welcome-title" className="welcome-title">
              Branding
            </h1>

            {matchedId && !customizeOverride ? (
              <>
                <p className="welcome-lead">
                  We’ll use this company look. You can change it later in
                  Settings.
                </p>
                <div className="welcome-profile-preview">
                  <div className="welcome-profile-logo">
                    {matchedProfileLogo ? (
                      <img src={matchedProfileLogo} alt="" />
                    ) : (
                      <span>No logo</span>
                    )}
                  </div>
                  <div className="welcome-profile-meta">
                    <div className="welcome-profile-name">
                      {matchLabel(matchedId)}
                    </div>
                    <div className="welcome-profile-sub">
                      {matchedProfile?.short}
                    </div>
                    <div className="welcome-swatches">
                      <span
                        style={{ background: matchedProfile?.green }}
                        title="Color A"
                      />
                      <span
                        style={{ background: matchedProfile?.blue }}
                        title="Color B"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost welcome-secondary-btn"
                  onClick={() => setCustomizeOverride(true)}
                >
                  Use different branding instead
                </button>
              </>
            ) : (
              <>
                <p className="welcome-lead">
                  Everything here is optional. Skip what you don’t need — you
                  can finish with the neutral Default look.
                </p>

                <div className="welcome-optional-card">
                  <div className="welcome-optional-head">
                    <span className="welcome-optional-title">Logo</span>
                    <span className="welcome-optional-badge">Optional</span>
                  </div>
                  <p className="welcome-hint">
                    No file ready? Skip — you can add a logo later in Settings.
                  </p>
                  <div className="welcome-logo-row">
                    <div
                      className={`welcome-logo-preview${logoDataUrl ? '' : ' empty'}`}
                    >
                      {logoDataUrl ? (
                        <img src={logoDataUrl} alt="Logo preview" />
                      ) : (
                        <span>No logo</span>
                      )}
                    </div>
                    <div className="welcome-logo-actions">
                      <label className="btn btn-brand welcome-file-btn">
                        {logoBusy ? 'Loading…' : 'Upload logo'}
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          disabled={logoBusy}
                          onChange={(e) => {
                            void onUploadLogo(e.target.files?.[0]);
                          }}
                        />
                      </label>
                      {logoDataUrl ? (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            setLogoDataUrl(null);
                            if (fileRef.current) fileRef.current.value = '';
                          }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            /* explicit skip — no-op, just clarity */
                            setLogoDataUrl(null);
                          }}
                        >
                          Skip logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="welcome-optional-card">
                  <div className="welcome-optional-head">
                    <span className="welcome-optional-title">Colors</span>
                    <span className="welcome-optional-badge">Optional</span>
                  </div>
                  <p className="welcome-hint">
                    Skip to keep the neutral Default greys &amp; black.
                  </p>
                  <button
                    type="button"
                    className={`btn welcome-toggle-colors${useDefaultColors ? ' btn-ghost' : ' btn-brand'}`}
                    onClick={() => {
                      if (!useDefaultColors) {
                        setUseDefaultColors(true);
                        setGreen(defColors.green);
                        setBlue(defColors.blue);
                      } else {
                        setUseDefaultColors(false);
                      }
                    }}
                  >
                    {useDefaultColors
                      ? 'Customize colors'
                      : 'Use default colors'}
                  </button>
                  {!useDefaultColors ? (
                    <div className="welcome-colors">
                      <div className="welcome-color-row">
                        <input
                          type="color"
                          className="settings-swatch"
                          value={colorInputValue(green)}
                          onChange={(e) => {
                            setGreen(e.target.value.toUpperCase());
                            setUseDefaultColors(false);
                          }}
                          aria-label="Color A"
                        />
                        <div className="flex-1">
                          <label className="welcome-label" htmlFor="w-green">
                            Color A — titles &amp; labels
                          </label>
                          <input
                            id="w-green"
                            className="field"
                            value={green}
                            maxLength={7}
                            onChange={(e) => {
                              setGreen(e.target.value);
                              setUseDefaultColors(false);
                            }}
                          />
                        </div>
                      </div>
                      <div className="welcome-color-row">
                        <input
                          type="color"
                          className="settings-swatch"
                          value={colorInputValue(blue)}
                          onChange={(e) => {
                            setBlue(e.target.value.toUpperCase());
                            setUseDefaultColors(false);
                          }}
                          aria-label="Color B"
                        />
                        <div className="flex-1">
                          <label className="welcome-label" htmlFor="w-blue">
                            Color B — numbers &amp; accents
                          </label>
                          <input
                            id="w-blue"
                            className="field"
                            value={blue}
                            maxLength={7}
                            onChange={(e) => {
                              setBlue(e.target.value);
                              setUseDefaultColors(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="welcome-live-preview" aria-hidden="true">
                  <div className="welcome-live-logo">
                    {logoDataUrl ? (
                      <img src={logoDataUrl} alt="" />
                    ) : (
                      <span>Logo</span>
                    )}
                  </div>
                  <div>
                    <div
                      className="welcome-live-hello"
                      style={{ color: previewGreen }}
                    >
                      Hello, {displayName.trim() || 'there'}
                    </div>
                    <div className="welcome-live-co">{companyName.trim()}</div>
                    <div className="welcome-swatches">
                      <span style={{ background: previewGreen }} />
                      <span style={{ background: previewBlue }} />
                    </div>
                  </div>
                </div>

                {matchedId && customizeOverride ? (
                  <button
                    type="button"
                    className="btn btn-ghost welcome-secondary-btn"
                    onClick={() => setCustomizeOverride(false)}
                  >
                    Back to {matchLabel(matchedId)} preset
                  </button>
                ) : null}
              </>
            )}

            <p className="welcome-foot">
              You can change branding anytime in Settings ⚙
            </p>
          </div>
        )}

        <div className="welcome-actions">
          {step > 1 ? (
            <button
              type="button"
              className="btn btn-ghost welcome-btn"
              onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="btn btn-brand welcome-btn"
            disabled={step === 2 && !step2Ok}
            onClick={goNext}
          >
            {step === 3 ? 'Get started' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
