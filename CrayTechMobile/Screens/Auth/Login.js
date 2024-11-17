import React from "react";
import { View, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from "react-native";
import { Button, useTheme, Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";

import baseURL from "@assets/common/baseUrl";

import LoginValidation from "@Validations/LoginValidation";
import Container from "@Components/Container";
import TextInput from "@Components/TextInput";
import Logo from "@Components/Logo";
import { setAuth } from "@/state/authSlice";

const statusBarHeight = StatusBar.currentHeight || 0;

export default Login = () => {

  const theme = useTheme();
  const navigation = useNavigation()
  const dispatch = useDispatch();

  const handleSubmit = async (values, setSubmitting) => {
    try {

      const { data } = await axios.post(`${baseURL}/user/login`, values);


      dispatch(setAuth({
        user: data.user,
        token: data.token,
      }))

      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      console.info(err)
    }
  };

  return (
    <Container>
      <Formik
        validationSchema={LoginValidation}
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {({
          handleChange, handleSubmit,
          values, errors, touched, isSubmitting
        }) => (
          <View
            style={{
              gap: 20,
              flex: 1,
              padding: 15,
              maxWidth: 500,
              marginTop: 40,
            }}
          >
            <Logo />

            <Text style={{ color: theme.colors.inversePrimary, fontWeight: 700, fontSize: 18, textAlign: 'center' }}>Welcome back! Time to make waves!</Text>

            <TextInput
              onChangeText={handleChange("email")}
              name="email"
              value={values.email}
              label="Email"
              textContentType="emailAddress"
              errorText={errors.email}
              touched={touched.email}
            />

            <TextInput
              onChangeText={handleChange("password")}
              name="password"
              value={values.password}
              label="Password"
              textContentType="password"
              errorText={errors.password}
              touched={touched.password}
              secureTextEntry={true}
            />

            <View>
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ paddingVertical: 3 }}
                mode="contained"
              >
                {" "}
                Login{" "}
              </Button>

              <View style={{ flexDirection: "row" }}>

                <Text variant="bodyMedium">Already have an account? </Text>

                <TouchableOpacity onPress={() => navigation.navigate("Register")}>

                  <Text style={{ fontWeight: "900" }}>Register</Text>

                </TouchableOpacity>

              </View>

            </View>
          </View>
        )}

      </Formik>
    </Container>
  );
};