import React from "react";
import { useUpdateProgramsMutation } from "../services/client";
import { useForm } from "react-hook-form";
import Picker from "../components/picker";
import { programs } from "../constants/dropdownValues";
import { toast } from "../components/toast";
import { View } from "react-native";
import Button from "../components/button";
import { ErrorMessage } from "@hookform/error-message";

export default function AddProgramForm({ clientId, selections }) {
  const { control, errors, handleSubmit, reset } = useForm();
  const [updatePrograms, result] = useUpdateProgramsMutation();
  const [loading, setLoading] = React.useState(false);
  const [choices, setChoices] = React.useState([]);

  React.useEffect(() => {
    let currentData = selections.map(program => program.selection);
    setChoices(programs.filter(type => !currentData.includes(type.value)));
  }, [selections]);

  const onSubmit = values => {
    setLoading(true);
    let value = {
      clientId: clientId,
    };
    value[values.program.toLowerCase()] = 1;

    updatePrograms({
      id: clientId,
      body: { ...value },
    })
      .unwrap()
      .then(res => {
        setLoading(false);
        toast.success({
          title: "Success!",
          message: "Program Successfully Added",
        });
        reset({
          program: "",
        });
      });
  };

  return (
    <View>
      <View className={"flex-row flex-1 gap-1 z-10"}>
        <Picker
          choices={choices}
          control={control}
          field={"program"}
          title={"Programs"}
          textStyle={"color-white"}
          containerStyle={"w-full"}
          inputStyle={"bg-gray-100"}
        />
      </View>

      <View className={"flex-row justify-end gap-2"}>
        {/*<Button*/}
        {/*  title={"Cancel"}*/}
        {/*  type={"outlined"}*/}
        {/*  size={"xs"}*/}
        {/*  color={"error"}*/}
        {/*  onPress={() => {*/}
        {/*    isOpen.value = !isOpen.value;*/}
        {/*    reset();*/}
        {/*  }}*/}
        {/*/>*/}
        <Button
          title={"Save"}
          type={"contained"}
          size={"md"}
          color={"success"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
