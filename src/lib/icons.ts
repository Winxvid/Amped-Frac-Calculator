/**
 * Dashboard / sidebar icons — Vite-bundled so paths hash and always load.
 */
import mathIcon from '../assets/icons/math.png';
import sandIcon from '../assets/icons/sand.png';
import chemIcon from '../assets/icons/chem.png';
import hydrationIcon from '../assets/icons/hydration.png';
import blenderIcon from '../assets/icons/blender.png';
import limeIcon from '../assets/icons/lime.png';
import wellboreIcon from '../assets/icons/wellbore.png';
import horsepowerIcon from '../assets/icons/horsepower.png';
import type { TabId } from './constants';

export const NAV_ICON_SRC: Partial<Record<TabId, string>> = {
  math: mathIcon,
  sand: sandIcon,
  chem: chemIcon,
  hydration: hydrationIcon,
  blender: blenderIcon,
  lime: limeIcon,
  wellbore: wellboreIcon,
  hp: horsepowerIcon,
};
