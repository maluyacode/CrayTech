import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Button, useTheme, Text } from "react-native-paper";

import { useNavigation } from '@react-navigation/native';

import Container from "@/Components/Container";
import Logo from "@/Components/Logo";
import TextInput from "@/Components/TextInput";
import { Formik } from "formik";
import RegisterValidation from "@/Validations/RegisterValidation";
import axios from "axios";
import baseURL from "@/assets/common/baseUrl";

export default function Register() {

  const navigation = useNavigation();
  const theme = useTheme();

  const handleSubmit = async (values, setSubmitting) => {
    try {

      const { data } = await axios.post(`${baseURL}/user/register`, values);
      setSubmitting(false);
      navigation.navigate("AvatarUsername", data.user)

    } catch (err) {
      setSubmitting(false);
      console.info(err)
    }
  }

  return (
    <Container>

      <Formik
        validationSchema={RegisterValidation}
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {({
          handleChange, handleSubmit,
          values, errors, touched, isSubmitting
        }) => (
          <View style={{ gap: 20, flex: 1, padding: 15, maxWidth: 500, marginTop: 40 }}>

            <Logo />

            <Text style={{ color: theme.colors.inversePrimary, fontWeight: 700, fontSize: 18, textAlign: 'center' }}>New? Dive in and join the fun!</Text>

            <TextInput
              name="email"
              label="Email"
              textContentType="emailAddress"
              value={values.email}
              errorText={errors.email}
              touched={touched.email}
              onChangeText={handleChange("email")}
            />

            <TextInput
              name="password"
              label="Password"
              textContentType="password"
              secureTextEntry={true}
              value={values.password}
              errorText={errors.password}
              touched={touched.password}
              onChangeText={handleChange("password")}
            />

            <View>
              <Button
                style={{ paddingVertical: 3 }}
                mode="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={handleSubmit}
              >
                Register
              </Button>

              <View style={{ flexDirection: "row" }}>

                <Text variant="bodyMedium">Already have an account? </Text>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>

                  <Text style={{ fontWeight: "900" }}>Login</Text>

                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </Formik>

    </Container>
  );
}
