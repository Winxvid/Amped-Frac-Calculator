import { useRef } from 'react';
import {
  COMPANY_PROFILES,
  PROFILE_ORDER,
  type CompanyProfileId,
} from '../../lib/constants';
import { getColorRoleCopy } from '../../lib/themeUtils';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';

export function SettingsPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme, logoSrc, selectProfile, setColor, resetColors, uploadLogo, resetLogo } =
    useTheme();
  const { settingsOpen, closeSettings } = useNavigation();
  const profile = COMPANY_PROFILES[theme.profileId];
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
          <div className="tool-title">Settings</div>
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
            <div className="settings-section-title">Company Profile</div>
            <div className="profile-list">
              {PROFILE_ORDER.map((id) => {
                const p = COMPANY_PROFILES[id];
                const active = theme.profileId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`profile-card${active ? ' active' : ''}`}
                    onClick={() => selectProfile(id as CompanyProfileId)}
                    aria-pressed={active}
                  >
                    <div className={`profile-card-logo${p.logo ? '' : ' empty'}`}>
                      {p.logo ? <img src={p.logo} alt="" /> : 'None'}
                    </div>
                    <div className="profile-card-meta">
                      <div className="profile-card-name">{p.name}</div>
                      <div className="profile-card-sub">{p.short}</div>
                    </div>
                    <div className="profile-swatches" aria-hidden="true">
                      <span
                        className="profile-swatch-dot"
                        style={{ background: p.green }}
                      />
                      <span
                        className="profile-swatch-dot"
                        style={{ background: p.blue }}
                      />
                    </div>
                    <div className="profile-check">{active ? '✓' : ''}</div>
                  </button>
                );
              })}
            </div>
            <p className="settings-hint">
              Switch company branding instantly. Logo and colors update together and are
              saved on this device.
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
                value={theme.green}
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
                value={theme.blue}
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
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%' }}
              onClick={resetColors}
            >
              Reset colors to profile default
            </button>
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
