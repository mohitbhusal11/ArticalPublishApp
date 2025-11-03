import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import BottomNavigation from './BottomNavigation';

export type RootStackParamList = {
  BottomNavigation: undefined;
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
          <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigation;
