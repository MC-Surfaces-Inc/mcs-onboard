import React from "react";
import { Text, View } from "react-native";
import { jobReleaseChoices, yesOrNo } from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import Picker from "../components/picker";
import Divider from "../components/divider";
import Button from "../components/button";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import { useUpdateDetailsMutation } from "../services/client";
import { toast } from "../components/toast";
import { useSelector } from "react-redux";

export default function ExpeditingInfoForm({ clientId, data }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, handleSubmit, errors, setValue } = useForm();
  const [updateDetails, result] = useUpdateDetailsMutation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setValue("expediting_details", data);
  }, [data, setValue]);

  const onSubmit = values => {
    setLoading(true);

    updateDetails({
      id: clientId,
      type: "expediting_details",
      body: {
        ...values.expediting_details
      },
    })
      .unwrap()
      .then(res => {
        setLoading(false);
        toast.success({
          title: "Success!",
          message: "Expediting Data Successfully Updated",
        });
      });
  };

  return (
    <View className={"flex-1 mx-2"}>
      <View className={"flex-row justify-between items-center my-2"}>
        <Text className={"font-quicksand text-3xl text-gray-800 mx-3"}>
          Expediting
        </Text>

        <Button
          title={"Save"}
          type={"contained"}
          size={"xs"}
          color={"success"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLocked}
        />
      </View>

      <Divider />

      <View className={"flex-row m-2"}>
        <View className={"flex-1 mx-1"}>
          <Picker
            choices={yesOrNo}
            control={control}
            field={"expediting_details.vendorPortal"}
            title={"Is there a vendor portal?"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.vendorPortalURL"}
            title={"Vendor Portal URL"}
            disabled={isLocked}
          />

          <Picker
            choices={yesOrNo}
            control={control}
            field={"expediting_details.portalAccountCreated"}
            title={"Has the vendor portal account been created?"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.portalUsername"}
            title={"Portal Username"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.portalPassword"}
            title={"Portal Password"}
            disabled={isLocked}
          />
        </View>

        <Divider orientation={"vertical"} />

        <View className={"flex-1 mx-1"}>
          <Picker
            choices={jobReleaseChoices}
            control={control}
            field={"expediting_details.jobReleaseMethod"}
            title={"How are jobs released?"}
            disabled={isLocked}
          />

          <Picker
            choices={yesOrNo}
            control={control}
            field={"expediting_details.poErrorHandling"}
            title={"PO Correction Handling?"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.estimatedHomes"}
            title={"Estimated Number of Homes per Year"}
            disabled={isLocked}
          />

          <Picker
            choices={yesOrNo}
            control={control}
            field={"expediting_details.inHouseProgram"}
            title={"Is the client using the In-House Program?"}
            disabled={isLocked}
          />
        </View>
      </View>

      <Divider />

      <View className={"my-2 mx-3"}>
        <MultiLineText
          control={control}
          title={"Notes"}
          field={"expediting_details.notes"}
          disabled={isLocked}
        />
      </View>
    </View>
  );
}
