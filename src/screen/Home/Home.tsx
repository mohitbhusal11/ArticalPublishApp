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
import { imageBaseURL } from "../../services/api/axiosInstance";
import { styles } from "./style";
import { DashboardCategory, DashboardItem, DashboardResponse, fetchDashboard } from "../../services/calls/dashboardService";
import { useIsFocused } from "@react-navigation/native";

const dummyData = [
  {
    id: "1",
    title: "Stories",
    data: [
      {
        id: "1",
        title: "Story Submitted",
        count: 147,
        discount: -5,
        discountColor: "red",
        icon: AppImage.assignment_ic,
        iconBgColor: "#EAF2FF",
        redirectionScreen: "submitted_story",
      },
      {
        id: "2",
        title: "Approved Story",
        count: 98,
        discount: 5,
        discountColor: "green",
        icon: AppImage.stories_ic,
        iconBgColor: "#E9F7EF",
        redirectionScreen: "approved_story",
      },
      {
        id: "3",
        title: "Under Review",
        count: 42,
        discount: 3,
        discountColor: "orange",
        icon: AppImage.dashboard_ic,
        iconBgColor: "#FFF3E0",
        redirectionScreen: "review_story",
      },
      {
        id: "4",
        title: "Rejected Story",
        count: 19,
        discount: -2,
        discountColor: "red",
        icon: AppImage.assignment_ic,
        iconBgColor: "#FFE5E5",
        redirectionScreen: "rejected_story",
      },
    ],
  },
  {
    id: "2",
    title: "Assignments",
    data: [
      {
        id: "5",
        title: "Assignment Submitted",
        count: 36,
        discount: -1,
        discountColor: "red",
        icon: AppImage.assignment_ic,
        iconBgColor: "#EAF2FF",
        redirectionScreen: "submitted_assignment",
      },
      {
        id: "6",
        title: "Approved Assignment",
        count: 28,
        discount: 4,
        discountColor: "green",
        icon: AppImage.dashboard_ic,
        iconBgColor: "#E9F7EF",
        redirectionScreen: "approved_assignment",
      },
      {
        id: "7",
        title: "Under Review Assignment",
        count: 15,
        discount: 2,
        discountColor: "orange",
        icon: AppImage.stories_ic,
        iconBgColor: "#FFF3E0",
        redirectionScreen: "review_assignment",
      },
      {
        id: "8",
        title: "Rejected Assignment",
        count: 9,
        discount: -3,
        discountColor: "red",
        icon: AppImage.assignment_ic,
        iconBgColor: "#FFE5E5",
        redirectionScreen: "rejected_assignment",
      },
    ],
  },
  {
    id: "3",
    title: "Others",
    data: [
      {
        id: "9",
        title: "Feedback Submitted",
        count: 11,
        discount: 0,
        discountColor: "blue",
        icon: AppImage.stories_ic,
        iconBgColor: "#EAF2FF",
        redirectionScreen: "feedback_submitted",
      },
      {
        id: "10",
        title: "Feedback Approved",
        count: 6,
        discount: 2,
        discountColor: "green",
        icon: AppImage.dashboard_ic,
        iconBgColor: "#E9F7EF",
        redirectionScreen: "feedback_approved",
      },
      {
        id: "11",
        title: "Feedback Review",
        count: 4,
        discount: 1,
        discountColor: "orange",
        icon: AppImage.assignment_ic,
        iconBgColor: "#FFF3E0",
        redirectionScreen: "feedback_review",
      },
      {
        id: "12",
        title: "Feedback Rejected",
        count: 3,
        discount: -1,
        discountColor: "red",
        icon: AppImage.stories_ic,
        iconBgColor: "#FFE5E5",
        redirectionScreen: "feedback_rejected",
      },
    ],
  },
];

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<DashboardCategory[]>([]);
  const [hasNotification, setHasNotification] = useState(true);
  const user = useSelector((state: RootState) => state.userDetails.details);
  const imgUrl = imageBaseURL + user?.imgUrl
  const isFocused = useIsFocused();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleNotificationPress = () => {
    ToastUtils.info("Notifications clicked!");
    setHasNotification(false); // remove dot once opened
  };

  const handleCardClicked = (redirectionScreen: string) => {
    switch (redirectionScreen) {
      case "submitted_story":
      case "approved_story":
      case "review_story":
      case "rejected_story":
        navigation.navigate("StoriesScreen", { filter: redirectionScreen });
        break;
      case "submitted_assignment":
      case "review_assignment":
      case "rejected_assignment":
      case "approved_assignment":
        navigation.navigate("AssignmentsScreen", { filter: redirectionScreen });
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
          <Image
            source={user?.imgUrl
              ? { uri: imgUrl }
              : AppImage.profile_placeholder_ic}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <GlobalText style={styles.cardsTitle}>{item.title}</GlobalText>
            <FlatList
              data={item.data}
              keyExtractor={(subItem) => subItem.id}
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
