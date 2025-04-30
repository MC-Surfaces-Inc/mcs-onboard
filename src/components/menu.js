import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconButton from "../components/iconButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Divider from "../components/divider";

export default function Menu({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View className={"shadow-sm"}>
      <IconButton
        icon={
          <FontAwesome5
            name={"bars"}
            size={20}
            color={"#172554"}
            className={"m-2"}
          />
        }
        onPress={() => setIsOpen(!isOpen)}
        className={"border border-gray-800 rounded-lg  mx-1 h-10 w-10"}
      />

      {isOpen && (
        <View className={"bg-gray-100 border border-gray-500 rounded-md mr-2 absolute z-50 mt-12 right-0 w-60"}>
          {children}
        </View>
      )}
    </View>
  );
};

const Item = (props) => (
  <Pressable disabled={props.disabled} className={"mx-2 ml-6 my-2 active:opacity-50"} onPress={props.onPress}>
    <Text className={`font-quicksand ${props.textStyle || "text-slate-800"} ${props.disabled && "text-slate-400"}`}>{props.title}</Text>
  </Pressable>
);
Menu.Item = Item;

const Title = (props) => (
  <React.Fragment>
    <Text className="font-quicksand font-semibold text-slate-800 mx-2 my-2">{props.title}</Text>
    <Divider />
  </React.Fragment>
);
Menu.Title = Title;