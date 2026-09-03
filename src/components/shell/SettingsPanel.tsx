import { useRef } from 'react';
import {
  COMPANY_PROFILES,
  PROFILE_ORDER,
  type CompanyProfileId,
} from '../../lib/constants';
import {
  getColorRoleCopy,
  resolveProfileLogoSrc,
  type ColorMode,
} from '../../lib/themeUtils';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';
import { SmokyText } from '../ui/SmokyText';

function colorInputValue(hex: string) {
  // <input type="color"> is happiest with lowercase #rrggbb
  return (hex || '#000000').toLowerCase();
}

export function SettingsPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    theme,
    logoSrc,
    resolvedMode,
    selectProfile,
    setColor,
    resetColors,
    setColorMode,
    uploadLogo,
    resetLogo,
  } = useTheme();
  const { settingsOpen, closeSettings } = useNavigation();
  const profile = COMPANY_PROFILES[theme.profileId];
  const profileLogoSrc = resolveProfileLogoSrc(theme.profileId, resolvedMode);
  const copy = getColorRoleCopy(theme.profileId, profile.name);

  return (
    <>
      <div
        id="settings-overlay"
        className={settingsOpen ? 'open' : ''}
        onClick={closeSettings}
        aria-hidden={!settingsOpen}
      />
      <aside
        id="settings-panel"
        className={settingsOpen ? 'open' : ''}
        aria-label="Settings"
        aria-hidden={!settingsOpen}
      >
        <div className="settings-hdr">
          {settingsOpen ? (
            <SmokyText
              text="Settings"
              color="var(--title-color)"
              className="tool-title"
              intensity={8}
              duration={1.1}
              delay={0.05}
              animationMode="inPlace"
              motionScale={0.12}
              replayKey={`settings-${settingsOpen}-${theme.profileId}`}
              as="span"
              style={{
                margin: 0,
                fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: 16,
              }}
            />
          ) : (
            <div className="tool-title">Settings</div>
          )}
          <button
            type="button"
            className="sidebar-close"
            onClick={closeSettings}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        <div className="settings-body">
          <div className="settings-block">
            <div className="settings-section-title">Appearance</div>
            <div
              className="appearance-seg"
              role="group"
              aria-label="Color mode"
            >
              {(
                [
                  { id: 'light', label: 'Light', icon: '☀' },
                  { id: 'dark', label: 'Dark', icon: '☾' },
                  { id: 'system', label: 'System', icon: '◐' },
                ] as const
              ).map((opt) => {
                const active = theme.colorMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`appearance-seg-btn${active ? ' active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setColorMode(opt.id as ColorMode)}
                  >
                    <span className="appearance-seg-icon" aria-hidden="true">
                      {opt.icon}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="settings-hint">
              Light &amp; dark only change page chrome (backgrounds, cards, text).
              Company brand colors stay separate
              {theme.colorMode === 'system'
                ? ` · currently following system (${resolvedMode}).`
                : '.'}
            </p>
          </div>

          <div className="settings-block">
            <div className="settings-section-title">Company Profile</div>
            <label className="lbl" htmlFor="settings-profile-select">
              Profile
            </label>
            <select
              id="settings-profile-select"
              className="field settings-profile-select"
              value={theme.profileId}
              onChange={(e) => selectProfile(e.target.value as CompanyProfileId)}
            >
              {PROFILE_ORDER.map((id) => {
                const p = COMPANY_PROFILES[id];
                return (
                  <option key={id} value={id}>
                    {p.name}
                  </option>
                );
              })}
            </select>
            <div className="profile-select-summary" aria-live="polite">
              <div className={`profile-card-logo${profileLogoSrc ? '' : ' empty'}`}>
                {profileLogoSrc ? <img src={profileLogoSrc} alt="" /> : 'None'}
              </div>
              <div className="profile-card-meta">
                <div className="profile-card-sub">{profile.short}</div>
              </div>
              <div className="profile-swatches" aria-hidden="true">
                <span
                  className="profile-swatch-dot"
                  style={{ background: theme.green }}
                />
                <span
                  className="profile-swatch-dot"
                  style={{ background: theme.blue }}
                />
              </div>
            </div>
            <p className="settings-hint">
              Logo and brand colors update together and are saved on this device.
            </p>
          </div>

          <div className="settings-block">
            <div className="settings-section-title">Header Logo</div>
            <div className={`settings-logo-preview${logoSrc ? '' : ' empty'}`}>
              {logoSrc ? (
                <img className="app-logo" src={logoSrc} alt="Logo preview" />
              ) : (
                <span className="logo-empty-label">No logo</span>
              )}
            </div>
            <label className="btn btn-brand settings-file-btn">
              Upload custom logo
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadLogo(f);
                }}
              />
            </label>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => {
                resetLogo();
                if (fileRef.current) fileRef.current.value = '';
              }}
            >
              Use profile logo
            </button>
            <p className="settings-hint">
              Optional override for the selected company. PNG, JPG, or SVG.
            </p>
          </div>

          <div className="settings-block">
            <div className="settings-section-title">Brand Colors</div>
            <p
              className="settings-hint"
              style={{ marginTop: 0, marginBottom: 12 }}
            >
              {copy.note}
            </p>
            <div className="settings-color-row">
              <input
                type="color"
                className="settings-swatch"
                value={colorInputValue(theme.green)}
                title={copy.greenLabel}
                onChange={(e) => setColor('green', e.target.value)}
              />
              <div className="flex-1" style={{ minWidth: 0 }}>
                <label className="lbl" htmlFor="settings-green-hex">
                  {copy.greenLabel}
                </label>
                <input
                  id="settings-green-hex"
                  type="text"
                  className="field"
                  value={theme.green}
                  maxLength={7}
                  spellCheck={false}
                  onChange={(e) => setColor('green', e.target.value)}
                  placeholder="#2DC76D"
                />
                <div className="settings-hint" style={{ marginTop: 6 }}>
                  {copy.greenHelp}
                </div>
              </div>
            </div>
            <div className="settings-color-row">
              <input
                type="color"
                className="settings-swatch"
                value={colorInputValue(theme.blue)}
                title={copy.blueLabel}
                onChange={(e) => setColor('blue', e.target.value)}
              />
              <div className="flex-1" style={{ minWidth: 0 }}>
                <label className="lbl" htmlFor="settings-blue-hex">
                  {copy.blueLabel}
                </label>
                <input
                  id="settings-blue-hex"
                  type="text"
                  className="field"
                  value={theme.blue}
                  maxLength={7}
                  spellCheck={false}
                  onChange={(e) => setColor('blue', e.target.value)}
                  placeholder="#2D7AC7"
                />
                <div className="settings-hint" style={{ marginTop: 6 }}>
                  {copy.blueHelp}
                </div>
              </div>
            </div>
            <p className="settings-hint">{copy.footer}</p>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 12 }}
              onClick={() => resetColors()}
            >
              Reset colors to profile default
            </button>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="btn btn-brand"
              style={{ width: '100%' }}
              onClick={closeSettings}
            >
              Done
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
