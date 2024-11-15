import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSharedValue, withTiming } from "react-native-reanimated";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

/*
  USAGE: toast.info({ message: "Whoops! It looks like you don't have any network connection.", duration: 5000, title: "Network Connection"})
*/

const SHOW_TOAST_MESSAGE = "this is a test message";

export const toast = {
  info: (options) => {
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: "info" });
  },
  success: (options) => {
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: "success" });
  },
  danger: (options) => {
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: "danger" });
  }
}

export const ToastComponent = () => {
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState(null);
  const [timeOutDuration, setTimeOutDuration] = useState(5000);
  const timeOutRef = useRef(null);
  const animatedOpacity = useSharedValue(0);

  const onNewToast = (data) => {
    if (data?.duration) {
      setTimeOutDuration(data?.duration);
    }
    setMessage(data?.message);
    setMessageType(data?.type);
    setTitle(data?.title);
  };

  const closeToast = useCallback(() => {
    setMessage(null);
    setTimeOutDuration(5000);
    animatedOpacity.value = withTiming(0);
    clearInterval(timeOutRef?.current);
  }, [animatedOpacity]);

  useEffect(() => {
    if (message) {
      timeOutRef.current = setInterval(() => {
        if (timeOutDuration === 0) {
          closeToast();
        } else {
          setTimeOutDuration(prev => prev - 1000);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timeOutRef.current);
    };
  }, [closeToast, message, timeOutDuration]);

  useEffect(() => {
    if (message) {
      animatedOpacity.value = withTiming(1, {duration: 1000});
    }
  }, [message, animatedOpacity]);

  useEffect(() => {
    DeviceEventEmitter.addListener(SHOW_TOAST_MESSAGE, onNewToast);
    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <Animated.View className={"absolute z-10 rounded left-5 bottom-5 pt-3 pb-5 px-5 bg-black/20"}>
      <View className={"flex flex-row justify-center items-center"}>
        <View className={"justify-center mr-2"}>
          { messageType === "danger" &&
            <FontAwesome5
              name={"times"}
              size={20}
              color={"#dc2626"}
              className={"m-2"}
            />
          }
          { messageType === "info" &&
            <FontAwesome5
              name={"lightbulb"}
              size={20}
              color={"#f97316"}
              className={"m-2"}
            />
          }
          { messageType === "success" &&
            <FontAwesome5
              name={"check"}
              size={20}
              color={"#22c55e"}
              className={"m-2"}
            />
          }
        </View>
        <View>
          <View className={"flex-row items-center"}>
            <Text className={"font-quicksand text-lg text-gray-100"}>
              {title}
            </Text>
          </View>
          <Text className={"font-quicksand text-md text-gray-100"}>
            {message}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={closeToast}>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}