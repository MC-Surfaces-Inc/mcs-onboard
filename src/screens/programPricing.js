import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Toolbar from "../components/toolbar";
import Divider from "../components/divider";
import CarpetPricingForm from "../forms/carpetPricingForm";
import CabinetPricingForm from "../forms/cabinetPricingForm";
import CountertopsPricingForm from "../forms/countertopsPricingForm";
import TilePricingForm from "../forms/tilePricingForm";
import WoodPricingForm from "../forms/woodPricingForm";
import VinylPricingForm from "../forms/vinylPricingForm";
import Dropdown from "../components/dropdown";

export default function ProgramPricing({ navigation, route }) {
  const clientId = route.params?.clientId;
  const [programs, setPrograms] = React.useState([]);
  const [selectedProgram, setSelectedProgram] = React.useState(null);

  React.useEffect(() => {
    const pulledPrograms = [];
    for (const [key, value] of Object.entries(route.params.programs)) {
      if (value === 1) {
        pulledPrograms.push({ label: key, value: key });
      }
    }
    setPrograms([...pulledPrograms]);
  }, [route, setPrograms]);

  return (
    <SafeAreaView>
      <View className={"flex-row h-full z-30"}>
        <Toolbar navigation={navigation} route={route} />

        <ScrollView>
          <View className={"flex-row items-center justify-between z-30 py-2"}>
            <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
              Program Pricing
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
            <CabinetPricingForm clientId={clientId} />
          )}
          {selectedProgram === "Carpet" && (
            <CarpetPricingForm clientId={clientId} />
          )}
          {selectedProgram === "Countertops" && (
            <CountertopsPricingForm clientId={clientId} />
          )}
          {selectedProgram === "Vinyl" && (
            <VinylPricingForm clientId={clientId} />
          )}
          {selectedProgram === "Tile" && (
            <TilePricingForm clientId={clientId} />
          )}
          {selectedProgram === "Wood" && (
            <WoodPricingForm clientId={clientId} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
