import React from 'react';
import { Dimensions, LayoutRectangle, Pressable } from 'react-native';
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const screenHeight = Dimensions.get('window').height;

export const useDropdown = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [dropdownPosition, setDropdownPosition] = React.useState("bottom");
  const [buttonLayout, setButtonLayout] = React.useState(null);

  const buttonRef = React.useRef(null);
  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: dropdownOpacity.value,
  }));

  const showDropdown = React.useCallback(() => {
    dropdownHeight.value = withTiming(150, { duration: 300 });
    dropdownOpacity.value = withTiming(1, { duration: 300 });
  }, [dropdownHeight, dropdownOpacity]);

  const hideDropdown = React.useCallback(() => {
    dropdownHeight.value = withTiming(0, { duration: 200 });
    dropdownOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setIsVisible(false), 200);
  }, [dropdownHeight, dropdownOpacity]);

  const toggleDropdown = React.useCallback(() => {
    if (!isVisible && buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        const spaceBelow = screenHeight - (py + height);
        const spaceAbove = py;

        setDropdownPosition(
          spaceBelow >= 200 || spaceBelow > spaceAbove ? 'bottom' : 'top'
        );
        setButtonLayout({ x: px, y: py, width, height });
        setIsVisible(true);
        showDropdown();
      });
    } else {
      hideDropdown();
    }
  }, [isVisible, buttonRef, showDropdown, hideDropdown]);

  const handleSelect = React.useCallback(
    (option) => {
      setSelectedOption(option);
      hideDropdown();
    },
    [hideDropdown]
  );

  return {
    isVisible,
    selectedOption,
    dropdownPosition,
    buttonLayout,
    buttonRef,
    animatedStyle,
    toggleDropdown,
    handleSelect,
  };
}
