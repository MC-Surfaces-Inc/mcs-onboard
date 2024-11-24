import React from "react";
import { tile, yesOrNo } from "../constants/dropdownValues";
import {
  useGetClientProgramDetailsQuery,
  useUpdateProgramInfoMutation,
} from "../services/client";
import { Text, View } from "react-native";
import Button from "../components/button";
import Divider from "../components/divider";
import Loading from "../screens/loading";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import MultiLineText from "../components/multiLineText";
import Picker from "../components/picker";
import { toast } from "../components/toast";
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

  React.useEffect(() => {
    const setData = async() => {
      if (data === undefined || isLoading) {
        return <Loading />;
      } else {
        await setValue("tile", data.program);
      }
    }

    setData();
  }, [data, isLoading])

  // if (programs.Tile === 0 || programs.Tile === null || error) {
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
      type: "tile",
      body: { ...values.tile, clientId: clientId },
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
        Tile Program Details
      </Text>
      <Divider />

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Setting Material Preferences
        </Text>
        <Divider />

        <TextInput
          control={control}
          field={"tile.allottedFloat"}
          title={"Allotted Float"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.chargeForExtraFloat"}
          title={"Charge for Extra Float"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Waterproofing
        </Text>
        <Divider />

        <Picker
          choices={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethodShowerFloor"}
          title={"Waterproofing Method"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.showerFloorWaterproof}
          control={control}
          field={"tile.waterproofMethod"}
          title={"Waterproofing Method - Shower Floor"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethodShowerWalls"}
          title={"Waterproofing Method - Shower Walls"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethodTubWall"}
          title={"Waterproofing Method - Tub Wall"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.fiberglassResponsibility"}
          title={"Who Is Installing Fiberglass?"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={yesOrNo}
          control={control}
          field={"tile.backerboardInstallResponsibility"}
          title={"Who Will Be Installing Backerboard?"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.punchOutMaterial}
          control={control}
          field={"tile.punchOutMaterial"}
          title={"Punch Out Material"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Shower and Tub
        </Text>
        <Divider />

        <Picker
          choices={tile.showerNiche}
          control={control}
          field={"tile.showerNicheConstruction"}
          title={"Shower Niche Construction"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.showerNicheFraming}
          control={control}
          field={"tile.showerNicheFraming"}
          title={"Shower Niche Framing"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.showerNicheBrand"}
          title={"Preformed Shower Niche Brand"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.cornerSoapDishes}
          control={control}
          field={"tile.cornerSoapDishesStandard"}
          title={"Are Corner Soap Dishes Standard?"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.cornerSoapDishMaterial"}
          title={"Corner Soap Dish Material"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.showerSeat}
          control={control}
          field={"tile.showerSeatConstruction"}
          title={"Shower Seat Construction"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.metalEdge}
          control={control}
          field={"tile.metalEdgeOptions"}
          title={"Metal Edge Options"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Grout and Subfloor
        </Text>
        <Divider />

        <Picker
          choices={tile.groutJointSize}
          control={control}
          field={"tile.groutJointSizing"}
          title={"Grout Joint Subsizing"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.groutJointNotes"}
          title={"Grout Joint Notes"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.groutBrand}
          control={control}
          field={"tile.preferredGroutBrand"}
          title={"Preferred Grout Joint Brand"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.upgradedGrout"}
          title={"Upgraded Grout and Formula"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.groutProduct"}
          title={"Grout Product"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <Picker
          choices={tile.subfloorPractice}
          control={control}
          field={"tile.subfloorStandardPractice"}
          title={"Subfloor Std. Practice"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.subfloorProducts"}
          title={"Subfloor Products"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Specifications
        </Text>
        <Divider />

        <TextInput
          control={control}
          field={"tile.standardWallTileHeight"}
          title={"Wall Tile Height Standard"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          General
        </Text>
        <Divider />

        <Picker
          choices={tile.takeoffResp}
          control={control}
          field={"tile.takeoffResponsibility"}
          title={"Who Will Be Doing Takeoffs?"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactor"}
          title={"Waste Factor Percentage"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactorWalls"}
          title={"Waste Factor Percentage - Walls"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactorFloors"}
          title={"Waste Factor Percentage - Floors"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactorMosaics"}
          title={"Waste Factor Percentage - Mosaics"}
          // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
        />

        <View className={"pb-2"}>
          <MultiLineText
            control={control}
            field={"tile.notes"}
            title={"Notes"}
            // isDisabled={!client.permissions.pages["ProgramDetails"].edit}
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
          // className={"my-50"}
        />
      </View>
    </View>
  );
}
