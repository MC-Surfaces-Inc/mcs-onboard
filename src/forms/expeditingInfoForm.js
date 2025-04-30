import React from "react";
import { Text, View } from "react-native";
import { jobReleaseChoices, paymentType, yesOrNo } from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import Picker from "../components/picker";
import Divider from "../components/divider";
import Button from "../components/button";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import { useUpdateDetailsMutation } from "../services/client";
import { toast } from "../components/toast";
import { useSelector } from "react-redux";
import Dropdown from "../components/dropdown";

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
          <Dropdown
            title={"Is there a vendor portal?"}
            options={yesOrNo}
            control={control}
            field={"expediting_details.vendorPortal"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.vendorPortalURL"}
            title={"Vendor Portal URL"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
            autoCapitalize={"none"}
          />

          <Dropdown
            title={"Has the vendor portal account been created?"}
            options={yesOrNo}
            control={control}
            field={"expediting_details.portalAccountCreated"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.portalUsername"}
            title={"Portal Username"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
            autoCapitalize={"none"}
          />

          <TextInput
            control={control}
            field={"expediting_details.portalPassword"}
            title={"Portal Password"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
            autoCapitalize={"none"}
          />
        </View>

        <Divider orientation={"vertical"} />

        <View className={"flex-1 mx-1"}>
          <Dropdown
            title={"How are jobs released?"}
            options={jobReleaseChoices}
            control={control}
            field={"expediting_details.jobReleaseMethod"}
            disabled={isLocked}
          />

          <Dropdown
            title={"PO correction handling?"}
            options={yesOrNo}
            control={control}
            field={"expediting_details.poErrorHandling"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            field={"expediting_details.estimatedHomes"}
            title={"Estimated Number of Homes per Year"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
          />

          <Dropdown
            title={"Is the client using the In-House Program?"}
            options={yesOrNo}
            control={control}
            field={"expediting_details.inHouseProgram"}
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
          inputStyle={"bg-gray-100"}
        />
      </View>
    </View>
  );
}
