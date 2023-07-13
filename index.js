/**
 * @format
 */

import React from "react";
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { HoldMenuProvider } from "react-native-hold-menu";

const AppComp = () => (
  <Provider store={store}>
    {/*<HoldMenuProvider safeAreaInsets={}>*/}
      <App />
    {/*</HoldMenuProvider>*/}
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppComp);
