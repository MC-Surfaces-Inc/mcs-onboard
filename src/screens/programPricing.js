import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Picker from "../components/picker";
import Toolbar from "../components/toolbar";
import Divider from "../components/divider";
import CarpetPricingForm from "../forms/carpetPricingForm";
import CabinetPricingForm from "../forms/cabinetPricingForm";
import CountertopsPricingForm from "../forms/countertopsPricingForm";
import TilePricingForm from "../forms/tilePricingForm";
import WoodPricingForm from "../forms/woodPricingForm";
import VinylPricingForm from "../forms/vinylPricingForm";
import { useSelector } from "react-redux";

export default function ProgramPricing({ navigation, route }) {
  const clientId = route.params?.clientId;
  const [form, setForm] = React.useState(null);
  const [programs, setPrograms] = React.useState([]);
  const [selectedProgram, setSelectedProgram] = React.useState(null);
  const isLocked = useSelector(state => state.client.isLocked);

  React.useEffect(() => {
    const pulledPrograms = [];
    for (const [key, value] of Object.entries(route.params.programs)) {
      if (value === 1) {
        pulledPrograms.push({ label: key, value: key });
      }
    }
    setPrograms([...pulledPrograms]);
  }, [route, setPrograms]);

  console.log(isLocked)

  return (
    <SafeAreaView>
      <View className={"flex-row h-full z-30"}>
        <Toolbar navigation={navigation} route={route} />

        <ScrollView>
          <View className={"flex-row items-center justify-between z-30 py-2"}>
            <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
              Program Pricing
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
            <CabinetPricingForm clientId={clientId} programs={programs} disabled={isLocked} />
          )}
          {selectedProgram === "Carpet" && (
            <CarpetPricingForm clientId={clientId} programs={programs} disabled={isLocked} />
          )}
          {selectedProgram === "Countertops" && (
            <CountertopsPricingForm clientId={clientId} programs={programs} disabled={isLocked} />
          )}
          {selectedProgram === "Vinyl" && (
            <VinylPricingForm clientId={clientId} programs={programs} disabled={isLocked} />
          )}
          {selectedProgram === "Tile" && (
            // <Suspense fallback={<View className={"items-center justify-center"}>Loading....</View>}>
              <TilePricingForm clientId={clientId} programs={programs} disabled={isLocked} />
            // </Suspense>
          )}
          {selectedProgram === "Wood" && (
            <WoodPricingForm clientId={clientId} programs={programs} disabled={isLocked} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
