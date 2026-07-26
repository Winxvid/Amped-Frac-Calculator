import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { SmokyText } from './SmokyText';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Tab id for replay when this section is opened */
  tab: string;
};

/**
 * Page section title + optional subtitle with profile-colored smoke appear.
 */
export function SectionHeader({ title, subtitle, tab }: SectionHeaderProps) {
  const { tab: activeTab } = useNavigation();
  const { theme, resolvedMode } = useTheme();
  const active = activeTab === tab;
  const smokeKey = `${active}-${tab}-${theme.profileId}-${theme.green}-${theme.blue}-${resolvedMode}`;

  return (
    <div className="mb-4 section-header">
      <SmokyText
        text={title}
        color="var(--title-color)"
        className="sec-title"
        intensity={11}
        duration={1.75}
        delay={0.05}
        position="bottomLeft"
        animationMode="singleLine"
        motionScale={0.22}
        replayKey={smokeKey}
        style={{
          fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(20px, 5vw, 26px)',
          letterSpacing: '0.03em',
          lineHeight: 1.15,
          display: 'block',
          width: '100%',
        }}
      />
      {subtitle ? (
        <SmokyText
          text={subtitle}
          color="var(--brand)"
          className="sec-sub"
          intensity={8}
          duration={1.4}
          delay={0.22}
          position="bottomLeft"
          animationMode="singleLine"
          motionScale={0.18}
          replayKey={smokeKey}
          style={{
            fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(12px, 3.2vw, 14px)',
            letterSpacing: '0.04em',
            lineHeight: 1.35,
            display: 'block',
            width: '100%',
            marginTop: 8,
          }}
        />
      ) : null}
    </div>
  );
}
