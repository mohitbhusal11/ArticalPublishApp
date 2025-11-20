import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { AppImage } from "../../config/AppImage";
import DashboardCard from "../../component/DashboardCard";
import ToastUtils from "../../utils/toast";
import GlobalText from "../../component/GlobalText";
import GlobalSafeArea from "../../component/GlobalSafeArea";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { styles } from "./style";
import { DashboardCategory, fetchDashboard } from "../../services/calls/dashboardService";
import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<DashboardCategory[]>([]);
  const [hasNotification, setHasNotification] = useState(true);
  const user = useSelector((state: RootState) => state.userDetails.details);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = () => {
    ToastUtils.info("Notifications clicked!");
    setHasNotification(false);
  };

  const handleCardClicked = (redirectionScreen: string) => {
    console.log("redirectionScreen: ", redirectionScreen);

    switch (redirectionScreen) {
      case "submitted_story":
        navigation.navigate("StoriesScreen", { status: "Submit" });
        break;
      case "approved_story":
        navigation.navigate("StoriesScreen", { status: "Approved" });
        break;
      case "review_story":
        navigation.navigate("StoriesScreen", { status: "Review" });
        break;
      case "draft_story":
        navigation.navigate("StoriesScreen", { status: "Draft" });
        break;
      case "publish_story":
        navigation.navigate("StoriesScreen", { status: "Publish" });
        break;
      case "submitted_assignment":
        navigation.navigate("AssignmentsScreen", { status: "Submit" });
        break;
      case "pending_assignment":
        navigation.navigate("AssignmentsScreen", { status: "Pending" });
        break;
      case "rejected_assignment":
        navigation.navigate("AssignmentsScreen", { status: "Rejected" });
        break;
      case "assigned_assignment":
        navigation.navigate("AssignmentsScreen", { status: "All" });
        break;
      case "accepted_assignment":
        navigation.navigate("AssignmentsScreen", { status: "Accepted" });
        break;
      default:
        ToastUtils.info("This card doesn't have a redirection screen.");
        break;
    }
  };

  const handleEditProfileClick = () => {
    navigation.navigate('EditProfileScreen')
  }

  const getDashboardData = async () => {
    try {
      const data = await fetchDashboard(); // 👈 now call only once
      console.log("response: ", data);
      setData(data.payload);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getDashboardData();
    }
  }, [isFocused]);

  return (
    <GlobalSafeArea style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <GlobalText style={styles.greetingText}>{getGreeting()},</GlobalText>
          {user?.userName.trim() && <GlobalText style={styles.usernameText}>{user?.userName} 👋</GlobalText>}
        </View>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.iconWrapper}>
          <Image
            source={AppImage.notification}
            style={styles.notificationIcon}
          />
          {hasNotification && <View style={styles.notificationDot} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditProfileClick} >
          <FastImage
            style={styles.profileIcon}
            source={{ uri: user?.imgUrl }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <GlobalText style={styles.cardsTitle}>{item.title}</GlobalText>
            <FlatList
              data={item.data}
              keyExtractor={(subItem) => subItem.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false}
              renderItem={({ item: card }) => (
                <DashboardCard
                  title={card.title}
                  count={card.count}
                  discount={card.discount}
                  discountColor={card.discountColor}
                  icon={card.icon}
                  iconBgColor={card.iconBgColor}
                  onPress={() => handleCardClicked(card.redirectionScreen)}
                />
              )}
            />
          </View>
        )}
      />
    </GlobalSafeArea>
  );
};

export default Home;
