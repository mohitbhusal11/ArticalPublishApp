import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: AppColor.color_F5F5F5,
  },
  headline: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: AppColor.color_111111,
  },
  metaContainer: {
    marginBottom: 16,
    backgroundColor: AppColor.color_ffffff,
    padding: 10,
    borderRadius: 12,
    shadowColor: AppColor.color_000,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metaText: {
    fontSize: 14,
    color: AppColor.color_666666,
  },
  metaValue: {
    fontWeight: "600",
    color: AppColor.c000000,
  },
  htmlContainer: {
    backgroundColor: AppColor.color_ffffff,
    padding: 12,
    borderRadius: 12,
    shadowColor: AppColor.color_000,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  video: {
    width: "100%",
    height: 220,
    backgroundColor: AppColor.color_000,
    borderRadius: 10,
    marginVertical: 10,
  },
  mediaContainer: {
    marginTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },

  mediaHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: AppColor.color_222,
  },
  listContainer: {
    marginTop: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: AppColor.color_DDDDDD,
  },

  fileIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  fileName: {
    flex: 1,
    color: AppColor.color_333333,
  },

  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },

  videoPreview: {
    width: 40,
    height: 40,
    backgroundColor: AppColor.color_000,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginRight: 10,
  },
  videoText: {
    color: AppColor.color_FFFFFF,
    fontSize: 10,
  },

  docPreview: {
    width: 40,
    height: 40,
    backgroundColor: AppColor.color_E9E9E9,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginRight: 10,
  },
  docText: {
    color: AppColor.color_555555,
    fontSize: 10,
  },
});