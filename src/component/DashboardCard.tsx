import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AppImage } from "../config/AppImage";
import { AppColor } from "../config/AppColor";
import GlobalText from "./GlobalText";

type DashboardCardProps = {
    title: string;
    count: number;
    discount: number;
    discountColor?: string;
    icon?: any;
    onPress?: () => void;
    iconBgColor?: string;
};

const defaultIcon = AppImage.setting_ic;

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  discount,
  discountColor = "red",
  icon = defaultIcon,
  onPress,
  iconBgColor = "#EAF2FF",
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <GlobalText numberOfLines={1} style={styles.title}>{title}</GlobalText>
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <GlobalText style={styles.count}>{count}</GlobalText>
          <GlobalText style={[styles.discount, { color: discountColor }]}>
            {discount >= 0 ? "↑" : "↓" }  {discount}%
          </GlobalText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: AppColor.color_ffffff,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: AppColor.c000000,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: AppColor.c000000,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  count: {
    fontSize: 22,
    color: "#111",
    fontWeight: "700",
    marginTop: 2,
  },
  discount: {
    fontSize: 13,
    marginTop: 4,
  },
});
