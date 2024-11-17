import { useColorScheme } from "react-native";
import { Button, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
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

const DesignProvider = ({ children }) => {

  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  const { theme } = useSelector(state => state.preferences);
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(setTheme(user?.profile?.preferences?.theme || 'dark'))
  }, [user])

  const paperTheme = colorScheme !== theme
    ? { ...MD3DarkTheme, colors: darkTheme }
    : { ...MD3LightTheme, colors: lightTheme };

  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  )
}