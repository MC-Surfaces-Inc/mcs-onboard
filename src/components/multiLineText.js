import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput } from "react-native";

export default function MultiLineText({ control, field, title, disabled }) {
  return (
    <React.Fragment>
      {title && <Text className={"font-quicksand mb-1"}>{title}</Text>}
      <Controller
        control={control}
        name={field}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            className={"border border-gray-300 h-1/2 max-h-56 p-2 rounded-md focus:border-orange-500"}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            readOnly={disabled}
            value={value}
          />
        )}
      />
    </React.Fragment>
  );
}
