import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleText: {
        fontFamily: 'nunito-bold',
        fontSize: 18,
        color: '#333'
    },
    bodyText: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 16,
        borderRadius: 6,
    },
    errorText: {
        color: 'crimson',
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 6,
        textAlign: 'center'
    },
    animatedNumber: {
        fontSize: 40,
        fontFamily: 'nunito-bold',
    },
    animatedText: {
        fontSize: 20,
        fontFamily: 'nunito-bold'
    },
    timerAlignment: {
        alignSelf: 'center',
        marginTop: '20%',
        marginBottom: '10%',
        backgroundColor: '#151932',
        borderRadius: 300,
    },
    buttonActions: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    resetButton: {
        marginBottom: 50,
        padding: 8,
        borderWidth: 2,
        backgroundColor: '#dd4215',
        borderRadius: 10,
        marginHorizontal: 40,
        marginVertical: 40,
    },
    modalContent: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
    },
    modalToggle: {
        marginBottom: 0,
        borderColor: '#333',
        alignSelf: 'baseline',
        padding: 10,
        borderRadius: 10,
    },
    resetText: {
        color: 'black',
        fontFamily: 'nunito-bold',
        fontSize: 20,
    }
})