import React from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input";
import Button from "../components/button";
import { useCreateContactMutation } from "../services/client";
import { toast } from "../components/toast";
import { View } from "react-native";
import { ErrorMessage } from "@hookform/error-message";

export default function AddContactForm({ clientId }) {
  const { control, errors, handleSubmit, reset } = useForm();
  const [createContact, { isLoading, isUpdating }] = useCreateContactMutation();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = values => {
    console.log(values);
    setLoading(true);
    createContact({
      id: clientId,
      body: {
        ...values,
        clientId: clientId,
      },
    })
      .unwrap()
      .then(res => {
        setLoading(false);
        toast.success({
          title: "Success!",
          message: "Contact Successfully Added",
        });
        reset({
          name: "",
          title: "",
          phone: "",
          email: "",
        });
      });
  };

  return (
    <View>
      <View className={"flex-row flex-1 gap-1 pr-3 z-10"}>
        <Input
          control={control}
          field={"name"}
          title={"Name"}
          rules={{
            required: "Required Field"
          }}
          errorMessage={<ErrorMessage errors={errors} name={"name"} />}
          textStyle={"color-white"}
          inputStyle={"bg-gray-100"}
          containerStyle={"w-1/4"}
        />
        <Input
          control={control}
          field={"title"}
          title={"Title"}
          rules={{
            required: "Required Field"
          }}
          textStyle={"color-white"}
          inputStyle={"bg-gray-100"}
          containerStyle={"w-1/4"}
        />
        <Input
          control={control}
          field={"phone"}
          title={"Phone"}
          textStyle={"color-white"}
          inputStyle={"bg-gray-100"}
          containerStyle={"w-1/4"}
        />
        <Input
          control={control}
          field={"email"}
          title={"Email"}
          textStyle={"color-white"}
          inputStyle={"bg-gray-100"}
          containerStyle={"w-1/4"}
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
          size={"xs"}
          color={"success"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
