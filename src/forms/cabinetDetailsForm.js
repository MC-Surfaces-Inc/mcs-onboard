import React from "react";
import { Text, View } from "react-native";
import { cabinets, yesOrNo } from "../constants/dropdownValues";
import {
  useGetClientProgramDetailsQuery,
  useUpdateProgramInfoMutation,
} from "../services/client";
import Loading from "../screens/loading";
import TextInput from "../components/input";
import { useForm } from "react-hook-form";
import MultiLineText from "../components/multiLineText";
import Picker from "../components/picker";
import Button from "../components/button";
import Divider from "../components/divider";
import { useSelector } from "react-redux";
import { toast } from "../components/toast";

export default function CabinetDetailsForm({ navigation, programs, clientId }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, errors, handleSubmit, setValue } = useForm();
  const { data, error, isLoading } = useGetClientProgramDetailsQuery({
    program: "cabinet",
    clientId: clientId,
  });
  const [updateInfo, result] = useUpdateProgramInfoMutation();
  const [loading, setLoading] = React.useState(false);
  const client = useSelector(state => state.client);

  React.useEffect(() => {
    const setData = async() => {
      if (data === undefined || isLoading) {
        return <Loading />;
      } else {
        await setValue("cabinets", data.program);
      }
    }

    setData();
  }, [data, isLoading]);

  const onSubmit = values => {
    setLoading(true);

    updateInfo({
      type: "cabinet",
      body: { ...values.cabinets, clientId: clientId },
    })
      .unwrap()
      .then(res => {
        setLoading(false);
        toast.success({
          title: "Success!",
          message: "Program Data Successfully Updated",
        });
      });
  };

  return (
    <View className={"border border-gray-500 rounded-md m-5 p-2 mb-20"}>
      <Text className={"font-quicksand text-3xl text-gray-800 mx-3"}>
        Cabinet Program Information
      </Text>
      <Divider />

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Preferences
        </Text>
        <Divider />

        <TextInput
          control={control}
          field={"cabinets.preferredColors"}
          title={"Preferred Colors"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"cabinets.preferredStyle"}
          title={"Preferred Style"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"cabinets.overlay"}
          title={"Overlay"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"cabinets.preferredCrown"}
          title={"Preferences on Crown"}
          disabled={isLocked}
        />

        <Picker
          choices={cabinets.bidTypes}
          control={control}
          field={"cabinets.bidType"}
          title={"Bid Type Preferences"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Specifications
        </Text>
        <Divider />
        <TextInput
          control={control}
          field={"cabinets.upperCabinetSpecs"}
          title={"Upper Cabinet Standard Specs."}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"cabinets.vanityHeightSpecs"}
          title={"Vanity Height Standard Specs."}
          disabled={isLocked}
        />

        <Picker
          choices={yesOrNo}
          control={control}
          field={"cabinets.softCloseStandard"}
          title={"Is Soft Close Standard?"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"cabinets.areasOptionedOut"}
          title={"Are Areas Optioned Out?"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          General
        </Text>
        <Divider />

        <View className={"mb-2"}>
          <MultiLineText
            control={control}
            field={"cabinets.notes"}
            title={"Notes"}
            disabled={isLocked}
          />
        </View>
      </View>

      <Divider />

      <View className={"items-center"}>
        <Button
          title={"Save"}
          type={"contained"}
          size={"md"}
          color={"success"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLocked}
        />
      </View>
    </View>
  );
}
