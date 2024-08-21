import React from "react";
import { Text, View } from "react-native";

export default function Badge(props) {
  if (props.label === "") {
    return (
      <View className={props.className + " m-1 rounded-md items-center"}>
        <Text className={"font-quicksand text-white my-2 mx-3"}>No Data Found</Text>
      </View>
    )
  }

  return (
    <View className={props.className + " m-1 rounded-md items-center"}>
      <Text className={"font-quicksand text-white my-2 mx-3"}>{props.label}</Text>
    </View>
  )
}