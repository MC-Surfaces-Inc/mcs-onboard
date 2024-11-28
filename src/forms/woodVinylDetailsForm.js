import React from "react";
import { Text, View } from "react-native";
import { wood, yesOrNo } from "../constants/dropdownValues";
import { useGetClientProgramDetailsQuery, useUpdateProgramInfoMutation } from "../services/client";
import Loading from "../screens/loading";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import Picker from "../components/picker";
import Button from "../components/button";
import Divider from "../components/divider";
import { toast } from "../components/toast";
import { useSelector } from "react-redux";

export default function WoodVinylDetailsForm({ navigation, programs, clientId }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, errors, handleSubmit, setValue } = useForm();
  const { data, error, isLoading } = useGetClientProgramDetailsQuery({
    program: "wood_vinyl",
    clientId: clientId,
  });
  const [updateInfo, result] = useUpdateProgramInfoMutation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const setData = async() => {
      if (data === undefined || isLoading) {
        return <Loading />;
      } else {
        await setValue("wood_vinyl", data.program);
      }
    }

    setData();
  }, [data, isLoading]);

  const onSubmit = values => {
    setLoading(true);

    updateInfo({
      type: "wood_vinyl",
      body: { ...values.wood_vinyl, clientId: clientId },
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
        Wood and Vinyl Program Details
      </Text>
      <Divider />

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Preferences
        </Text>
        <Divider />

        <Picker
          choices={wood.glueProducts}
          control={control}
          field={"wood_vinyl.preferredGlueProducts"}
          title={"Preferred Glue Products"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"wood_vinyl.otherGlueProducts"}
          title={"Other Glue Product"}
          disabled={isLocked}
        />

        <Picker
          choices={wood.stainOrPrimed}
          control={control}
          field={"wood_vinyl.stainedOrPrimed"}
          title={"Stained or Primed?"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Specifications
        </Text>
        <Divider />

        <Picker
          choices={yesOrNo}
          control={control}
          field={"wood_vinyl.transitionStripsStandard"}
          title={"Are Transition Strips Standard?"}
          disabled={isLocked}
        />

        <Picker
          choices={yesOrNo}
          control={control}
          field={"wood_vinyl.MCInstalledTrim"}
          title={"MC Surfaces Install Wood Trim?"}
          disabled={isLocked}
        />

        <Picker
          choices={wood.subfloorConstruction}
          control={control}
          field={"wood_vinyl.secondFloorConstruction"}
          title={"2nd Story Subfloor Construction"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          General
        </Text>
        <Divider />

        <Picker
          choices={wood.takeoffResp}
          control={control}
          field={"wood_vinyl.takeoffResponsibility"}
          title={"Who Will Be Doing Takeoffs?"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"wood_vinyl.wasteFactor"}
          title={"Waste Factor Percentage"}
          disabled={isLocked}
        />

        <View className={"pb-2"}>
          <MultiLineText
            control={control}
            field={"wood_vinyl.notes"}
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
