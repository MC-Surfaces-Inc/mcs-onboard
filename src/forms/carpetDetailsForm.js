import React from "react";
import { Text, View } from "react-native";
import { carpet } from "../constants/dropdownValues";
import { useGetClientProgramDetailsQuery, useUpdateProgramInfoMutation } from "../services/client";
import Loading from "../screens/loading";
import { useForm } from "react-hook-form";
import Picker from "../components/picker";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import Button from "../components/button";
import Divider from "../components/divider";
import { toast } from "../components/toast";
import { useSelector } from "react-redux";

export default function CarpetDetailsForm({ programs, clientId }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, errors, handleSubmit, setValue } = useForm();
  const { data, error, isLoading } = useGetClientProgramDetailsQuery({
    program: "carpet",
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
        await setValue("carpet", data.program);
      }
    }

    setData();
  }, [data, isLoading])

  // if (programs.Carpet === 0 || programs.Carpet === null || error) {
  //   return (
  //     <Center h={"100%"}>
  //       <Text>Program has not been included in client selections.</Text>
  //       <Text>If you believe this is an error, please contact Support.</Text>
  //     </Center>
  //   );
  // }

  const onSubmit = values => {
    setLoading(true);

    updateInfo({
      type: "carpet",
      body: { ...values.carpet, clientId: clientId },
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
        Carpet Program Information
      </Text>
      <Divider />

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Preferences
        </Text>
        <Divider />

        <Picker
          choices={carpet.carpetPad}
          control={control}
          field={"carpet.preferredPadding"}
          title={"Preferred Padding Brand"}
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
          field={"carpet.wasteFactor"}
          title={"Waste Percentage"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          General
        </Text>
        <Divider />

        <Picker
          choices={carpet.takeoffResp}
          control={control}
          field={"carpet.takeoffResponsibility"}
          title={"Who Will Be Doing Takeoffs?"}
          disabled={isLocked}
        />

        <View className={"pb-2"}>
          <MultiLineText
            control={control}
            field={"carpet.notes"}
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
          // className={"my-50"}
        />
      </View>
    </View>
  );
}
