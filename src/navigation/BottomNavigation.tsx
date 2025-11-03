import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUserDetails } from '../services/calls/userService';
import BottomNotificationListScreen from '../screen/BottomNotificationListScreen/BottomNotificationListScreen';
import Home from '../screen/Home/Home';
import { AppColor } from '../config/AppColor';
import { AppDispatch, RootState } from '../redux/store';
import { AppImage } from '../config/AppImage';

const Tab = createBottomTabNavigator();

const tabBarIcon =
    (icon: any) =>
        ({ focused }: { focused: boolean }) =>
        (
            <Image
                source={icon}
                style={[
                    styles.icon,
                    { tintColor: focused ? AppColor.mainColor : AppColor.color_8e8e93 },
                ]}
            />
        );

const BottomNavigation = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const dispatch = useDispatch<AppDispatch>();
    // const user = useSelector((state: RootState) => state.userDetails.details);


    useEffect(() => {
        console.log("in bottomsheet useefffect: ", token);

        if (token) {

            dispatch(fetchUserDetails());
        }
    }, [dispatch, token]);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
        >

            <Tab.Screen
                name="Home"
                component={Home}
                options={{ tabBarIcon: tabBarIcon(AppImage.home_tab_ic) }}
            />
            <Tab.Screen
                name="BottomNotificationListScreen"
                component={BottomNotificationListScreen}
                options={{ tabBarIcon: tabBarIcon(AppImage.bottomnavigation_notification_ic) }}
            />
        </Tab.Navigator>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: AppColor.color_fff,
        height: 100,
        paddingTop: 5
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'cover'
    },
});
