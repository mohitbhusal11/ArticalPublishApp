import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 17,
    fontWeight: "400",
    color: "#666",
  },
  usernameText: {
    fontSize: 22,
    fontWeight: "700",
    color: AppColor.mainColor,
  },
  iconWrapper: {
    position: "relative",
    marginRight: 15,
  },
  notificationIcon: {
    width: 26,
    height: 26,
    tintColor: AppColor.mainColor,
    resizeMode: "contain",
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "red",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF2FF",
    resizeMode: "contain",
  },
  row: {
    justifyContent: "space-between",
  },
  listContainer: {
    paddingVertical: 2,
  },
  cardsTitle: {
    paddingHorizontal: 12,
    fontSize: 22,
    fontWeight: "600",
    color: AppColor.mainColor,
    marginTop: 12,
    marginBottom: 8,
  },
});