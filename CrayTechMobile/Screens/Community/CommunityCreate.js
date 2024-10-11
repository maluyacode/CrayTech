import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native'
import React from 'react'
import { useTheme, Text, Button } from 'react-native-paper'
import TextInput from '@/Components/TextInput';
import { Formik } from 'formik';
import * as Yup from "yup";
import hideTabBar from '@/Utils/hideTabBar';

export default function CommunityCreate() {

    const navigation = useNavigation();
    const appTheme = useTheme();
    const ValidationSchema = Yup.object().shape({

        name: Yup.string().required("Name field is required.")
            .min(10, "Name should be atleast 10 characters.")
            .max(25, "Name should not be greater than 25 characters."),

        description: Yup.string().required("Description field is required")
            .min(10, "Description should be atleast 10 characters.")
            .max(255, "Description should not be greater than 25 characters."),

    });

    const submit = async (values, setSubmitting) => {
        try {

            setSubmitting(false);

            navigation.navigate("CommunityStyle", values);

        } catch (err) {
            setSubmitting(false);
            console.info(err)
        }
    }

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <Formik
                validationSchema={ValidationSchema}
                initialValues={{ name: "", description: "" }}
                onSubmit={(values, { setSubmitting }) =>
                    submit(values, setSubmitting)
                }
            >
                {({
                    handleChange, handleSubmit,
                    values, errors, touched, isSubmitting
                }) => (
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                            <Button onPress={() => navigation.goBack()} mode='outlined' labelStyle={{ fontSize: 12, }}>Back</Button>
                            <Text variant='labelLarge' style={{ alignSelf: 'center' }}>1/4</Text>
                            <Button onPress={handleSubmit} mode='outlined' labelStyle={{ fontSize: 12, }}>Next</Button>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 10, gap: 20 }}>
                            <Text variant='headlineSmall' style={{ marginTop: 10 }}>Let other people know your Community</Text>
                            <TextInput
                                name="name"
                                label="Name"
                                textContentType="name"
                                placeholder="Provide a clear name."
                                onChangeText={handleChange("name")}
                                value={values.name}
                                errorText={errors.name}
                                touched={touched.name}
                            />

                            <TextInput
                                name="description"
                                label="Description"
                                textContentType="organizationName"
                                placeholder="Describe your community of what it's all about."
                                multiline={true}
                                numberOfLines={10}
                                contentStyle={{ paddingTop: 25 }}
                                onChangeText={handleChange("description")}
                                value={values.description}
                                errorText={errors.description}
                                touched={touched.description}
                            />
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}