import { View, Text, Image } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

export default function Logo() {
  const crayFishImage =
    "https://static.vecteezy.com/system/resources/previews/036/271/975/original/ai-generated-lobster-illustration-lobster-shrimp-cartoon-on-transparent-background-free-png.png";

  const theme = useTheme();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 30,
          letterSpacing: 3,
          fontWeight: 900,
          color: theme.colors.onSurfaceVariant,
        }}
      >
        CrayTech
      </Text>
      <Image
        source={{ uri: crayFishImage }}
        style={{ width: 150, height: 150 }}
      />
    </View>
  );
}
