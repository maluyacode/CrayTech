import { Alert, ScrollView, View } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import Container from '@/Components/Container'
import { Button, Text, useTheme } from 'react-native-paper'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useNavigation } from "@react-navigation/native"
import hideTabBar from '@/Utils/hideTabBar';

export default function SelectTopics({ route, navigation }) {

    const appTheme = useTheme();
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const communityStyleData = route.params;

    const getAllCategories = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/categories`)
            setCategories(data.categories)

        } catch (err) {
            Alert.alert("Error fetching categories");
            console.log(err);

        }
    }

    useEffect(() => {
        getAllCategories();
    }, [])


    const addSelected = (id) => {
        const updatedCategories = [...selectedCategories, id];
        setSelectedCategories(updatedCategories);
    };

    const removeSelected = (id) => {
        const updatedCategories = selectedCategories.filter(categoryId => categoryId !== id);
        setSelectedCategories(updatedCategories);
    };

    const submit = async () => {
        try {

            navigation.navigate("CommunityType", {
                ...communityStyleData,
                topics: selectedCategories,
            })

        } catch (err) {
            alert("Error occured");
            console.log(err)
        }
    }

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>

                <Button mode='outlined' labelStyle={{ fontSize: 12, }}
                    onPress={() => navigation.goBack()}
                >Back
                </Button>
                <Text variant='labelLarge' style={{ alignSelf: 'center' }}>3/4</Text>
                <Button mode='outlined' labelStyle={{ fontSize: 12, }}
                    onPress={submit}
                >Next
                </Button>

            </View>

            <View style={{ padding: 15, }}>
                <Text variant='titleLarge' style={{ fontWeight: 800 }}>Community Topics</Text>
                <Text>Please select the topics that your community will focus on.</Text>
            </View>

            <ScrollView>
                <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1, padding: 10, gap: 10, rowGap: 20, paddingTop: 10 }}>
                    {categories?.map(category => {
                        return (
                            <Fragment key={category._id}>
                                <Button
                                    compact={true}
                                    style={{ padding: -1 }}
                                    mode={selectedCategories.find(id => id === category._id) ? 'contained-tonal' : 'elevated'}
                                    icon={selectedCategories.find(id => id === category._id) ? "check" : ""}
                                    onPress={
                                        selectedCategories.find(id => id === category._id) ?
                                            () => removeSelected(category._id)
                                            :
                                            () => addSelected(category._id)
                                    }
                                >
                                    {category.name}
                                </Button>
                            </Fragment>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}