import React from "react";
import { View } from "react-native";

export default function Layout({ children }) {
  return (
    <View className={"justify-center align-middle w-full h-full"}>
      {children}
    </View>
  );
}
