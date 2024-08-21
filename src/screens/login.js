import React from "react";
import Auth0 from "react-native-auth0";
import Button from "../components/button";
import Config from "react-native-config";
import { useDispatch, useSelector } from "react-redux";
import { saveToken, setLoading, setUser } from "../features/auth/authSlice";
import { Text, View } from "react-native";

const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID,
});

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const login = () => {
    dispatch(setLoading());

    auth0.webAuth
      .authorize({ scope: "openid profile email" }, { ephemeralSession: true })
      .then(credentials => {
        dispatch(saveToken(credentials.accessToken));
        auth0.auth
          .userInfo({ token: credentials.accessToken })
          .then(async info => {
            fetch(`https://onboard.mcsurfacesinc.com/v1/users?sub=${info.sub}`)
              .then(response => response.json())
              .then(data => dispatch(setUser(data.user)));
          });
      })
      .catch(error => console.log("Log out cancelled."));

    dispatch(setLoading());
  };

  return (
    <View className={"min-w-full min-h-full justify-center items-center bg-gray-700"}>
      <View className={"w-1/3 h-1/4 items-center justify-center rounded-lg bg-white"}>
        <Text className={"font-quicksand font-bold text-3xl m-10"}>
          OnBoard by MCS
        </Text>
        <Button
          title={"Login"}
          type={"contained"}
          size={"xl"}
          color={"action"}
          className={"bg-orange-500 w-1/2 h-10 rounded-md items-center"}
          onPress={login}
        />
      </View>
    </View>
  );
}
