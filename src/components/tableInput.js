import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export default function TableInput({
                                control,
                                field,
                                title,
                                rules,
                                errors,
                                leftIcon,
                                rightIcon,
                                numerical,
                                disabled,
                                inputMode=null,
                                autoCapitalize,
                                secureTextEntry,
                                textContentType="none",
                                textStyle,
                                inputStyle,
                                containerStyle
                              }) {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    if (errors) {
      if (errors[field]) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [errors, field, setError]);

  return (
    <View className={`z-10 ${containerStyle}`}>
      {title &&
        <Text className={`font-quicksand mb-1 mt-2 ${textStyle} ${error && "text-red-700"}`}>{title}</Text>
      }
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onBlur, onChange, value } }) => {
          if (leftIcon) {
            return (
              <View className={`flex-row items-center border ${focused ? "border-orange-500 border-2" : "border-gray-300"} ${error && "border-red-700"} rounded-md h-10 p-2 ${inputStyle}`}>
                {leftIcon}
                <TextInput
                  className={`font-quicksand ${inputStyle} w-full h-10 p-2`}
                  onBlur={() => setFocused(false)}
                  onChangeText={onChange}
                  value={value && (numerical ? value.toString() : value)}
                  onFocus={() => setFocused(true)}
                  readOnly={disabled !== undefined && disabled}
                  inputMode={inputMode}
                  autoCapitalize={autoCapitalize}
                  secureTextEntry={secureTextEntry}
                  textContentType={textContentType}
                />
              </View>
            );
          } else if (rightIcon) {
            return (
              <View className={`flex-row items-center justify-between border ${focused ? "border-orange-500 border-2" : "border-gray-300"} ${error && "border-red-700"} rounded-md h-10 pr-2 ${inputStyle}`}>
                <TextInput
                  className={`font-quicksand ${inputStyle} h-10 w-3/4 p-2`}
                  onBlur={() => setFocused(false)}
                  onChangeText={onChange}
                  value={value && (numerical ? value.toString() : value)}
                  onFocus={() => setFocused(true)}
                  readOnly={disabled !== undefined && disabled}
                  inputMode={inputMode}
                  autoCapitalize={autoCapitalize}
                  secureTextEntry={secureTextEntry}
                  textContentType={textContentType}
                />
                {rightIcon}
              </View>
            )
          }

          return (
            <TextInput
              className={`font-quicksand rounded-md w-full border border-gray-300 h-10 p-2 ${inputStyle} ${error && "border-red-700"} text-wrap`}
              onBlur={onBlur}
              onChangeText={onChange}
              readOnly={disabled !== undefined && disabled}
              value={value && (numerical ? value.toString() : value)}
              inputMode={inputMode}
              autoCapitalize={autoCapitalize}
              secureTextEntry={secureTextEntry}
              textContentType={textContentType}
            />
          );
        }}
      />

      {error &&
        <ErrorMessage
          name={field}
          errors={errors}
          render={({message}) => (
            <Text className={"font-quicksand color-red-700 w-3/4 mt-2"}>{message}</Text>
          )}
        />
      }
    </View>
  );
}
