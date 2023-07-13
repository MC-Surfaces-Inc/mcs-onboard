import React from "react";
import { Box, FormControl, Input } from "native-base";
import { Controller } from "react-hook-form";

export default function TextInput({ control, field, title, rules, errorMessage }) {
  return (
    <Box flex={1}>
      {title && <FormControl.Label>{title}</FormControl.Label>}
      <Controller
        control={control}
        name={field}
        rules={rules}
        render={({ field: { error, onBlur, onChange, value } }) => {
          return (
            <React.Fragment>
              <Input
                onBlur={onBlur}
                value={value}
                onChangeText={text => onChange(text)}/>
              <FormControl.ErrorMessage mt={0}>{errorMessage}</FormControl.ErrorMessage>
            </React.Fragment>
          );
        }}
      />
    </Box>
  );
}
