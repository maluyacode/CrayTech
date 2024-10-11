import { Alert, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '@/Components/Container'
import { Button, Text } from 'react-native-paper'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useNavigation } from "@react-navigation/native"

export default function Topics({ route }) {

    const navigation = useNavigation();

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

            const { data } = await axios.put(
                `${baseURL}/user/update/profile/${route.params._id}`, { topics: selectedCategories },
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            console.log(data)

            navigation.navigate("Login");

        } catch (err) {
            alert("Error occured");
            console.log(err)
        }
    }

    return (
        <Container>
            <Text variant="titleMedium" style={{ textAlign: "center", marginTop: 10 }}>Select the topics you are interested</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1, padding: 10, gap: 10, rowGap: 20, paddingTop: 20 }}>
                {categories?.map(category => {
                    return (
                        <Button
                            key={category._id}
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
                    )
                })}
            </View>
            <View style={{ flex: 1, gap: 10, justifyContent: "flex-end", padding: 10, }}>
                <Button loading={isSubmitting} disabled={isSubmitting} mode='outlined' onPress={() => alert("Home")}>Skip</Button>
                <Button loading={isSubmitting} disabled={isSubmitting} mode='contained' onPress={submit}>Next</Button>
            </View>
        </Container>
    )
}