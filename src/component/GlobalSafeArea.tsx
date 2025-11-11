import React from "react";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";

interface GlobalSafeAreaProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const GlobalSafeArea: React.FC<GlobalSafeAreaProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[{ flex: 1, paddingBottom: 65 }, style]}>
      {children}
    </SafeAreaView>
  );
};

export default GlobalSafeArea;
