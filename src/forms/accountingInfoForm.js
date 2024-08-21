import React from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  HStack,
  VStack,
} from "native-base";
import {
  paymentFrequency,
  paymentType,
  yesOrNo,
} from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import Picker from "../components/picker";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import { useUpdateDetailsMutation } from "../services/client";
import { useSelector } from "react-redux";
import { toast } from "../components/toast";

export default function AccountingInfoForm({ clientId, data }) {
  const { control, handleSubmit, errors, setValue } = useForm();
  const [updateDetails, result] = useUpdateDetailsMutation();
  const [loading, setLoading] = React.useState(false);
  const client = useSelector(state => state.client);

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
    <Box
      alignItems={"center"}
      borderColor={"coolGray.600"}
      borderRadius={"md"}
      borderWidth={1}
      m={2}
      mb={50}>
      <Heading p={2}>Accounting Details</Heading>
      <Divider bg={"coolGray.400"} />

      <FormControl p={2}>
        <HStack>
          <VStack flex={1} m={2}>
            <Picker
              choices={paymentFrequency}
              control={control}
              field={"accounting_details.paymentFrequency"}
              title={"Payment Frequency"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

            <Picker
              choices={yesOrNo}
              control={control}
              field={"accounting_details.autopay"}
              title={"Autopay?"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

            <TextInput
              control={control}
              title={"Email for Submitting Invoices"}
              field={"accounting_details.invoiceEmailAddress"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

            <Picker
              control={control}
              title={"Payment Type"}
              field={"accounting_details.paymentType"}
              choices={paymentType}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

        {/*    <Picker*/}
        {/*      control={control}*/}
        {/*      title={"Payment Portal"}*/}
        {/*      field={"accounting_details.paymentPortal"}*/}
        {/*      choices={yesOrNo}*/}
        {/*    />*/}

            <TextInput
              control={control}
              title={"Payment URL"}
              field={"accounting_details.paymentURL"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />
          </VStack>

          <Divider bg={"coolGray.400"} orientation={"vertical"} />

          <VStack flex={1} m={2}>
            <Picker
              control={control}
              title={"POs Required?"}
              field={"accounting_details.poRequired"}
              choices={yesOrNo}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

            <Picker
              control={control}
              title={"POs Required for Invoices?"}
              field={"accounting_details.poInvoiceRequired"}
              choices={yesOrNo}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

            <Picker
              control={control}
              title={"Approvals Required?"}
              field={"accounting_details.approvalsRequired"}
              choices={yesOrNo}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />

            <Picker
              control={control}
              title={"Is the Contract Attached?"}
              field={"accounting_details.contractAttached"}
              choices={yesOrNo}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />
          </VStack>
        </HStack>

        <Divider bg={"coolGray.400"} />

        <HStack m={2}>
          <VStack flex={1} mx={2}>
            <TextInput
              control={control}
              title={"Contact Name"}
              field={"accounting_details.contactName"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />
          </VStack>

          <VStack flex={1} mx={2}>
            <TextInput
              control={control}
              title={"Contact Phone"}
              field={"accounting_details.contactPhone"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />
          </VStack>

          <VStack flex={1} mx={2}>
            <TextInput
              control={control}
              title={"Contact Email"}
              field={"accounting_details.contactEmail"}
              disabled={!client.permissions.pages["ClientDetails"].edit}
            />
          </VStack>
        </HStack>

        <Divider bg={"coolGray.400"} />

        <VStack m={2}>
          <MultiLineText
            control={control}
            title={"Notes"}
            field={"accounting_details.notes"}
            disabled={!client.permissions.pages["ClientDetails"].edit}
          />
        </VStack>

        <Divider bg={"coolGray.400"} />

        <Center>
          <Button
            _loading={{
              bg: "success.400",
            }}
            bg={"success.400"}
            isLoading={loading}
            isLoadingText={"Submitting"}
            m={5}
            onPress={handleSubmit(onSubmit)}
            width={"35%"}>
            Save
          </Button>
        </Center>
      </FormControl>
    </Box>
  );
}
