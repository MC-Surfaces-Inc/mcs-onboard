import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { clearToken } from "../features/auth/authSlice";
import { useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthFlowType,
  CognitoIdentityProviderClient, GlobalSignOutCommand,
  InitiateAuthCommand,
  RevokeTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

export default function Toolbar({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();

  const signOut = async() => {
    const url = `https://us-east-1wl8dvhdtk.auth.us-east-1.amazoncognito.com/logout?client_id=${Config.COGNITO_CLIENT_ID}&logout_uri=mcsurfacesinc.onboard://&redirect_uri=mcsurfacesinc.onboard://`;
    // const refreshToken = await AsyncStorage.getItem("refreshToken");
    // const command = new RevokeTokenCommand({
    //   ClientId: Config.COGNITO_CLIENT_ID,
    //   Token: refreshToken,
    // });

    // const command = new GlobalSignOutCommand({
    //   AccessToken: refreshToken,
    // });

    dispatch(clearToken());
    try {
      // const response = await cognitoClient.send(command);
      const response = await axios.get(url);
      dispatch(clearToken());

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

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
        <TouchableOpacity onPress={signOut} className={"h-12"}>
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
