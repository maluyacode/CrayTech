const admin = require('./firebase')

exports.sendMessage = async ({
    body = '',
    title = '',
    subtitle = '',
    tokens = ['trynotify'],
    user,
}) => {
    // Fetch the tokens from an external datastore (e.g. database)
    // const tokens = await getTokensFromDatastore();

    // Send a message to devices with the registered tokens
    await admin.messaging().sendEachForMulticast({
        tokens: tokens,
        data: {
            userId: user._id.toString(),
            notifee: JSON.stringify({
                title: title,
                body: body,
                subtitle: subtitle,
                android: {
                    channelId: 'important',
                    importance: 4,
                    // actions: [
                    //     {
                    //         title: 'Mark as Read',
                    //         pressAction: {
                    //             id: 'read',
                    //         },
                    //     },
                    // ],
                },
            }),
        },
    });
}

