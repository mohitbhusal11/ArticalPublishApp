import React, { useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppColor } from "../config/AppColor";
import { AppImage } from "../config/AppImage";
import Home from "../screen/Home/Home";
import StoriesScreen from "../screen/StoriesScreen/StoriesScreen";
import AssignmentsScreen from "../screen/AssignmentsScreen/AssignmentsScreen";
import SettingsScreen from "../screen/SettingsScreen/SettingsScreen";
import { fetchUserDetails } from "../services/calls/userService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ navigation }: any) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const dispatch = useDispatch<AppDispatch>();
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
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={AppImage.dashboard_ic}
                            style={[
                                styles.icon,
                                { tintColor: focused ? AppColor.mainColor : AppColor.accentColor },
                            ]}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="StoriesScreen"
                component={StoriesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={AppImage.stories_ic}
                            style={[
                                styles.icon,
                                { tintColor: focused ? AppColor.mainColor : AppColor.accentColor },
                            ]}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Create"
                component={Home}
                options={{
                    tabBarIcon: () => (
                        <View style={styles.centerButtonContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("EditorScreen")} activeOpacity={0.9} style={styles.centerButton}>
                                <Image
                                    source={AppImage.plus_icon_white}
                                    style={styles.plusIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="AssignmentsScreen"
                component={AssignmentsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={AppImage.assignment_ic}
                            style={[
                                styles.icon,
                                { tintColor: focused ? AppColor.mainColor : AppColor.accentColor },
                            ]}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={AppImage.setting_ic}
                            style={[
                                styles.icon,
                                { tintColor: focused ? AppColor.mainColor : AppColor.accentColor },
                            ]}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        left: 20,
        right: 20,
        height: 65,
        backgroundColor: AppColor.ffffff,
        shadowOffset: { width: 0, height: 4 },
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    centerButtonContainer: {
        position: "absolute",
        top: -30,
        alignSelf: "center",
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: AppColor.mainColor,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10,
    },
    plusIcon: {
        width: 28,
        height: 28,
        resizeMode: "contain",
    },
});
