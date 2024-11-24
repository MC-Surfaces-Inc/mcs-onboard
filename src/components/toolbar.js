import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { clearToken } from "../features/auth/authSlice";
import Button from "./button";
import { useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Toolbar({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();

  console.log("route", route);

  return (
    <View className={"bg-gray-800 items-center justify-between rounded-r-md p-1 w-52"}>
      <View className={"w-full p-2"}>
        <View className={"flex-row justify-start items-center mb-8"}>
          <Image
            alt={"Logo"}
            className={"rounded-md mr-2 my-2 w-12 h-12"}
            source={require("./logo.png")}
          />
          <Text className={"font-quicksand text-white font-semibold"}>MC Surfaces, Inc.</Text>
        </View>

        { (route.name === "Home" || route.name === "ClientProfile") &&
          <TouchableOpacity onPress={() => navigation.popToTop()} className={"h-12"}>
          <View className={`flex-row items-center ${route.name === "Home" && "bg-gray-100/45 rounded-md"} px-1`}>
            <View className={"mr-5 my-2 w-8 items-center"}>
              <FontAwesome5
                name={"home"}
                size={20}
                color={"#ffffff"}
              />
            </View>
            <Text className={"font-quicksand text-white font-semibold flex-1"}>Home</Text>
          </View>
          </TouchableOpacity>
        }

        { (route.name !== "Home" && route.name !== "ClientProfile") &&
          <TouchableOpacity onPress={() => navigation.pop()} className={"h-12"}>
            <View className={`flex-row items-center ${route.name !== "Home" && "bg-gray-100/45 rounded-md"} px-1`}>
              <View className={"mr-5 my-2 w-8 items-center"}>
                <FontAwesome5
                  name={"arrow-left"}
                  size={20}
                  color={"#ffffff"}
                />
              </View>
              <Text className={"font-quicksand text-white font-semibold flex-1"}>Back</Text>
            </View>
          </TouchableOpacity>
        }

        <TouchableOpacity onPress={() => navigation.push("Help")} className={"h-12"}>
          <View className={`flex-row items-center ${route.name === "Help" && "bg-gray-100/45 rounded-md"} px-1`}>
            <View className={"mr-5 my-2 w-8 items-center"}>
              <FontAwesome5
                name={"question"}
                size={20}
                color={"#ffffff"}
              />
            </View>
            <Text className={"font-quicksand text-white font-semibold flex-1"}>Help</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className={"w-full items-start"}>
        <TouchableOpacity onPress={() => dispatch(clearToken())} className={"h-12"}>
          <View className={`flex-row items-center px-1`}>
            <View className={"mr-5 my-2 w-8 items-center"}>
              <FontAwesome5
                name={"sign-out-alt"}
                size={20}
                color={"#ef4444"}
              />
            </View>
            <Text className={"font-quicksand text-red-500 font-semibold"}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
