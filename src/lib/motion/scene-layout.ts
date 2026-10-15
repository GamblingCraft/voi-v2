// Keep this query in sync with the home stylesheet media conditions.
// Narrow mouse-driven landscape windows retain the desktop composition.
export const MOBILE_SCENE_QUERY =
  "(max-width: 1024px) and ((hover: none) or (max-width: 899px) or (orientation: portrait))";

export function isMobileScene() {
  return matchMedia(MOBILE_SCENE_QUERY).matches;
}
