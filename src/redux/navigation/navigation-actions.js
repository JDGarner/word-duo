const NAMESPACE = "NAV";

export const CHANGE_SCREEN = `${NAMESPACE}/CHANGE_SCREEN`;
export const ON_NAVIGATE_BACK = `${NAMESPACE}/ON_NAVIGATE_BACK`;

export const changeScreen = screenName => ({
  type: CHANGE_SCREEN,
  screenName,
});

export const onNavigateBack = () => ({
  type: ON_NAVIGATE_BACK,
});
