import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
     mainContainer: {
        margin: 15,
    },
    safeArea: {
        flex: 1,
        backgroundColor: AppColor.color_fff,
    },
    containerBlueRoundView: {
    flexDirection: "row",
    backgroundColor: AppColor.mainColor,
    padding: 12,
    fontWeight: "bold",
    color:AppColor.color_fff,
    justifyContent:"space-between",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    color: AppColor.color0A2C59,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: AppColor.color_ddd,
    borderRadius: 8,
    fontWeight: "bold",
    padding: 10,
    marginBottom: 8,
    backgroundColor: AppColor.color_f2f2f2,
    color: AppColor.color_767676,
  },
  
  card: {
    backgroundColor: AppColor.color_fff,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },

Btn: {
    backgroundColor: AppColor.mainColor,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,

  },
  btnText: {
    color: AppColor.color_fff,
    fontSize: 16,
    fontWeight: "bold",
  },

});
