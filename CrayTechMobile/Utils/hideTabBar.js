
export default hideTabBar = (navigation, appTheme = {}) => {


    const hideTabBar = () => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    };

    const showTabBar = () => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                backgroundColor: appTheme.colors.surfaceVariant,
                display: undefined
            }
        });
    };

    // Add listeners for focus and blur events
    const focusListener = navigation.addListener('focus', hideTabBar);
    const blurListener = navigation.addListener('blur', showTabBar);

    // Cleanup listeners on component unmount
    return () => {
        focusListener();
        blurListener();
    };
}