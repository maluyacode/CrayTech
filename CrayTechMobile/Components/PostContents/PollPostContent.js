import { View } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Text } from 'react-native-paper';

export default function PollPostContent({ post = {} }) {

    const [options, setOptions] = useState([
        { _id: Date.now() - 1, option: 'Yes', },
        { _id: Date.now() - 2, option: 'No', },
        { _id: Date.now() - 3, option: 'Maybe' },
    ]);
    const [selected, setSelected] = useState();

    const toggleOption = (id) => {
        if (selected === id) {
            setSelected(null);
            return;
        }
        setSelected(id);
    }

    return (
        <Card.Content style={{ paddingBottom: 10, }}>

            <Text variant="titleSmall">{post.title}</Text>
            <Text variant="bodySmall">{post.body}</Text>

            <View style={{ gap: 10, marginTop: 10 }}>

                {options.map((option, index) => (
                    <Button
                        key={index}
                        mode={option._id === selected ? "contained" : 'outlined'}
                        icon={option._id === selected ? 'check' : ''}
                        style={{ borderRadius: 10 }}
                        labelStyle={{ fontSize: 12, height: 20 }}
                        contentStyle={{ height: 30 }}
                        onPress={() => {
                            toggleOption(option._id)
                        }}
                    >
                        {option.option}
                    </Button>
                ))}
            </View>

        </Card.Content>
    )
}