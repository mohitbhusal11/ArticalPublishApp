import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export function registerNotificationListeners() {
  // Foreground
  messaging().onMessage(async remoteMessage => {
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || ''
    );
  });

  // Background (message handled silently)
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background!', remoteMessage);
  });

  // When notification tapped in background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('App opened from background by notification:', remoteMessage.notification);
  });

  // When notification tapped from quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from quit state by notification:', remoteMessage.notification);
      }
    });
}
