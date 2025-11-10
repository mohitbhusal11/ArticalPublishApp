import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { AppColor } from "../config/AppColor";

interface GlobalButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({
  children,
  onPress,
  style,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          flex: 1,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: disabled ? "#9E9E9E" : AppColor.mainColor,
        },
        style, // external styles can override
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default GlobalButton;
