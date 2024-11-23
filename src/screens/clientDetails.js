import React from "react";
import Toolbar from "../components/toolbar";
import AccountingInfoForm from "../forms/accountingInfoForm";
import ExpeditingInfoForm from "../forms/expeditingInfoForm";
import { useGetClientDetailsQuery } from "../services/client";
import Loading from "./loading";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Divider from "../components/divider";

export default function ClientDetails({ navigation, route }) {
  const clientId = route.params?.clientId;
  const { data, error, isLoading } = useGetClientDetailsQuery(clientId);

  if (data === undefined || isLoading) {
    return <Loading navigation={navigation} />;
  }

  if (Object.keys(data).length === 0 || error) {
    return (
      <View className={"flex-1 justify-items-start pt-5"}>
        <Toolbar navigation={navigation} route={route} />
        <View className={"flex-1 p-5"}>
          <Text className={"font-quicksand text-4xl text-white ml-2 mt-3"}>
            Client Details
          </Text>

          <View className={"justify-center items-center"}>
            <Text className={"font-quicksand color-red-600"}>No data was found. This is an error.</Text>
            <Text className={"font-quicksand color-red-600"}>Please report this.</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View className={"h-full flex-row"}>
        <Toolbar navigation={navigation} route={route} />
        <ScrollView>
          <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
            Client Details
          </Text>
          <Divider />

          <AccountingInfoForm data={data.tables.accounting_details} clientId={clientId} />
          <ExpeditingInfoForm data={data.tables.expediting_details} clientId={clientId} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
