import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { AppColor } from "../../config/AppColor";
import { AppImage } from "../../config/AppImage";
import { AppString } from "../../strings";
import DashboardCard from "../../component/DashboardCard";
import ToastUtils from "../../utils/toast";

const dummyData = [
  {
    id: "1",
    title: "Story Submitted",
    count: 147,
    discount: -5,
    discountColor: "red",
    icon: AppImage.assignment_ic,
    iconBgColor: "#EAF2FF",
    redirectionScreen: "all_story"
  },
  {
    id: "2",
    title: "Approved",
    count: 98,
    discount: 5,
    discountColor: "green",
    icon: AppImage.stories_ic,
    iconBgColor: "#E9F7EF",
    redirectionScreen: "approved_story"
  },
  {
    id: "3",
    title: "Pending",
    count: 21,
    discount: 2,
    discountColor: "green",
    icon: AppImage.dashboard_ic,
    iconBgColor: "#E9F7EF",
    redirectionScreen: "pending_story"
  },
  {
    id: "4",
    title: "Rejected",
    count: 12,
    discount: 3,
    discountColor: "green",
    redirectionScreen: "rejected_story"
  },
]

const Home: React.FC = ({ navigation }) => {
 
  const [data, setData] = useState(dummyData)

  const handlenewstory = () => {
    navigation.navigate("EditorScreen")
  }

  const handleViewMyAssignments = () => {
    navigation.navigate("AssignmentsScreen")
  }

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
    <View style={styles.container}>
      {/* Create New Story Button */}
      <TouchableOpacity onPress={handlenewstory} style={styles.createButton}>
        <Image source={AppImage.stories_ic} style={styles.btnImageStyle} />
        <Text style={styles.createButtonText}>{AppString.common.createNewStory}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleViewMyAssignments} style={[styles.createButton, { backgroundColor: AppColor.ffffff }]}>
        <Image source={AppImage.assignment_ic} style={[styles.btnImageStyle, { tintColor: AppColor.mainColor }]} />
        <Text style={[styles.createButtonText, { color: AppColor.mainColor }]}>{AppString.common.viewMyAssignments}</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <DashboardCard
            title={item.title}
            count={item.count}
            discount={item.discount}
            discountColor={item.discountColor}
            icon={item.icon}
            iconBgColor={item.iconBgColor}
            onPress={handleCardClicked.bind(null, item.redirectionScreen)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

    </View>
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
    paddingVertical: 12,
  },
  row: {
    justifyContent: "space-between",
  },
});
