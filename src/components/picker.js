import React from "react";
import { Box, FormControl, Select, WarningOutlineIcon } from "native-base";
import { Controller } from "react-hook-form";

export default function Picker({ choices, control, field, title, rules, error, disabled }) {
  return (
    <Box flex={1} mt={-2}>
      <FormControl.Label mt={2}>{title}</FormControl.Label>
      <Controller
        control={control}
        name={field}
        rules={rules || null}
        render={({ field: { onChange, value } }) => (
          <React.Fragment>
            <Select
              onValueChange={itemValue => onChange(itemValue)}
              placeholder={"Select"}
              selectedValue={value}
              isDisabled={disabled}>
              {choices.map(choice => (
                <Select.Item
                  key={choice}
                  label={choice.label}
                  value={choice.value}
                />
              ))}
            </Select>
            {error &&
              <FormControl.ErrorMessage
                mt={0}
                leftIcon={<WarningOutlineIcon size={"xs"} />}
                alignItems={"flex-end"}>
                {error}
              </FormControl.ErrorMessage>
            }
          </React.Fragment>
        )}
      />
    </Box>
  );
}
