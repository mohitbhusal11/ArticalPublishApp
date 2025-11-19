import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: AppColor.c000000,
    marginBottom: 20,
    lineHeight: 28,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  row: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  statusChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    backgroundColor: "#E8F1FF",
  },

  statusText: {
    color: AppColor.mainColor,
    fontWeight: "700",
  },

  briefCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: AppColor.mainColor,
  },

  briefText: {
    fontSize: 15,
    color: "#2F3E4D",
    lineHeight: 22,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },

  acceptBtn: {
    backgroundColor: "#2ECC71",
  },

  declineBtn: {
    backgroundColor: "#E74C3C",
  },

  createBtn: {
    backgroundColor: AppColor.mainColor,
    marginTop: 10,
  },

  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#E9EEF5",
    marginTop: 10,
  },

  infoText: {
    fontSize: 15,
    color: "#5A6B7B",
    textAlign: "center",
    fontWeight: "500",
  },
  rowContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
  gap: 10,
},

rowLabel: {
  fontSize: 14,
  flex: 1,
  color: "#7B8CA3",
},

rowValue: {
  fontSize: 15,
  fontWeight: "600",
  color: "#1A1D21",
  flex: 2,
  textAlign: "right",
},

badge: {
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 16,
  alignSelf: "flex-end",
},

badgeText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "700",
},

});
