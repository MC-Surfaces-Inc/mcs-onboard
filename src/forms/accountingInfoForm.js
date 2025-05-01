import React from "react";
import { Text, View } from "react-native";
import {
  paymentFrequency,
  paymentType, states,
  yesOrNo,
} from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import Divider from "../components/divider";
import MultiLineText from "../components/multiLineText";
import { useUpdateDetailsMutation } from "../services/client";
import { toast } from "../components/toast";
import Button from "../components/button";
import { useSelector } from "react-redux";
import Dropdown from "../components/dropdown";

export default function AccountingInfoForm({ clientId, data }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const { control, handleSubmit, errors, setValue } = useForm();
  const [updateDetails, result] = useUpdateDetailsMutation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setValue("accounting_details", data);
    console.log(data)
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
        console.log(res);
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
          <Dropdown
            title={"Payment Frequency"}
            options={paymentFrequency}
            control={control}
            field={"accounting_details.paymentFrequency"}
            disabled={isLocked}
          />

          <Dropdown
            title={"Autopay?"}
            options={yesOrNo}
            control={control}
            field={"accounting_details.autopay"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            title={"Email for Submitting Invoices"}
            field={"accounting_details.invoiceEmailAddress"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
            autoCapitalize={"none"}
          />

          <Dropdown
            title={"Payment Type"}
            options={paymentType}
            control={control}
            field={"accounting_details.paymentType"}
            disabled={isLocked}
          />

          <TextInput
            control={control}
            title={"Payment URL"}
            field={"accounting_details.paymentURL"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
            autoCapitalize={"none"}
          />
        </View>

        <Divider orientation={"vertical"} />

        <View className={"flex-1 mx-1"}>
          <Dropdown
            title={"POs Required?"}
            options={yesOrNo}
            control={control}
            field={"accounting_details.poRequired"}
            disabled={isLocked}
          />

          <Dropdown
            title={"POs Required for Invoices?"}
            options={yesOrNo}
            control={control}
            field={"accounting_details.poInvoiceRequired"}
            disabled={isLocked}
          />

          <Dropdown
            title={"Approvals Required?"}
            options={yesOrNo}
            control={control}
            field={"accounting_details.approvalsRequired"}
            disabled={isLocked}
          />

          <Dropdown
            title={"Is the contract attached?"}
            options={yesOrNo}
            control={control}
            field={"accounting_details.contractAttached"}
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
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          title={"Contact Phone"}
          field={"accounting_details.contactPhone"}
          containerStyle={"flex-1"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          title={"Contact Email"}
          field={"accounting_details.contactEmail"}
          containerStyle={"flex-1 ml-1"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
          autoCapitalize={"none"}
        />
      </View>

      <Divider />

      <View className={"my-2 mx-3"}>
        <MultiLineText
          control={control}
          title={"Notes"}
          field={"accounting_details.notes"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />
      </View>

      <Divider />
    </View>
  );
}
