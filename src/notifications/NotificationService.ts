import messaging from '@react-native-firebase/messaging';
import { navigate } from '../navigation/NavigationService';

export function registerNotificationListeners() {
  // Foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);

    const screen = remoteMessage.data?.screen as string | undefined;
    const id = remoteMessage.data?.id as string | undefined;

    // Navigate with conditional logic
    handleNotificationNavigation(screen, id);
  });

  // When notification tapped in background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Opened from background:', remoteMessage);

    const screen = remoteMessage.data?.screen as string | undefined;
    const id = remoteMessage.data?.id as string | undefined;

    // Navigate with conditional logic
    handleNotificationNavigation(screen, id);
  });

  // When notification tapped from quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Opened from quit state:', remoteMessage);

        const screen = remoteMessage.data?.screen as string | undefined;
        const id = remoteMessage.data?.id as string | undefined;

        handleNotificationNavigation(screen, id);
      }
    });

  // Background (message handled silently)
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background!', remoteMessage);
  });
}

// Helper function to handle navigation logic
function handleNotificationNavigation(screen?: string, id?: string) {
  if (!screen) {
    console.log('No screen specified in notification');
    return;
  }

  // Convert screen to lowercase for case-insensitive comparison
  const screenLower = screen.toLowerCase();
  
  // Check if ID is null, undefined, or empty string
  const hasValidId = id && id.trim() !== '' && id !== 'null' && id !== 'undefined';

  // Navigate based on screen type and ID availability
  if (screenLower === 'story') {
    if (hasValidId) {
      // If Story with ID exists, navigate to StoryDetail or specific story
      navigate('StoryDetail', { id });
      console.log(`Navigating to StoryDetail with id: ${id}`);
    } else {
      // If Story without ID, navigate to Stories list
      navigate('StoriesScreen');
      console.log('Navigating to StoriesScreen (no id provided)');
    }
  } 
  else if (screenLower === 'assignment') {
    if (hasValidId) {
      // If Assignment with ID exists, navigate to AssignmentDetail
      navigate('AssignmentDetail', { id });
      console.log(`Navigating to AssignmentDetail with id: ${id}`);
    } else {
      // If Assignment without ID, navigate to Assignments list
      navigate('AssignmentsScreen');
      console.log('Navigating to AssignmentsScreen (no id provided)');
    }
  }
  else {
    // For other screens, navigate normally
    navigate(screen, hasValidId ? { id } : {});
    console.log(`Navigating to ${screen} ${hasValidId ? `with id: ${id}` : 'without id'}`);
  }
}