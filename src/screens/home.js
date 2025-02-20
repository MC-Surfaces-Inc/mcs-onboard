import React, { useState } from "react";
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
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

//
export default function Home({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const { data = [], error, isLoading } = useGetClientsByUserQuery(user?.id);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const isOpen = useSharedValue(false);
  const width = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration: 500 })
  );

  React.useEffect(() => {
    if (data.clients) {
      setClients(data.clients);
    }
  }, [data]);

  React.useEffect(() => {
    if (searchText !== "") {
      setClients(data.clients.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      ));
    } else {
      setClients(data.clients)
    }
  }, [searchText, setClients, data]);

  const search = text => {
    setSearchText(text);
  }

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

            <View className={"flex-row items-center justify-end"}>
              <View className={"flex-row border border-gray-300 rounded-md bg-gray-100  w-1/2 mx-5 mr-2 h-10"}>
                <FontAwesome5
                  name={"search"}
                  size={20}
                  color={"#1F2937"}
                  className={"m-2"}
                />
                <TextInput
                  className={`text-gray-800 p-2 focus:border-orange-500 font-quicksand flex-1`}
                  placeholderTextColor={"#1F2937"}
                  placeholder="Client Name"
                  cursorColor={"#F97316"}
                  onChangeText={search}
                  clearButtonMode={"while-editing"}
                  // onBlur={onBlur}
                  // onChangeText={onChange}
                  // editable={disabled}
                  // value={value}
                />
              </View>
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
          </View>

          <View className={"flex-row flex-1 rounded-md bg-gray-100"}>
            <FlatList
              style={{ zIndex: 2 }}
              data={clients}
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
