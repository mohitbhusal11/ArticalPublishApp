import messaging from '@react-native-firebase/messaging';
import { navigate } from '../navigation/NavigationService';

export function registerNotificationListeners() {
  // Foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);

  });

  // Background (message handled silently)
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background!', remoteMessage);
  });

  // When notification tapped in background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Opened from background:', remoteMessage);

    const screen = remoteMessage.data?.screen as string | undefined;
    const id = remoteMessage.data?.id as string | undefined;

    // Navigate
    if (screen) {
      navigate(screen, { id });
    }
  });


  // When notification tapped from quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Opened from quit state:', remoteMessage);

        const screen = remoteMessage.data?.screen as string | undefined;
        const id = remoteMessage.data?.id as string | undefined;

        if (screen) {
          navigate(screen, { id });
        }
      }
    });
}
