import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import IconButton from "../components/iconButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Divider } from "native-base";

export default function Menu({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View className={"z-50 shadow-sm"}>
      <IconButton
        icon={
          <FontAwesome5
            name={"bars"}
            size={24}
            color={"#172554"}
            className={"m-2 mx-4"}
          />
        }
        onPress={() => setIsOpen(!isOpen)}
      />

        {/*<Animated.View style={[collapsibleStyle, { position: "absolute", marginTop: 30, width: 200, right: 0 }]}>*/}
          {isOpen && (
            <View className={"bg-gray-100 border border-gray-500 rounded-md mr-2 absolute z-50 mt-12 right-0 w-60"}>
              {children}
            </View>
          )}
        {/*</Animated.View>*/}
    </View>
  );
};

const Item = (props) => (
  <Pressable disabled={props.disabled} className={"mx-2 ml-6 my-2 active:opacity-50"} onPress={props.onPress}>
    <Text className={"font-quicksand text-slate-800"}>{props.title}</Text>
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

const styles = StyleSheet.create({
  container: {
    width: 200,
    position: 'absolute',
    right: 0,
    marginTop: 30,
    top: 5,
  },
  arrow: {
    position: 'absolute',
    top: 25,
    right: 7,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
    transform: [{ rotate: '90deg' }],
  },
});