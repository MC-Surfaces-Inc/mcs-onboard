import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { states, territories } from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import {
  useUpdateClientMutation,
} from "../services/client";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { toast } from "../components/toast";
import Button from "../components/button";
import Divider from "../components/divider";
import Dropdown from "../components/dropdown";

export default function EditClientForm({ data, clientId, progress, width, isOpen }) {
  const {
    control,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: data.basicInfo.name,
      territory: data.basicInfo.territory,
    }
  });
  const [updateInfo, result] = useUpdateClientMutation();

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 2 * width.value }],
  }));

  const onSubmit = values => {
    updateInfo({
      id: clientId,
      body: {
        ...values,
      }
    })
      .unwrap()
      .then(res => {
        isOpen.value = !isOpen.value;
        toast.success({
          message: "Client Successfully Updated",
          title: "Success!",
        });
      });
  };

  return (
    <Animated.View
      className={"bg-gray-100 rounded-md border h-full border-gray-400 shadow-md"}
      onLayout={(e) => {
        width.value = e.nativeEvent.layout.width;
      }}
      style={[sheetStyles.sheet, sheetStyle]}
    >
      <ScrollView className={"pr-2"}>
        <Text className={"font-quicksand text-2xl text-gray-800 my-2"}>Edit Client</Text>
        <Divider />
        <TextInput
          control={control}
          field={"name"}
          title={"Client Name"}
        />

        <Dropdown
          title={"Territory"}
          options={territories}
          control={control}
          field={"territory"}
        />

        <View className={"flex-row justify-between mt-5"}>
          <Button
            title={"Cancel"}
            type={"outlined"}
            size={"md"}
            color={"error"}
            onPress={() => {
              isOpen.value = !isOpen.value;
            }}
          />
          <Button
            title={"Save"}
            type={"contained"}
            size={"md"}
            color={"success"}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: 5,
    paddingHorizontal: 10,
    width: 400,
    height: '100%',
    position: 'absolute',
    right: 0,
    zIndex: 3,
  },
});