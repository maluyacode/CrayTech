import React from 'react'
import { TextInput as Input, Text, useTheme } from 'react-native-paper'

export default function TextInput({
    style, errorText, touched, ...props
}) {

    const theme = useTheme();

    return (
        <>
            <Input
                style={style}
                {...props}
                dense={30}
            />
            {(errorText && touched) ?
                <Text
                    style={{ marginTop: -20, color: theme.colors.error }} variant="bodySmall"
                >{errorText}
                </Text> : null
            }
        </>
    )
}