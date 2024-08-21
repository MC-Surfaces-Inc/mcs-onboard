import React from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../components/iconButton";
import Badge from "../components/badge";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useGetClientsByUserQuery } from "../services/client";
import Toolbar from "../components/toolbar";
import AddClientForm from "../forms/addClientForm";
import { useSelector } from "react-redux";
import Loading from "./loading";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const statusColors = {
  Potential: "bg-slate-600",
  Queued: "bg-yellow-500",
  Declined: "bg-red-600",
  Approved: "bg-green-500",
  Pushed: "bg-blue-950",
};

// TODO:  - create divider component (need to use in FlatList)
export default function Home({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const { data = [], error, isLoading } = useGetClientsByUserQuery(user?.id);
  const isOpen = useSharedValue(false);
  const width = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration: 500 })
  );

  if (isLoading) {
    return <Loading navigation={navigation} />;
  }

  return (
    <SafeAreaView style={{ zIndex: 5 }}>
      <View className={"flex-row h-full"}>
        <Toolbar navigation={navigation} />

        <View className={"bg-gray-800 flex-1 rounded-md p-2 mx-2"} style={{ zIndex: 5 }}>
          <View className={"flex-row items-center justify-between p-2"}>
            <Text className={"font-quicksand text-4xl text-white"}>
              Client List
            </Text>

            <IconButton
              icon={
                <FontAwesome5
                  name={"user-plus"}
                  size={20}
                  color={"#fafaf9"}
                  className={"m-2"}
                />
              }
              onPress={() => {
                isOpen.value = !isOpen.value;
              }}
            />
          </View>

          <View className={"flex-row flex-1 rounded-md bg-gray-100"}>
            <FlatList
              style={{ zIndex: 2 }}
              data={data.clients}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("ClientProfile", { clientId: item.clientId });
                  }}
                >
                  <View className={"flex-row items-center justify-between py-2 px-3 border-b border-gray-300"}>
                    <Text className={"font-quicksand text-xl"}>{item.name}</Text>

                    <View className={"flex-row justify-center items-center"}>
                      {item.territory && <Badge label={item.territory} className={"bg-gray-800"}/> }

                      {item.current && <Badge label={item.current} className={statusColors[item.current]}/> }
                      <FontAwesome5 name={"angle-right"} size={18} className={"ml-2"} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.clientId}
              flex={1}
            />

            <AddClientForm user={user} width={width} progress={progress} isOpen={isOpen} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
