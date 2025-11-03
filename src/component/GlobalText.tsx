import React from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";

interface GlobalTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  formatNumber?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

const formatIndianNumber = (value: string | number) => {
  if (!value) return value;
  if (!isNaN(Number(value))) {
    return Number(value).toLocaleString("en-IN");
  }
  return value;
};

const GlobalText: React.FC<GlobalTextProps> = ({
  children,
  style,
  formatNumber = true,
  numberOfLines,
  ellipsizeMode,
  ...rest
}) => {
  let displayValue = children;

  if (formatNumber && typeof children === "string") {
    displayValue = formatIndianNumber(children);
  } else if (formatNumber && typeof children === "number") {
    displayValue = formatIndianNumber(children);
  }

  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode} allowFontScaling={false} style={style} {...rest}>
      {displayValue}
    </Text>
  );
};

export default GlobalText;
