import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Toast from 'react-native-toast-message';
import MainNavigation from './src/navigation/MainNavigation';
import { persistor, store } from './src/redux/store';
import { AppColor } from './src/config/AppColor';
import { registerNotificationListeners } from './src/notifications/NotificationService';
import AppUpdateChecker from './src/screen/AppUpdateCheckerScreen/AppUpdateChecker';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    registerNotificationListeners();
  }, []);

  const handleCloseApp = () => {
    BackHandler.exitApp(); // Closes the app
  };

  const handleOpenPlayStore = () => {
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.rensapp'
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.mainContainer, { backgroundColor: isDarkMode ? AppColor.c000000 : AppColor.ffffff }]}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Provider store={store}>
          <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
            <NavigationContainer>
              {/* <MainNavigation /> */}

              <AppUpdateChecker onForceUpdate={setForceUpdate} />

              {forceUpdate ? (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 24,
                  }}
                >
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/3048/3048122.png', // 🚀 rocket icon
                    }}
                    style={{ width: 120, height: 120, marginBottom: 24 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '700',
                      textAlign: 'center',
                      color: '#000',
                      marginBottom: 12,
                    }}
                  >
                    New update is available
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'center',
                      color: '#555',
                      marginBottom: 30,
                      lineHeight: 22,
                    }}
                  >
                    The current version of this application is no longer supported.
                    We apologize for any inconvenience caused.
                  </Text>

                  {/* Update Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#4DB6AC',
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 50,
                      marginBottom: 16,
                    }}
                    onPress={handleOpenPlayStore}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Update now
                    </Text>
                  </TouchableOpacity>

                  {/* Close App Button */}
                  <TouchableOpacity onPress={handleCloseApp}>
                    <Text
                      style={{
                        color: '#007bff',
                        textDecorationLine: 'underline',
                        fontSize: 15,
                      }}
                    >
                      No, Thanks! Close the app
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <MainNavigation />
              )}
              <Toast />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  mainContainer: { flex: 1 }
})