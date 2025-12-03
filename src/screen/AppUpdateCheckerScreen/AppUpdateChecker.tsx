import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
 
const AppUpdateChecker = ({ onForceUpdate }: { onForceUpdate: (value: boolean) => void }) => {
  useEffect(() => {
    const checkFirestoreUpdate = async () => {
      try {
        const currentVersionCode = Number(DeviceInfo.getBuildNumber());
        console.log('📱 Current versionCode:', currentVersionCode);
 
        const doc = await firestore().collection('ForceUpdate').doc('Android').get();
 
        if (!doc.exists) {
          console.log('⚠️ No ForceUpdate/Android document found.');
          return;
        }
 
        const data = doc.data();
 
        if (data?.versionCode && currentVersionCode < data.versionCode) {
          onForceUpdate(true);
        } else {
          onForceUpdate(false);
        }
      } catch (error) {
        console.error('🔥 Firestore update check failed:', error);
      }
    };
 
    checkFirestoreUpdate();
  }, []);
 
  return null;
};
 
export default AppUpdateChecker;