import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    titleText: {
        fontFamily: 'moonglade-bold',
        fontSize: 48,
        color: 'white',
        marginTop: 150,
        alignSelf: 'center',
        textAlign: 'center',
    },
    bodyText: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
    },
    timerAlignment: {
        alignSelf: 'center',
        marginTop: 100,
        marginBottom: 30,
        backgroundColor: 'rgba(21, 25, 50, 0.9)',
        borderRadius: 300,
    },
    buttonActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    resetButton: {
        marginBottom: 50,
        padding: 8,
        borderWidth: 2,
        
        borderRadius: 10,
        marginHorizontal: 40,
        marginVertical: 40,
    },
    modalContent: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
    },
    animatedNumber: {
        fontSize: 40,
        fontFamily: 'nunito-bold',
    },
    animatedText: {
        fontSize: 20,
        fontFamily: 'nunito-bold'
    },
    
})