// import { StatusBar } from 'expo-status-bar';
import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { useTheme } from "react-native-paper";

var { width } = Dimensions.get("window");
const statusBarHeight = StatusBar.currentHeight || 0;

const Container = ({ children, style, ...props }) => {

  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, style, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingTop: statusBarHeight,
    flex: 1,
    justifyContent: "center",
  },
});

export default Container;
