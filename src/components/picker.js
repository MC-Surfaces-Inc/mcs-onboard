import React from "react";
import { FlatList, Modal, Pressable, TextInput, TouchableOpacity, View } from "react-native";
import { Controller } from "react-hook-form";
import { Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Divider from "./divider";

export default function Picker({ choices, control, field, title, rules, error, disabled }) {
  const [height, setHeight] = React.useState(0);
  const animatedHeight = useSharedValue(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");

  const onLayout = (event) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const collapsibleStyle = useAnimatedStyle(() => {
    animatedHeight.value = isOpen ? withTiming(height) : withTiming(0);

    return {
      height: animatedHeight.value,
    };
  }, [isOpen, height]);

  console.log(selected)

  return (
    <View className={"my-2"}>
      {title && <Text className={"font-quicksand mb-1"}>{title}</Text>}
      {/*<Controller*/}
      {/*  control={control}*/}
      {/*  name={field}*/}
      {/*  rules={rules || null}*/}
      {/*  render={({ field: { onChange, value } }) => (*/}
          <React.Fragment>
            <TextInput
              onBlur={() => setIsOpen(false)}
              onFocus={() => setIsOpen(true)}
              className={"border border-gray-300 h-10 rounded-md focus:border-orange-500 focus:rounded-b-none p-2 font-quicksand"}
              placeholder={"Select"}
              value={selected}
            />

            <Animated.View className={"flex-row"} style={[collapsibleStyle, { overflow: "hidden" }]}>
              <View onLayout={onLayout} className={"absolute py-2 bg-gray-100 w-full rounded-b-lg border-b border-x border-gray-300"}>
                <FlatList
                  data={choices}
                  renderItem={({ item, index }) => (
                      <Pressable className={"m-2"} onPress={() => setSelected(item.value)} key={item.value}>
                        <Text className={"font-quicksand"}>{item.label}</Text>
                      </Pressable>
                  )}
                />
              </View>
            </Animated.View>
          </React.Fragment>
        {/*)}*/}
      {/*/>*/}
    </View>
  );
}
