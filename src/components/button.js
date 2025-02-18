import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const sizes = {
  xs: "w-1/6",
  sm: "w-1/4",
  md: "w-1/3",
  lg: "w-1/2",
  xl: "w-3/4"
};

const types = {
  text: {
    action: "",
    success: "",
    error: ""
  },
  contained: {
    default: "rounded-lg bg-blue-600",
    action: "rounded-lg bg-orange-500",
    success: "rounded-lg bg-green-400",
    error: "rounded-lg bg-red-500"
  },
  outlined: {
    default: "border-2 rounded-lg border-blue-600",
    action: "border-2 rounded-lg border-orange-500",
    success: "border-2 rounded-lg border-green-400",
    error: "border-2 rounded-lg border-red-500"
  }
};

const text = {
  text: {
    action: "text-orange-500",
    success: "text-green-400",
    error: "text-red-500"
  },
  contained: {
    action: "text-white",
    success: "text-white",
    error: "text-white"
  },
  outlined: {
    action: "text-orange-500",
    success: "text-green-400",
    error: "text-red-500"
  }
}

export default function Button({
  title, type, size, color, onPress, className, fontClass, disabled, icon, children, textIcon
}) {
  return (
    <TouchableOpacity
      title={title}
      className={`flex-row items-center my-1 justify-center ${sizes[size]} ${types[type][color]} p-2 ${className} ${disabled && "opacity-50"}`}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <View className={"flex-1 items-center -ml-10"}>
          {icon}
        </View>
      )}
      <View className={"flex-row items-center"}>
        <Text className={`font-quicksand font-semibold ${text[type][color]} ${fontClass}`}>{title}</Text>
        {textIcon && textIcon}
      </View>
    </TouchableOpacity>
  )
}