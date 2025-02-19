import React from "react";
import { Pressable } from "react-native";

export default function IconButton(props) {
  return (
    <Pressable
      // title={props.title}
      className={`${props.className} active:opacity-50 items-center justify-center`}
      onPress={!props.disabled && props.onPress}
      disabled={props.disabled}
    >
      {props.icon}
    </Pressable>
  )
}