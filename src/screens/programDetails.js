import React from "react";
import Picker from "../components/picker";
import Divider from "../components/divider";
import Toolbar from "../components/toolbar";
import CabinetDetailsForm from "../forms/cabinetDetailsForm";
import CarpetDetailsForm from "../forms/carpetDetailsForm";
import CountertopDetailsForm from "../forms/countertopDetailsForm";
import TileDetailsForm from "../forms/tileDetailsForm";
import WoodVinylDetailsForm from "../forms/woodVinylDetailsForm";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Dropdown from "../components/dropdown";

export default function ProgramDetails({ navigation, route }) {
  const clientId = route.params?.clientId;
  const locked = route.params?.isLocked;
  const [programs, setPrograms] = React.useState([]);
  const [selectedProgram, setSelectedProgram] = React.useState(null);

  React.useEffect(() => {
    const pulledPrograms = [];
    for (const [key, value] of Object.entries(route.params.programs)) {
      if (value === 1) {
        if (key === "Wood" || key === "Vinyl") {
          if (!pulledPrograms.find(program => program.value === "Wood and Vinyl")) {
            pulledPrograms.push({ label: "Wood and Vinyl", value: "Wood and Vinyl" });
          }
        } else {
          pulledPrograms.push({ label: key, value: key });
        }
      }
    }
    setPrograms([...pulledPrograms]);
  }, [route, setPrograms]);

  return (
    <SafeAreaView>
      <View className={"h-full flex-row"}>
        <Toolbar navigation={navigation} route={route} />

        <ScrollView>
          <View className={"flex-row items-center justify-between py-2 z-20"}>
            <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
              Client Details
            </Text>

            <Dropdown
              options={programs}
              control={null}
              callbackFunction={setSelectedProgram}
              containerStyle={"w-1/4 mr-2"}
            />
          </View>

          <Divider />

          {selectedProgram === "Cabinets" && (
            <CabinetDetailsForm
              programs={programs}
              clientId={clientId}
              navigation={navigation}
              disabled={locked}
            />
          )}
          {selectedProgram === "Carpet" && (
            <CarpetDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
              disabled={locked}
            />
          )}
          {selectedProgram === "Countertops" && (
            <CountertopDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
              disabled={locked}
            />
          )}
          {selectedProgram === "Tile" && (
            <TileDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
              disabled={locked}
            />
          )}
          {selectedProgram === "Wood and Vinyl" && (
            <WoodVinylDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
              disabled={locked}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
