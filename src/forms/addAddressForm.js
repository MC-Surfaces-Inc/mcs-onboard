import React from "react";
import { View } from "react-native";
import { states, types } from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import { useCreateAddressMutation } from "../services/client";
import { toast } from "../components/toast";
import Button from "../components/button";
import TextInput from "../components/input";
import Dropdown from "../components/dropdown";

export default function AddAddressForm({ clientId, selections }) {
  const { control, handleSubmit, reset, } = useForm({
    defaultValues: {
      type: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    }
  });
  const [createAddress, { isLoading, isUpdating }] = useCreateAddressMutation();
  const [loading, setLoading] = React.useState(false);
  const [choices, setChoices] = React.useState([]);

  React.useEffect(() => {
    let currentData = selections.map(address => address.type);
    setChoices(types.filter(type => !currentData.includes(type.value)));
  }, [selections, setChoices]);

  const onSubmit = values => {
    setLoading(true);
    createAddress({
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
          message: "Address Successfully Added",
        });
        reset({
          type: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
        })
      });
  };

  return (
    <View>
      <View className={"flex-row flex-1 gap-1 pr-5 z-10"}>
        <Dropdown
          title={"Type"}
          options={choices}
          control={control}
          field={"type"}
          textStyle={"color-white"}
          containerStyle={"w-2/12"}
        />
        <TextInput
          control={control}
          field={"address1"}
          title={"Address 1"}
          containerStyle={"w-2/12"}
          inputStyle={"bg-gray-100"}
          textStyle={"color-white"}
        />
        <TextInput
          control={control}
          field={"address2"}
          title={"Address 2"}
          containerStyle={"w-2/12"}
          inputStyle={"bg-gray-100"}
          textStyle={"color-white"}
        />
        <TextInput
          control={control}
          field={"city"}
          title={"City"}
          containerStyle={"w-2/12"}
          inputStyle={"bg-gray-100"}
          textStyle={"color-white"}
        />
        <Dropdown
          title={"State"}
          options={states}
          control={control}
          field={"state"}
          textStyle={"color-white"}
          containerStyle={"w-2/12"}
        />
        <TextInput
          control={control}
          field={"zip"}
          title={"Zip"}
          containerStyle={"w-2/12"}
          inputStyle={"bg-gray-100"}
          textStyle={"color-white"}
        />
      </View>

      <View className={"flex-row justify-end gap-2"}>
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
