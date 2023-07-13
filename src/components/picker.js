import React from "react";
import { Box, FormControl, Select } from "native-base";
import { Controller } from "react-hook-form";

export default function Picker({ choices, control, field, title, rules, errorMessage }) {
  return (
    <Box flex={1} mt={-2}>
      <FormControl.Label mt={2}>{title}</FormControl.Label>
      <Controller
        control={control}
        name={field}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <Select
            onValueChange={itemValue => onChange(itemValue)}
            placeholder={"Select"}
            selectedValue={value}>
            {choices.map(choice => (
              <Select.Item
                key={choice}
                label={choice.label}
                value={choice.value}
              />
            ))}
          </Select>
        )}
      />
      <FormControl.ErrorMessage mt={0}>{errorMessage}</FormControl.ErrorMessage>
    </Box>
  );
}
