import React from 'react';
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Animated from 'react-native-reanimated';
import { useDropdown } from "../hooks/useDropdown";
import Divider from "../components/divider";
import { Controller } from "react-hook-form";

const Dropdown = ({ title, options, control, field, rules, textStyle, containerStyle, inputStyle, disabled, callbackFunction }) => {
  const {
    isVisible,
    selectedOption,
    dropdownPosition,
    buttonLayout,
    buttonRef,
    animatedStyle,
    toggleDropdown,
    handleSelect,
  } = useDropdown();
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        const leftPosition = pageX;
        const rightPosition = pageX + width;

        setLocation({
          leftPosition,
          rightPosition,
          width,
        });
      });
    }
  }, []);

  if (!control) {
    return (
      <View className={`${containerStyle}`}>
        {title && <Text className={`font-quicksand mb-1 mt-2 ${textStyle}`}>{title}</Text>}
        <Pressable
          ref={buttonRef}
          className={`border ${isVisible ? "rounded-t-md border-orange-500" : "rounded-md border-gray-300"} bg-gray-100 p-2 font-quicksand flex-row justify-between h-10 ${inputStyle}`}
          onPress={toggleDropdown}
          disabled={disabled}
        >
          <Text className={`font-quicksand`}>{selectedOption ? selectedOption.label : "Select"}</Text>
          <FontAwesome5
            name={"angle-down"}
            size={20}
            color={"#9ca3af"}
          />
        </Pressable>

        <Modal visible={isVisible} transparent animationType={"none"} onRequestClose={toggleDropdown}>
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View className={"flex-1"} />
          </TouchableWithoutFeedback>

          {buttonLayout && (
            <Animated.View
              className={"border border-orange-500 rounded-b-md"}
              style={[
                {...styles.modalContainer, width: location.width, left: location.leftPosition },
                dropdownPosition === 'top'
                  ? { bottom: buttonLayout.y + buttonLayout.height }
                  : { top: buttonLayout.y + buttonLayout.height },
                animatedStyle,
              ]}>
              <FlatList
                data={options}
                keyExtractor={(item, index) => `${item.value}-${index}`}
                renderItem={({ item, index }) => {
                  return (
                    <React.Fragment>
                      <Pressable
                        className={"p-1 h-10"}
                        onPress={() => {
                          handleSelect(item);
                          callbackFunction(item.value);
                        }}
                      >
                        <Text className={"font-quicksand my-1"}>{item.label}</Text>
                      </Pressable>
                      {options.length !== (index + 1) && <Divider className={"bg-gray-300"} />}
                    </React.Fragment>
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          )}
        </Modal>
      </View>
    );
  }

  return (
    <View className={`${containerStyle}`}>
      {title && <Text className={`font-quicksand mb-1 mt-2 ${textStyle}`}>{title}</Text>}
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onChange, value } }) => (
          <React.Fragment>
            <Pressable
              ref={buttonRef}
              className={`border ${isVisible ? "rounded-t-md border-orange-500" : "rounded-md border-gray-300"} bg-gray-100 p-2 font-quicksand flex-row justify-between h-10 ${inputStyle}`}
              onPress={toggleDropdown}
              disabled={disabled}
            >
              <Text className={`font-quicksand`}>{options.find(option => option.value === value) ? options.find(option => option.value === value).label : "Select"}</Text>
              <FontAwesome5
                name={"angle-down"}
                size={20}
                color={"#9ca3af"}
              />
            </Pressable>

            <Modal visible={isVisible} transparent animationType={"none"} onRequestClose={toggleDropdown}>
              <TouchableWithoutFeedback onPress={toggleDropdown}>
                <View className={"flex-1"} />
              </TouchableWithoutFeedback>

              {buttonLayout && (
                <Animated.View
                  className={"border border-orange-500 rounded-b-md"}
                  style={[
                    {...styles.modalContainer, width: location.width, left: location.leftPosition },
                    dropdownPosition === 'top'
                      ? { bottom: buttonLayout.y + buttonLayout.height }
                      : { top: buttonLayout.y + buttonLayout.height },
                    animatedStyle,
                  ]}>
                  <FlatList
                    data={options}
                    keyExtractor={(item, index) => `${item.value}-${index}`}
                    renderItem={({ item, index }) => {
                      return (
                        <React.Fragment>
                          <Pressable
                            className={"p-1 h-10"}
                            onPress={() => {
                              handleSelect(item);
                              onChange(item.value);
                            }}
                          >
                            <Text className={"font-quicksand my-1"}>{item.label}</Text>
                          </Pressable>
                          {options.length !== (index + 1) && <Divider className={"bg-gray-300"} />}
                        </React.Fragment>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                  />
                </Animated.View>
              )}
            </Modal>
          </React.Fragment>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
});

export default Dropdown;