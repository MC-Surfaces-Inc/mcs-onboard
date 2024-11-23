import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

export default function MultiLineText({ control, field, title, disabled, containerStyle }) {
  return (
    <View className={`my-2 z-10 ${containerStyle}`}>
      {title && <Text className={"font-quicksand mb-1"}>{title}</Text>}
      <Controller
        control={control}
        name={field}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            className={"border border-gray-300 font-quicksand h-32 p-2 rounded-md focus:border-orange-500"}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            readOnly={disabled}
            value={value}
          />
        )}
      />
    </View>
  );
}
