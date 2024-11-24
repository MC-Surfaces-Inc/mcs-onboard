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

export default function ProgramDetails({ navigation, route }) {
  const clientId = route.params?.clientId;
  const [form, setForm] = React.useState(null);
  const [programs, setPrograms] = React.useState([]);
  const [selectedProgram, setSelectedProgram] = React.useState(null);

  React.useEffect(() => {
    const pulledPrograms = [];
    for (const [key, value] of Object.entries(route.params.programs)) {
      if (value === 1) {
        if (key === "Wood" || key === "Vinyl") {
          pulledPrograms.push({ label: "Wood and Vinyl", value: "Wood and Vinyl" });
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
          <View className={"flex-row items-center justify-between"}>
            <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
              Client Details
            </Text>

            <Picker
              choices={programs}
              control={null}
              textStyle={"color-white"}
              containerStyle={"w-1/4 mr-2 justify-center"}
              inputStyle={"bg-gray-100"}
              callbackFunction={setSelectedProgram}
            />
          </View>

          <Divider />

          {selectedProgram === "Cabinets" && (
            <CabinetDetailsForm
              programs={programs}
              clientId={clientId}
              navigation={navigation}
            />
          )}
          {selectedProgram === "Carpet" && (
            <CarpetDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
            />
          )}
          {selectedProgram === "Countertops" && (
            <CountertopDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
            />
          )}
          {selectedProgram === "Tile" && (
            <TileDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
            />
          )}
          {selectedProgram === "Wood and Vinyl" && (
            <WoodVinylDetailsForm
              programs={programs}
              navigation={navigation}
              clientId={clientId}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
