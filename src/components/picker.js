import React from "react";
import { FlatList, Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Controller } from "react-hook-form";
import { Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Divider from "./divider";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Picker({
  choices,
  control,
  field,
  title,
  rules,
  error,
  disabled,
  textStyle,
  containerStyle,
  callbackFunction,
  inputStyle
}) {
  const [height, setHeight] = React.useState(0);
  const animatedHeight = useSharedValue(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [borderColor, setBorderColor] = React.useState("border-gray-300");

  React.useEffect(() => {
    if (isOpen) {
      setBorderColor("border-orange-500 rounded-b-none");
    } else if (!isOpen) {
      setBorderColor("border-gray-300 rounded-md");
    }
  }, [isOpen, setBorderColor, height]);

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

  const handlePress = () => {
    setIsOpen(!isOpen);
  }

  if (control === undefined || control === null) {
    return (
      <View className={`${containerStyle}`}>
        {title && <Text className={`font-quicksand ${textStyle}`}>{title}</Text>}
        <React.Fragment>
          <Pressable
            disabled={disabled}
            onPress={handlePress}
            className={`border ${borderColor} h-10 rounded-md focus:border-orange-500 focus:border-2 p-2 font-quicksand flex-row justify-between ${inputStyle}`}
          >
            <Text className={"font-quicksand"}>{!selectedValue ? "Select" : selectedValue}</Text>
            <FontAwesome5
              name={"angle-down"}
              size={20}
              color={"#9ca3af"}
            />
          </Pressable>

          <Animated.View className={"absolute top-0 right-0 left-0 flex-row max-h-80 z-50"} style={[collapsibleStyle, { overflow: "hidden" }]}>
            <View
              style={{ zIndex: 100 }}
              onLayout={onLayout}
              className={"absolute py-2 bg-gray-100 w-full rounded-b-lg border-b border-x border-gray-300 max-h-80 z-100"}
            >
              <FlatList
                style={{ zIndex: 100 }}
                data={choices}
                renderItem={({ item, index }) => (
                  <React.Fragment>
                    <TouchableOpacity
                      style={{ zIndex: 100 }}
                      className={"m-2 z-50"}
                      onPress={() => {
                        setSelectedValue(item.value);
                        if (callbackFunction) {
                          callbackFunction(item.value);
                        }
                        setBorderColor("border-gray-300")
                        setIsOpen(false);
                      }}
                      key={item.value}
                    >
                      <Text className={"font-quicksand"}>{item.label}</Text>
                    </TouchableOpacity>
                    { choices.length !== (index+1) && <Divider className={"bg-gray-300"}/> }
                  </React.Fragment>
                )}
              />
            </View>
          </Animated.View>
        </React.Fragment>
      </View>
    );
  }

  return (
    <View className={"flex-1"}>
      {title && <Text className={`font-quicksand mb-1 mt-2 ${textStyle}`}>{title}</Text>}
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onChange, value } }) => (
          <React.Fragment>
            <Pressable
              disabled={disabled}
              onPress={handlePress}
              className={`border ${borderColor} rounded-md focus:border-orange-500 p-2 font-quicksand flex-row justify-between ${inputStyle}`}
            >
              <Text className={"font-quicksand"}>
                {value !== ""
                  ?
                  value === 0
                  ?
                    "No"
                    :
                    value === 1
                    ?
                      "Yes"
                      :
                      value
                  :
                  "Select"
                }
              </Text>
              <FontAwesome5
                name={"angle-down"}
                size={20}
                color={"#9ca3af"}
              />
            </Pressable>

            <Animated.View className={"overflow-hidden top-0 left-0 right-0 bottom-0 z-50"} style={collapsibleStyle}>
              <View
                onLayout={onLayout}
                className={"bg-gray-100 rounded-b-lg border-b border-x border-orange-500 min-w-fit min-h-32"}
              >
                <ScrollView>
                  {choices.map((item, index) => (
                    <React.Fragment>
                      <TouchableOpacity
                        className={"m-2 flex-1"}
                        onPress={() => {
                          onChange(item.value);
                          setBorderColor("border-gray-300")
                          setIsOpen(false);
                        }}
                        key={item.value}
                      >
                        <Text className={"font-quicksand"}>{item.label}</Text>
                      </TouchableOpacity>
                      { choices.length !== (index+1) && <Divider className={"bg-gray-300"}/> }
                    </React.Fragment>
                  ))}
                  {/*<FlatList*/}
                  {/*  className={"flex-1"}*/}
                  {/*  data={choices}*/}
                  {/*  renderItem={({ item, index }) => (*/}
                  {/*    <React.Fragment>*/}
                  {/*      <TouchableOpacity*/}
                  {/*        className={"m-2 flex-1"}*/}
                  {/*        onPress={() => {*/}
                  {/*          onChange(item.value);*/}
                  {/*          setBorderColor("border-gray-300")*/}
                  {/*          setIsOpen(false);*/}
                  {/*        }}*/}
                  {/*        key={item.value}*/}
                  {/*      >*/}
                  {/*        <Text className={"font-quicksand"}>{item.label}</Text>*/}
                  {/*      </TouchableOpacity>*/}
                  {/*      { choices.length !== (index+1) && <Divider className={"bg-gray-300"}/> }*/}
                  {/*    </React.Fragment>*/}
                  {/*  )}*/}
                  {/*/>*/}
                </ScrollView>
              </View>
            </Animated.View>
          </React.Fragment>
        )}
      />
    </View>
  );
}
