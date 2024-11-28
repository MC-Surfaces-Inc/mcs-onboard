import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

export default function Input({
  control,
  field,
  title,
  rules,
  leftIcon,
  numerical,
  disabled,
  textStyle,
  inputStyle,
  containerStyle
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={`z-10 ${containerStyle}`}>
      {title && <Text className={`font-quicksand mb-1 mt-2 ${textStyle}`}>{title}</Text>}
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onBlur, onChange, value } }) => {
          if (leftIcon) {
            return (
              <View className={`flex-row items-center border ${focused ? "border-orange-500 border-2" : "border-gray-300"} h-10 p-2`}>
                {leftIcon}
                <TextInput
                  className={`font-quicksand  rounded-md  ${inputStyle} w-full h-10 p-2`}
                  onBlur={() => setFocused(false)}
                  onChangeText={onChange}
                  value={value && (numerical ? value.toString() : value)}
                  onFocus={() => setFocused(true)}
                  readOnly={disabled !== undefined && disabled}
                />
              </View>
            );
          }

          return (
            <React.Fragment>
              <TextInput
                className={`font-quicksand  rounded-md focus:border-orange-500 focus:border-2 w-full border border-gray-300 h-10 p-2 ${inputStyle}`}
                onBlur={onBlur}
                onChangeText={onChange}
                readOnly={disabled !== undefined && disabled}
                value={value && (numerical ? value.toString() : value)}
              />
            </React.Fragment>
          );
        }}
      />
    </View>
  );
}
