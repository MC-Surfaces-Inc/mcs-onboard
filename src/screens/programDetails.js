import React from "react";
import { Select } from "native-base";
import Toolbar from "../components/toolbar";
import CabinetDetailsForm from "../forms/cabinetDetailsForm";
import CarpetDetailsForm from "../forms/carpetDetailsForm";
import CountertopDetailsForm from "../forms/countertopDetailsForm";
import TileDetailsForm from "../forms/tileDetailsForm";
import WoodVinylDetailsForm from "../forms/woodVinylDetailsForm";
import { ScrollView, Text, View } from "react-native";

export default function ProgramDetails({ navigation, route }) {
  const clientId = route.params?.clientId;
  const [form, setForm] = React.useState(null);
  const [programs, setPrograms] = React.useState(route.params.programs);

  return (
    <View className={"flex-row h-full justify-items-start pt-5"}>
      <Toolbar navigation={navigation} route={route} />
      <ScrollView className={"p-5"}>
        <View className={"flex-row justify-between"}>
          <Text className={"font-quicksand text-4xl text-gray-800 ml-2 mt-3"}>
            Client Details
          </Text>

          <View className={"items-end mt-3 mr-3"}>
            <Select
              onValueChange={itemValue => setForm(itemValue)}
              placeholder={"Select Program"}
              selectedValue={form}
              w={250}>
              <Select.Item label={"Cabinets"} value={"Cabinets"} />
              <Select.Item label={"Carpet"} value={"Carpet"} />
              <Select.Item label={"Countertops"} value={"Countertops"} />
              <Select.Item label={"Tile"} value={"Tile"} />
              <Select.Item label={"Wood and Vinyl"} value={"Wood and Vinyl"} />
            </Select>
          </View>
        </View>

        {form === "Cabinets" && (
          <CabinetDetailsForm
            programs={programs}
            clientId={clientId}
            navigation={navigation}
          />
        )}
        {form === "Carpet" && (
          <CarpetDetailsForm
            programs={programs}
            navigation={navigation}
            clientId={clientId}
          />
        )}
        {form === "Countertops" && (
          <CountertopDetailsForm
            programs={programs}
            navigation={navigation}
            clientId={clientId}
          />
        )}
        {form === "Tile" && (
          <TileDetailsForm
            programs={programs}
            navigation={navigation}
            clientId={clientId}
          />
        )}
        {form === "Wood and Vinyl" && (
          <WoodVinylDetailsForm
            programs={programs}
            navigation={navigation}
            clientId={clientId}
          />
        )}
      </ScrollView>
    </View>
  );
}
