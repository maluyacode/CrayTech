import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import 'react-native-gesture-handler';
import "react-native-safe-area-context";

import { persistor, store } from "./state/store";
import { setTheme } from "./state/preferenceSlice";
import { PersistGate } from 'redux-persist/integration/react';

import darkTheme from "./assets/darkTheme";
import lightTheme from "./assets/lightTheme";

import Main from "./Main";

const DesignProvider = ({ children }) => {

  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  const { theme } = useSelector(state => state.preferences);

  useEffect(() => {
    dispatch(setTheme('dark'))
  }, [])

  console.log(theme)

  const paperTheme =
    colorScheme !== theme
      ? { ...MD3DarkTheme, colors: darkTheme }
      : { ...MD3LightTheme, colors: lightTheme };

  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  )
}

export default function App() {

  return (
    <Provider store={store}>

      <PersistGate loading={null} persistor={persistor}>

        <DesignProvider>

          <Main />

        </DesignProvider>

      </PersistGate>

    </Provider>
  );
}
