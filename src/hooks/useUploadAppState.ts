import { AppState, AppStateStatus } from 'react-native';

let isAppInBackground = false;

export const initUploadAppState = (
  onForeground: () => void,
  onBackground?: () => void,
) => {
  const subscription = AppState.addEventListener(
    'change',
    (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        isAppInBackground = true;
        onBackground?.();
      }

      if (nextState === 'active') {
        isAppInBackground = false;
        onForeground();
      }
    },
  );

  return () => subscription.remove();
};

export const isBackground = () => isAppInBackground;
