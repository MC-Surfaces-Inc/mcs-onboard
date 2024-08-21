import React from "react";
import { TouchableOpacity } from "react-native";

export default function IconButton(props) {
  return (
    <TouchableOpacity
      // title={props.title}
      className={props.className}
      onPress={props.onPress}
    >
      {props.icon}
    </TouchableOpacity>
  )
}