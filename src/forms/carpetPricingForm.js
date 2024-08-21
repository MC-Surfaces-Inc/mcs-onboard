import React from "react";
import { Box, Center, Fab, Icon, Text } from "native-base";
import InteractiveTable from "../components/interactiveTable";
import { useForm } from "react-hook-form";
import { levels, units } from "../constants/dropdownValues";
import {
  useGetClientProgramPricingQuery,
  useUpdateProgramPricingMutation,
} from "../services/client";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Loading from "../screens/loading";
import { toast } from "../components/toast";

export default function CarpetPricingForm({ programs, clientId }) {
  const { control, handleSubmit, errors, reset, setValue } = useForm();
  const { data=[], error, isLoading } = useGetClientProgramPricingQuery({
    program: "Carpet",
    clientId: clientId,
  });
  const [updateParts, result] = useUpdateProgramPricingMutation();

  React.useEffect(() => {
    if (data.parts) {
      reset({
        Carpet_Flooring: data.parts.filter(part => part.programTable === "Carpet Flooring"),
        Carpet_Pad: data.parts.filter(part => part.programTable === "Carpet Pad"),
        Miscellaneous: data.parts.filter(part => part.programTable === "Miscellaneous"),
      });
    }
  }, [reset, data]);

  if (programs.Carpet === 0 || programs.Carpet === null) {
    return (
      <Center h={"100%"}>
        <Text>Program has not been included in client selections.</Text>
      </Center>
    );
  }

  const onSubmit = values => {
    let pricingData = [
      ...values.Carpet_Flooring.map(row => ({
        ...row,
        programTable: "Carpet Flooring",
        program: "Carpet",
        clientId: clientId,
      })),
      ...values.Carpet_Pad.map(row => ({
        ...row,
        programTable: "Carpet Pad",
        program: "Carpet",
        clientId: clientId,
      })),
      ...values.Miscellaneous.map(row => ({
        ...row,
        programTable: "Miscellaneous",
        program: "Carpet",
        clientId: clientId,
      })),
    ];

    pricingData.forEach(row => {
      updateParts({
        body: { ...row },
      });
    });

    toast.success({
      title: "Success!",
      message: "Billing Parts Successfully Added",
    });
  };

  if (isLoading) {
    return <Loading navigation={null} />;
  }

  return (
    <Box flex={1} m={2} mb={10}>
      <InteractiveTable
        title={"Carpet Flooring"}
        components={{
          level: { header: "Level", type: "select", choices: levels },
          unit: { header: "Unit", type: "select", choices: units },
          cost: { header: "Material", type: "input", choices: null },
          costWithTax: { header: "Material w/ Tax", type: "input", choices: null },
          laborCost: { header: "Labor", type: "input", choices: null },
          totalCost: { header: "Total", type: "input", choices: null },
        }}
        control={control}
      />
      <InteractiveTable
        title={"Carpet Pad"}
        components={{
          description: { header: "Description", type: "input", choices: null },
          unit: { header: "Unit", type: "select", choices: units },
          totalCost: { header: "Total", type: "input", choices: null },
        }}
        control={control}
      />
      <InteractiveTable
        title={"Miscellaneous"}
        components={{
          description: { header: "Description", type: "input", choices: null },
          unit: { header: "Unit", type: "select", choices: units },
          totalCost: { header: "Total", type: "input", choices: null },
        }}
        control={control}
      />

      <Fab
        bg={"#4ade80"}
        shadow={2}
        size={"lg"}
        icon={<FontAwesome5 name={"save"} size={32} color={"white"}/>}
        onPress={handleSubmit(onSubmit)}
      />
    </Box>
  );
}
