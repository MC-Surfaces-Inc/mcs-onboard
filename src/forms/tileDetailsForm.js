import React from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  Text,
  VStack,
} from "native-base";
import { tile, yesOrNo } from "../constants/dropdownValues";
import {
  useGetClientProgramDetailsQuery,
  useUpdateProgramInfoMutation,
} from "../services/client";
import Loading from "../screens/loading";
import { useForm } from "react-hook-form";
import TextInput from "../components/textInput";
import MultiLineText from "../components/multiLineText";
import Picker from "../components/picker";
import { showNotification } from "../components/notification";
import { useSelector } from "react-redux";

export default function TileDetailsForm({ programs, clientId }) {
  const { control, errors, handleSubmit, setValue } = useForm();
  const { data, error, isLoading } = useGetClientProgramDetailsQuery({
    program: "tile",
    clientId: clientId,
  });
  const [updateInfo, result] = useUpdateProgramInfoMutation();
  const [loading, setLoading] = React.useState(false);
  const client = useSelector(state => state.client);

  console.log(programs);
  console.log(data);

  if (data === undefined || isLoading) {
    return <Loading />;
  } else {
    setValue("tile", data.program);
  }

  if (programs.Tile === 0 || programs.Tile === null || error) {
    return (
      <Center h={"100%"}>
        <Text>Program has not been included in client selections.</Text>
        <Text>If you believe this is an error, please contact Support.</Text>
      </Center>
    );
  }

  if (data === undefined || isLoading) {
    return <Loading />;
  }

  const onSubmit = values => {
    setLoading(true);

    updateInfo({
      type: "tile",
      body: { ...values.tile, clientId: clientId },
    })
      .unwrap()
      .then(res => {
        setLoading(false);
        showNotification({
          text: "Program Data Successfully Updated",
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
      mb={20}>
      <Heading p={2}>Tile Program Details</Heading>
      <Divider bg={"coolGray.400"} />

      <FormControl>
        <VStack p={4}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Setting Material Preferences
          </Text>
          <Divider bg={"coolGray.400"} my={2} />

          <TextInput
            control={control}
            field={"tile.allottedFloat"}
            title={"Allotted Float"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.chargeForExtraFloat"}
            title={"Charge for Extra Float"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />
        </VStack>

        <VStack p={4}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Waterproofing
          </Text>
          <Divider bg={"coolGray.400"} my={2} />

          <Picker
            choices={tile.waterproofMethod}
            control={control}
            field={"tile.waterproofMethodShowerFloor"}
            title={"Waterproofing Method"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.showerFloorWaterproof}
            control={control}
            field={"tile.waterproofMethod"}
            title={"Waterproofing Method - Shower Floor"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.waterproofMethod}
            control={control}
            field={"tile.waterproofMethodShowerWalls"}
            title={"Waterproofing Method - Shower Walls"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.waterproofMethod}
            control={control}
            field={"tile.waterproofMethodTubWall"}
            title={"Waterproofing Method - Tub Wall"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.fiberglassResponsibility"}
            title={"Who Is Installing Fiberglass?"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={yesOrNo}
            control={control}
            field={"tile.backerboardInstallResponsibility"}
            title={"Who Will Be Installing Backerboard?"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.punchOutMaterial}
            control={control}
            field={"tile.punchOutMaterial"}
            title={"Punch Out Material"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />
        </VStack>

        <VStack p={4}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Shower and Tub
          </Text>
          <Divider bg={"coolGray.400"} my={2} />

          <Picker
            choices={tile.showerNiche}
            control={control}
            field={"tile.showerNicheConstruction"}
            title={"Shower Niche Construction"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.showerNicheFraming}
            control={control}
            field={"tile.showerNicheFraming"}
            title={"Shower Niche Framing"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.showerNicheBrand"}
            title={"Preformed Shower Niche Brand"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.cornerSoapDishes}
            control={control}
            field={"tile.cornerSoapDishesStandard"}
            title={"Are Corner Soap Dishes Standard?"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.cornerSoapDishMaterial"}
            title={"Corner Soap Dish Material"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.showerSeat}
            control={control}
            field={"tile.showerSeatConstruction"}
            title={"Shower Seat Construction"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.metalEdge}
            control={control}
            field={"tile.metalEdgeOptions"}
            title={"Metal Edge Options"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />
        </VStack>

        <VStack p={4}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Grout and Subfloor
          </Text>
          <Divider bg={"coolGray.400"} my={2} />

          <Picker
            choices={tile.groutJointSize}
            control={control}
            field={"tile.groutJointSizing"}
            title={"Grout Joint Subsizing"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.groutJointNotes"}
            title={"Grout Joint Notes"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.groutBrand}
            control={control}
            field={"tile.preferredGroutBrand"}
            title={"Preferred Grout Joint Brand"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.upgradedGrout"}
            title={"Upgraded Grout and Formula"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.groutProduct"}
            title={"Grout Product"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <Picker
            choices={tile.subfloorPractice}
            control={control}
            field={"tile.subfloorStandardPractice"}
            title={"Subfloor Std. Practice"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.subfloorProducts"}
            title={"Subfloor Products"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />
        </VStack>

        <VStack p={4}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Specifications
          </Text>
          <Divider bg={"coolGray.400"} mb={2} />

          <TextInput
            control={control}
            field={"tile.standardWallTileHeight"}
            title={"Wall Tile Height Standard"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />
        </VStack>

        <VStack p={4}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            General
          </Text>
          <Divider bg={"coolGray.400"} mb={2} />

          <Picker
            choices={tile.takeoffResp}
            control={control}
            field={"tile.takeoffResponsibility"}
            title={"Who Will Be Doing Takeoffs?"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.wasteFactor"}
            title={"Waste Factor Percentage"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.wasteFactorWalls"}
            title={"Waste Factor Percentage - Walls"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.wasteFactorFloors"}
            title={"Waste Factor Percentage - Floors"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <TextInput
            control={control}
            field={"tile.wasteFactorMosaics"}
            title={"Waste Factor Percentage - Mosaics"}
            isDisabled={!client.permissions.pages["ProgramDetails"].edit}
          />

          <VStack mb={2}>
            <MultiLineText
              control={control}
              field={"tile.notes"}
              title={"Notes"}
              isDisabled={!client.permissions.pages["ProgramDetails"].edit}
            />
          </VStack>
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
