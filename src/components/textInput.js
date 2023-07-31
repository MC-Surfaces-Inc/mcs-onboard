import React from "react";
import { Box, FormControl, Input, WarningOutlineIcon } from "native-base";
import { Controller } from "react-hook-form";

export default function TextInput({ control, field, title, rules, error, helperText, disabled }) {
  return (
    <Box flex={1}>
      {title && <FormControl.Label>{title}</FormControl.Label>}
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onBlur, onChange, value } }) => {
          return (
            <React.Fragment>
              <Input
                invalidOutlineColor={"error.500"}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                isReadOnly={disabled}/>
              {helperText &&
                <FormControl.HelperText mt={0}>
                  {helperText}
                </FormControl.HelperText>
              }
              {error &&
                <FormControl.ErrorMessage
                  mt={0}
                  leftIcon={<WarningOutlineIcon size={"xs"} />}
                  alignItems={"flex-end"}>
                  {error}
                </FormControl.ErrorMessage>
              }
            </React.Fragment>
          );
        }}
      />
    </Box>
  );
}
