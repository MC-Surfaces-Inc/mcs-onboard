import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// @ts-ignore
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import Login from "./src/screens/login";
import Home from "./src/screens/home";
import ClientProfile from "./src/screens/clientProfile";
import ClientDetails from "./src/screens/clientDetails";
import ProgramDetails from "./src/screens/programDetails";
import ProgramPricing from "./src/screens/programPricing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveToken } from "./src/features/auth/authSlice";
import Help from "./src/screens/help";
import "./global.css";
import { ToastComponent } from "./src/components/toast";

// AWS Cognito Required Imports
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';
globalThis.ReadableStream = ReadableStream;

const NavStack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootStateOrAny) => state.auth);
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }

      dispatch(saveToken(userToken));
    };

    bootstrapAsync();
  }, [dispatch]);

  const linking = {
    prefixes: ["mcsurfacesinc.onboard://"]
  };

  return (
    <NavigationContainer linking={linking}>
      <ToastComponent />
      <NavStack.Navigator
        initialRouteName={"Login"}
        screenOptions={{ headerShown: false }}>
        {auth.token === null ? (
          <NavStack.Screen
            name={"Login"}
            component={Login}
            options={{
              animationTypeForReplace: auth.token === null ? "pop" : "push",
            }}
          />
        ) : (
          <>
            <NavStack.Screen name={"Home"} component={Home} />
            <NavStack.Screen name={"Help"} component={Help} />
            <NavStack.Screen name={"ClientProfile"} component={ClientProfile} />
            <NavStack.Screen name={"ClientDetails"} component={ClientDetails} />
            <NavStack.Screen
              name={"ProgramDetails"}
              component={ProgramDetails}
            />
            <NavStack.Screen
              name={"ProgramPricing"}
              component={ProgramPricing}
            />
          </>
        )}
      </NavStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
