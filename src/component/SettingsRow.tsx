import React from "react";
import {
  View,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native";
import { AppColor } from "../config/AppColor";
import GlobalText from "./GlobalText";


type SettingsRowProps = {
  icon?: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: (event: GestureResponderEvent) => void;
};

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title = "",
  subtitle = "",
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Icon */}
      {icon && (
        <View style={styles.iconWrapper}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        </View>
      )}

      {/* Text section */}
      <View style={styles.textWrapper}>
        {title ? (
          <GlobalText style={styles.title}>{title}</GlobalText>
        ) : null}
        {subtitle ? (
          <GlobalText style={styles.subtitle}>{subtitle}</GlobalText>
        ) : null}
      </View>

      {/* Switch */}
      {showSwitch && (
        <Switch
          onValueChange={onSwitchChange}
          value={switchValue}
          trackColor={{ false: AppColor.color_9A9A9A, true: AppColor.color_9A9A9A }}
          thumbColor={switchValue ? AppColor.mainColor : AppColor.color_D7D7D7}
        />
      )}
    </TouchableOpacity>
  );
};

export default SettingsRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  iconWrapper: {
    overflow: "hidden",
    width: 36,
    height: 36,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: AppColor.c000000,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  textWrapper: {
    flexDirection: "column",
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  title: {
    color: AppColor.mainColor,
    fontSize: 12,
    fontWeight: "700",
  },
  subtitle: {
    color: AppColor.color_C0C0C0,
    fontSize: 12,
    fontWeight: "400",
    marginEnd: 4,
  },
});
