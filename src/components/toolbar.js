import React from "react";
import { Image, View } from "react-native";
import { useDispatch } from "react-redux";
import { clearToken } from "../features/auth/authSlice";
import Divider from "./divider";
import Button from "./button";
import { useRoute } from "@react-navigation/native";

export default function Toolbar({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();
  const [fontColor, setFontColor] = React.useState("");

  React.useEffect(() => {
    if (route.name === "Home") {
      setFontColor("text-white")
    } else if (route.name === "Help") {
      setFontColor("text-white")
    }
  }, [route.name, setFontColor]);

  return (
    <View className={"bg-gray-800 items-center justify-between rounded-r-md p-1 w-36"}>
      <View className={"w-full items-center"}>
        <Image
          alt={"Logo"}
          className={"rounded-md size-24 my-2"}
          source={require("./logo.png")}
        />

        <Divider />
        <Button
          title={"Home"}
          type={"text"}
          size={"xl"}
          color={"action"}
          className={"my-1"}
          fontClass={route.name === "Home" ? "text-white" : ""}
          disabled={route.name === "Home"}
          onPress={() => navigation.popToTop()}
        />

        <Divider />

        <Button
          title={"Help"}
          type={"text"}
          size={"xl"}
          color={"action"}
          className={"my-1"}
          fontClass={route.name === "Help" ? "text-white" : ""}
          disabled={route.name === "Help"}
          onPress={() => navigation.push("Help")}
        />
      </View>

      <View className={"w-full items-center"}>
        <Divider />
        <Button
          title={"Sign Out"}
          type={"text"}
          size={"xl"}
          color={"error"}
          className={"my-1"}
          onPress={() => dispatch(clearToken())}
        />
      </View>
    </View>
  );
}
