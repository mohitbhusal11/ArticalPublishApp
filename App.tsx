import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Toast from 'react-native-toast-message';
import MainNavigation from './src/navigation/MainNavigation';
import { persistor, store } from './src/redux/store';
import { AppColor } from './src/config/AppColor';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
              <MainNavigation />
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