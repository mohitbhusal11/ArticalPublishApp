import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import BottomNavigation from './BottomNavigation';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import ForgotPasswordScreen from '../screen/ForgotPasswordScreen/ForgotPasswordScreen';
import ResetPasswordScreen from '../screen/ResetPasswordScreen/ResetPasswordScreen';

export type RootStackParamList = {
  BottomNavigation: undefined;
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  const token = useSelector((state: any) => state.auth.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="BottomNavigation" component={BottomNavigation} />

        </>
      ) : (
        <>
          {/* <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} /> */}
          {/* <Stack.Screen name="BottomNavigation" component={BottomNavigation} /> */}

          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigation;
