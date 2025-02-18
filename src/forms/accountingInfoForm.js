import React from "react";
import { Text, View } from "react-native";
import {
  paymentFrequency,
  paymentType,
  yesOrNo,
} from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import Picker from "../components/picker";
import TextInput from "../components/input";
import Divider from "../components/divider";
import MultiLineText from "../components/multiLineText";
import { useUpdateDetailsMutation } from "../services/client";
import { toast } from "../components/toast";
import Button from "../components/button";
import { useSelector } from "react-redux";

export default function AccountingInfoForm({ clientId, data }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, handleSubmit, errors, setValue } = useForm();
  const [updateDetails, result] = useUpdateDetailsMutation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setValue("accounting_details", data);
  }, [data, setValue]);

  const onSubmit = values => {
    setLoading(true);

    updateDetails({
      id: clientId,
      type: "accounting_details",
      body: {
        ...values.accounting_details,
      },
    })
      .unwrap()
      .then(res => {
        setLoading(false);
        toast.success({
          title: "Success!",
          message: "Accounting Data Successfully Updated",
        });
      });
  };

  return (
    <View className={"flex-1 mx-2"}>
      <View className={"flex-row justify-between items-center my-2"}>
        <Text className={"font-quicksand text-3xl text-gray-800 mx-3"}>
          Accounting
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
            choices={paymentFrequency}
            control={control}
            field={"accounting_details.paymentFrequency"}
            title={"Payment Frequency"}
            disabled={isLocked}
          />

          <Picker
            choices={yesOrNo}
            control={control}
            field={"accounting_details.autopay"}
            title={"Autopay?"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            title={"Email for Submitting Invoices"}
            field={"accounting_details.invoiceEmailAddress"}
            disabled={isLocked}
          />

          <Picker
            control={control}
            title={"Payment Type"}
            field={"accounting_details.paymentType"}
            choices={paymentType}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            title={"Payment URL"}
            field={"accounting_details.paymentURL"}
            disabled={isLocked}
          />
        </View>

        <Divider orientation={"vertical"} />

        <View className={"flex-1 mx-1"}>
          <Picker
            control={control}
            title={"POs Required?"}
            field={"accounting_details.poRequired"}
            choices={yesOrNo}
            disabled={isLocked}
          />

          <Picker
            control={control}
            title={"POs Required for Invoices?"}
            field={"accounting_details.poInvoiceRequired"}
            choices={yesOrNo}
            disabled={isLocked}
          />

          <Picker
            control={control}
            title={"Approvals Required?"}
            field={"accounting_details.approvalsRequired"}
            choices={yesOrNo}
            disabled={isLocked}
          />

          <Picker
            control={control}
            title={"Is the Contract Attached?"}
            field={"accounting_details.contractAttached"}
            choices={yesOrNo}
            disabled={isLocked}
          />
        </View>
      </View>

      <Divider />

      <View className={"flex-row mx-3 my-2 justify-between"}>
        <TextInput
          control={control}
          title={"Contact Name"}
          field={"accounting_details.contactName"}
          containerStyle={"flex-1 mr-1"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          title={"Contact Phone"}
          field={"accounting_details.contactPhone"}
          containerStyle={"flex-1"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          title={"Contact Email"}
          field={"accounting_details.contactEmail"}
          containerStyle={"flex-1 ml-1"}
          disabled={isLocked}
        />
      </View>

      <Divider />

      <View className={"my-2 mx-3"}>
        <MultiLineText
          control={control}
          title={"Notes"}
          field={"accounting_details.notes"}
          disabled={isLocked}
        />
      </View>

      <Divider />
    </View>
  );
}
