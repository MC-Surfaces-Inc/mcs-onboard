import React from "react";
import { Text, TouchableOpacity } from "react-native";

const sizes = {
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
    action: "rounded-lg bg-orange-500",
    success: "rounded-lg bg-green-400",
    error: "rounded-lg bg-red-500"
  },
  outlined: {
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

export default function Button({ title, type, size, color, onPress, className, fontClass, disabled }) {
  return (
    <TouchableOpacity
      title={title}
      className={`items-center justify-center ${sizes[size]} ${types[type][color]} p-2 ${className}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={`font-quicksand font-semibold ${text[type][color]} ${fontClass}`}>{title}</Text>
    </TouchableOpacity>
  )
}