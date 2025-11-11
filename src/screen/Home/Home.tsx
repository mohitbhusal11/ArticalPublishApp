import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { AppColor } from "../../config/AppColor";
import { AppImage } from "../../config/AppImage";
import { AppString } from "../../strings";
import DashboardCard from "../../component/DashboardCard";
import ToastUtils from "../../utils/toast";
import GlobalText from "../../component/GlobalText";
import GlobalSafeArea from "../../component/GlobalSafeArea";

// const dummyData = [
//   {
//     id: "1",
//     title: "Story Submitted",
//     count: 147,
//     discount: -5,
//     discountColor: "red",
//     icon: AppImage.assignment_ic,
//     iconBgColor: "#EAF2FF",
//     redirectionScreen: "all_story"
//   },
//   {
//     id: "2",
//     title: "Approved",
//     count: 98,
//     discount: 5,
//     discountColor: "green",
//     icon: AppImage.stories_ic,
//     iconBgColor: "#E9F7EF",
//     redirectionScreen: "approved_story"
//   },
//   {
//     id: "3",
//     title: "Pending",
//     count: 21,
//     discount: 2,
//     discountColor: "green",
//     icon: AppImage.dashboard_ic,
//     iconBgColor: "#E9F7EF",
//     redirectionScreen: "pending_story"
//   },
//   {
//     id: "4",
//     title: "Rejected",
//     count: 12,
//     discount: 3,
//     discountColor: "green",
//     redirectionScreen: "rejected_story"
//   },
// ]

const dummyData = {
  stories: [
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
  assignments: [
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
  others: [
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
};

interface CardItem {
  id: string;
  title: string;
  count: number;
  discount: number;
  discountColor: string;
  icon?: string;
  iconBgColor?: string;
  redirectionScreen: string;
}

interface Category {
  id: string;
  title: string;
  data: CardItem[];
}


const Home: React.FC = ({ navigation }) => {

  const [data, setData] = useState(dummyData)

  const handlenewstory = () => {
    navigation.navigate("EditorScreen")
  }

  const handleViewMyAssignments = () => {
    navigation.navigate("AssignmentsScreen")
  }

  const categoryList: Category[] = Object.keys(data).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1),
    data: (data as any)[key],
  }));

  const handleCardClicked = (redirectionScreen: string) => {

    console.log(redirectionScreen);

    switch (redirectionScreen) {
      case "all_story":
        navigation.navigate("StoriesScreen", { filter: "all_story" })
        break;
      case "approved_story":
        navigation.navigate("StoriesScreen", { filter: "approved_story" })
        break;
      case "pending_story":
        navigation.navigate("StoriesScreen", { filter: "pending_story" })
        break;
      case "rejected_story":
        navigation.navigate("StoriesScreen", { filter: "rejected_story" })
        break;

      default:
        ToastUtils.info("This card don't have redirection screen.")
        navigation.navigate("StoriesScreen", { filter: "all_story" })
        break;
    }


  }

  return (
    <GlobalSafeArea style={styles.container}>

      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <GlobalText style={styles.cardsTitle}>{item.title}</GlobalText>
            <FlatList
              data={item.data}
              keyExtractor={(subItem) => subItem.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false} // prevent scroll conflict
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

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  createButton: {
    backgroundColor: AppColor.mainColor,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: 10
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    fontSize: 15,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  editText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  description: {
    color: "#555",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#999",
    fontSize: 12,
  },
  deleteText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 13,
  },
  btnImageStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain'
  },
  listContainer: {
    paddingVertical: 2,
  },
  row: {
    justifyContent: "space-between",
  },
  cardsTitle: {
    paddingHorizontal: 12,
    fontSize: 24,
    fontWeight: 500,
    color: AppColor.mainColor,
    marginTop: 12
  }
});
