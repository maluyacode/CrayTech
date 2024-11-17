import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, IconButton, Text, useTheme } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/state/postSlice'
import { getPostsAPI } from '@/services/postService'
import Post from '@/Components/PostLists/Post'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios'
import baseURL from '@/assets/common/baseUrl'
import Loader from '@/Components/Loader'

const filter = [
    { title: 'Recommended', icon: 'ribbon' },
    { title: 'Latest', icon: 'new-box' },
    { title: 'Trending', icon: 'fire' },
];

export default function HomeScreen({ navigation }) {

    const appTheme = useTheme();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const { posts } = useSelector(state => state.post);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filterType, setFilterType] = useState({ title: 'Latest', icon: 'new-box' });
    const [loading, setLoading] = useState(false);

    const getPosts = async () => {
        setLoading(true)
        try {

            const query = `filter_type=${filterType.title}&category_filter=${JSON.stringify(selectedCategories)}`

            const data = await getPostsAPI({ token, query: query });

            data.posts = data.posts.map(post => ({
                ...post,
                post_type: post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"
            }))

            dispatch(
                setPosts(data.posts)
            );
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(JSON.stringify(err));
        }
    }

    useFocusEffect(
        useCallback(() => {
            getPosts();
        }, [filterType, selectedCategories])
    )

    const getAllCategories = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/categories`)
            setCategories(data.categories)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [])

    const onSelectCategories = async (selected) => {
        setSelectedCategories(prev => [...prev, selected])
    }

    const removeSelectedCategory = (selected) => {
        console.log(selected)
        setSelectedCategories((prev) => prev.filter((category) => category !== selected));
    }


    return (
        <>
            <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
                <View style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1 }}>
                    <Button
                        onPress={() => navigation.navigate("PostCreate")}
                        mode='contained'
                        style={{ margin: 10, }}
                        icon={'plus-circle'}
                    >
                        Post
                    </Button>
                </View>


                <View style={{ padding: 10, }}>

                    <FlatList
                        data={posts}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => (
                            <View style={{ height: 60 }}>
                                <Loader isLoading={loading} />
                                {posts.length <= 0 &&
                                    <Text style={{ textAlign: 'center' }}>No Available Posts</Text>
                                }
                            </View>
                        )}
                        ListHeaderComponent={() => (
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={{ height: 55, flexDirection: 'row', alignItems: 'flex-start', gap: 5, }}>
                                    <SelectDropdown
                                        data={filter}
                                        onSelect={(selectedItem, index) => {
                                            setFilterType(selectedItem);
                                        }}
                                        renderButton={(selectedItem, isOpened) => {
                                            return (
                                                <View style={{ width: 100 }}>
                                                    <Button
                                                        // compact
                                                        icon={filterType ? filterType.icon : 'arrow-down'}
                                                        mode='outlined'
                                                    >
                                                        {(filterType && filterType.title) || 'Filter'}
                                                    </Button>
                                                </View>
                                            );
                                        }}
                                        renderItem={(item, index, isSelected) => {
                                            return (
                                                <View style={{ padding: 10, paddingRight: 50, flexDirection: 'row', backgroundColor: appTheme.colors.background, alignItems: 'center', gap: 5, }}>
                                                    <Icon name={item.icon} size={25} color={appTheme.colors.primary} />
                                                    <Text>{item.title}</Text>
                                                </View>
                                            );
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        dropdownStyle={{ width: 'fit-content', borderRadius: 5, backgroundColor: appTheme.colors.background }}
                                    />

                                    {categories.map(category => (
                                        <Button
                                            onPress={selectedCategories.includes(category._id) ?
                                                () => removeSelectedCategory(category._id)
                                                :
                                                () => onSelectCategories(category._id)
                                            }
                                            key={category._id}
                                            mode={selectedCategories.includes(category._id) ? 'contained' : 'outlined'}
                                            icon={selectedCategories.includes(category._id) && 'check'}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                        renderItem={({ item, index }) => (
                            <>
                                {!loading &&
                                    <Post key={item._id} post={item} />
                                }
                            </>
                        )}
                    />
                </View>
            </View >
        </>

    )
}

