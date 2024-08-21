import React from "react";
import { Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

export default function Input({ control, field, title, rules, error, helperText, disabled }) {
  return (
    <View className={"my-2"}>
      {title && <Text className={"font-quicksand mb-1"}>{title}</Text>}
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onBlur, onChange, value } }) => {
          return (
            <React.Fragment>
              <TextInput
                className={"border border-gray-300 h-10 p-2 rounded-md focus:border-orange-500 font-quicksand"}
                onBlur={onBlur}
                onChangeText={onChange}
                readOnly={disabled}
                value={value}
              />
              {/*{helperText &&*/}
              {/*  <FormControl.HelperText mt={0}>*/}
              {/*    {helperText}*/}
              {/*  </FormControl.HelperText>*/}
              {/*}*/}
              {/*{error &&*/}
              {/*  <FormControl.ErrorMessage*/}
              {/*    mt={0}*/}
              {/*    leftIcon={<WarningOutlineIcon size={"xs"} />}*/}
              {/*    alignItems={"flex-end"}>*/}
              {/*    {error}*/}
              {/*  </FormControl.ErrorMessage>*/}
              {/*}*/}
            </React.Fragment>
          );
        }}
      />
    </View>
  );
}
