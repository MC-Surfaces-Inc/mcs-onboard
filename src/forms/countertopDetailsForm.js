import React from "react";
import { Text, View } from "react-native";
import { countertops, yesOrNo } from "../constants/dropdownValues";
import Loading from "../screens/loading";
import {
  useGetClientProgramDetailsQuery,
  useUpdateProgramInfoMutation,
} from "../services/client";
import Picker from "../components/picker";
import Divider from "../components/divider";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import { toast } from "../components/toast";
import { useSelector } from "react-redux";
import Button from "../components/button";

export default function CountertopDetailsForm({ programs, clientId }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, errors, handleSubmit, setValue } = useForm();
  const { data, error, isLoading } = useGetClientProgramDetailsQuery({
    program: "countertops",
    clientId: clientId,
  });
  const [updateInfo, result] = useUpdateProgramInfoMutation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const setData = async() => {
      if (data === undefined || isLoading) {
        return <Loading />;
      } else {
        await setValue("countertops", data.program);
      }
    }

    setData();
  }, [data, isLoading]);

  const onSubmit = values => {
    setLoading(true);

    updateInfo({
      type: "countertop",
      body: { ...values.countertops, clientId: clientId },
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
        Countertop Program Information
      </Text>
      <Divider />

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Preferences
        </Text>
        <Divider />

        <Picker
          choices={countertops.materialThickness}
          control={control}
          field={"countertops.preferredMaterialThickness"}
          title={"Preferred Material Thickness"}
          disabled={isLocked}
        />

        <Picker
          choices={countertops.edges}
          control={control}
          field={"countertops.preferredEdge"}
          title={"Preferred Edge"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Specifications
        </Text>
        <Divider />

        <Picker
          choices={countertops.standardOrOption}
          control={control}
          field={"countertops.waterfallEdgeStandard"}
          title={"Waterfall Sides - Std. or Option?"}
          disabled={isLocked}
        />

        <Picker
          choices={yesOrNo}
          control={control}
          field={"countertops.faucetHoles"}
          title={"Faucet Holes?"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"countertops.stoveRangeSpecifications"}
          title={"Stove Range Specs."}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          General
        </Text>
        <Divider />

        <Picker
          choices={countertops.takeoffResp}
          control={control}
          field={"countertops.takeoffResponsibility"}
          title={"Who will be doing takeoffs?"}
          disabled={isLocked}
        />

        <View className={"pb-2"}>
          <MultiLineText
            control={control}
            field={"countertops.notes"}
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
