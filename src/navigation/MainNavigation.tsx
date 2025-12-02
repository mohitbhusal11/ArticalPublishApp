import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import BottomNavigation from './BottomNavigation';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import ForgotPasswordScreen from '../screen/ForgotPasswordScreen/ForgotPasswordScreen';
import ResetPasswordScreen from '../screen/ResetPasswordScreen/ResetPasswordScreen';
import EditorScreen from '../screen/EditorScreen/EditorScreen';
import StoriesScreen from '../screen/StoriesScreen/StoriesScreen';
import AssignmentsScreen from '../screen/AssignmentsScreen/AssignmentsScreen';
import SettingsScreen from '../screen/SettingsScreen/SettingsScreen';
import EditProfileScreen from '../screen/EditProfileScreen/EditProfileScreen';
import ChangePasswordScreen from '../screen/ChangePasswordScreen/ChangePasswordScreen';
import { Story } from '../services/calls/stories';
import StoryDetailScreen from '../screen/StoryDetailScreen/StoryDetailScreen';
import DraftStoryScreen from '../screen/DraftStoryScreen/DraftStoryScreen';
import AssignmentDetailsScreen from '../screen/AssignmentDetailsScreen/AssignmentDetailsScreen';

export type RootStackParamList = {
  BottomNavigation: undefined;
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: { userId: string };
  EditorScreen: undefined;
  StoriesScreen: {status?: string};
  AssignmentsScreen: undefined;
  SettingsScreen: undefined;
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  StoryDetailScreen: {item: Story};
  DraftStoryScreen: {item: Story};
  AssignmentDetailsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  const token = useSelector((state: any) => state.auth.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
          <Stack.Screen name="EditorScreen" component={EditorScreen} />
          <Stack.Screen name="StoriesScreen" component={StoriesScreen} />
          <Stack.Screen name="AssignmentsScreen" component={AssignmentsScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="StoryDetailScreen" component={StoryDetailScreen} />
          <Stack.Screen name="DraftStoryScreen" component={DraftStoryScreen} />
          <Stack.Screen name="AssignmentDetailsScreen" component={AssignmentDetailsScreen} />

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
