import React from "react";
import { FlatList, Modal, Pressable, ScrollView, TouchableOpacity, View } from "react-native";
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
      <View className={`relative my-2 z-100 ${containerStyle}`} style={{ zIndex: 100 }}>
        {title && <Text className={`font-quicksand mb-1 ${textStyle}`}>{title}</Text>}
        <React.Fragment>
          <Pressable
            onPress={handlePress}
            className={`border ${borderColor} h-10 rounded-md focus:border-orange-500 p-2 font-quicksand flex-row justify-between ${inputStyle}`}
          >
            <Text className={"font-quicksand"}>{!selectedValue ? "Select" : selectedValue}</Text>
            <FontAwesome5
              name={"angle-down"}
              size={20}
              color={"#9ca3af"}
            />
          </Pressable>

          <Animated.View className={"flex-row max-h-80 z-50"} style={[collapsibleStyle, { overflow: "hidden", zIndex: 100 }]}>
            <View
              style={{ zIndex: 100 }}
              onLayout={onLayout}
              className={"absolute py-2 bg-gray-100 w-full rounded-b-lg border-b border-x border-gray-300 max-h-80 z-100"}
            >
              <FlatList
                className={"z-50"}
                // overScrollMode={"always"}
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
    <View className={`relative my-2 z-100 ${containerStyle}`} style={{ zIndex: 100 }}>
        {title && <Text className={`font-quicksand mb-1 ${textStyle}`}>{title}</Text>}
        <Controller
          control={control}
          name={field}
          rules={rules || null}
          render={({ field: { onChange, value } }) => (
            <React.Fragment>
              <Pressable
                onPress={handlePress}
                className={`border ${borderColor} h-10 rounded-md focus:border-orange-500 p-2 font-quicksand flex-row justify-between ${inputStyle}`}
              >
                <Text className={"font-quicksand"}>{!value ? "Select" : value}</Text>
                <FontAwesome5
                  name={"angle-down"}
                  size={20}
                  color={"#9ca3af"}
                />
              </Pressable>
                  {/*<FlatList*/}
                  {/*  overScrollMode={"always"}*/}
                  {/*  data={choices}*/}
                  {/*  renderItem={({ item, index }) => (*/}
                  {/*    <React.Fragment>*/}
                  {/*      <TouchableOpacity*/}
                  {/*        style={{ zIndex: 100 }}*/}
                  {/*        className={"m-2 z-50 w-50"}*/}
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

              <Animated.View className={"flex-row max-h-80 z-50"} style={[collapsibleStyle, { overflow: "hidden", zIndex: 100 }]}>
                <View
                  style={{ zIndex: 100 }}
                  onLayout={onLayout}
                  className={"absolute py-2 bg-gray-100 w-full rounded-b-lg border-b border-x border-gray-300 max-h-80 z-100"}
                >
                  <FlatList
                    className={"z-50"}
                    // overScrollMode={"always"}
                    style={{ zIndex: 100 }}
                    data={choices}
                    renderItem={({ item, index }) => (
                      <React.Fragment>
                        <TouchableOpacity
                          style={{ zIndex: 100 }}
                          className={"m-2 z-50"}
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
                    )}
                  />
                </View>
              </Animated.View>
            </React.Fragment>
          )}
        />
      {/*</View>*/}
    </View>
  );
}
