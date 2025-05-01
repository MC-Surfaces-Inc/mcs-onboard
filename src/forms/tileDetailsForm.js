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
import { toast } from "../components/toast";
import { useSelector } from "react-redux";
import Dropdown from "../components/dropdown";

export default function TileDetailsForm({ programs, clientId }) {
  const isLocked = useSelector(state => state.client.isLocked);
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
  }, [data, isLoading]);

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
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          field={"tile.chargeForExtraFloat"}
          title={"Charge for Extra Float"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Waterproofing
        </Text>
        <Divider />

        <Dropdown
          title={"Waterproofing Method"}
          options={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethod"}
          disabled={isLocked}
        />

        <Dropdown
          title={"Waterproofing Method - Shower Floor"}
          options={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethodShowerFloor"}
          disabled={isLocked}
        />

        <Dropdown
          title={"Waterproofing Method - Shower Walls"}
          options={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethodShowerWalls"}
          disabled={isLocked}
        />

        <Dropdown
          title={"Waterproofing Method - Tub Walls"}
          options={tile.waterproofMethod}
          control={control}
          field={"tile.waterproofMethodTubWall"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.fiberglassResponsibility"}
          title={"Who Is Installing Fiberglass?"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <Dropdown
          title={"Will MC Surfaces be installing backerboard?"}
          options={yesOrNo}
          control={control}
          field={"tile.backerboardInstallResponsibility"}
          disabled={isLocked}
        />

        <Dropdown
          title={"Punch Out Material"}
          options={tile.punchOutMaterial}
          control={control}
          field={"tile.punchOutMaterial"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Shower and Tub
        </Text>
        <Divider />

        <Dropdown
          title={"Shower Niche Construction"}
          options={tile.showerNiche}
          control={control}
          field={"tile.showerNicheConstruction"}
          disabled={isLocked}
        />

        <Dropdown
          title={"Shower Niche Framing"}
          options={tile.showerNicheFraming}
          control={control}
          field={"tile.showerNicheFraming"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.showerNicheBrand"}
          title={"Preformed Shower Niche Brand"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <Dropdown
          title={"Are corner soap dishes standard?"}
          options={tile.cornerSoapDishes}
          control={control}
          field={"tile.cornerSoapDishesStandard"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.cornerSoapDishMaterial"}
          title={"Corner Soap Dish Material"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <Dropdown
          title={"Shower Seat Construction"}
          options={tile.showerSeat}
          control={control}
          field={"tile.showerSeatConstruction"}
          disabled={isLocked}
        />

        <Dropdown
          title={"Metal Edge Options"}
          options={tile.metalEdge}
          control={control}
          field={"tile.metalEdgeOptions"}
          disabled={isLocked}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          Grout and Subfloor
        </Text>
        <Divider />

        <Dropdown
          title={"Grout Joint Subsizing"}
          options={tile.groutJointSize}
          control={control}
          field={"tile.groutJointSizing"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.groutJointNotes"}
          title={"Grout Joint Notes"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <Dropdown
          title={"Preferred Grout Joint Brand"}
          options={tile.groutBrand}
          control={control}
          field={"tile.preferredGroutBrand"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.upgradedGrout"}
          title={"Upgraded Grout and Formula"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          field={"tile.groutProduct"}
          title={"Grout Product"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <Dropdown
          title={"Subfloor Std. Practice"}
          options={tile.subfloorPractice}
          control={control}
          field={"tile.subfloorStandardPractice"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.subfloorProducts"}
          title={"Subfloor Products"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
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
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />
      </View>

      <View className={"p-2"}>
        <Text className={"font-quicksand text-lg text-gray-800"}>
          General
        </Text>
        <Divider />

        <Dropdown
          title={"Who will be doing takeoffs?"}
          options={tile.takeoffResp}
          control={control}
          field={"tile.takeoffResponsibility"}
          disabled={isLocked}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactor"}
          title={"Waste Factor Percentage"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactorWalls"}
          title={"Waste Factor Percentage - Walls"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactorFloors"}
          title={"Waste Factor Percentage - Floors"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <TextInput
          control={control}
          field={"tile.wasteFactorMosaics"}
          title={"Waste Factor Percentage - Mosaics"}
          disabled={isLocked}
          inputStyle={"bg-gray-100"}
        />

        <View className={"pb-2"}>
          <MultiLineText
            control={control}
            field={"tile.notes"}
            title={"Notes"}
            disabled={isLocked}
            inputStyle={"bg-gray-100"}
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
