import React, {useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { globalStyles } from '../presentational/globalStyles';
import Card from '../presentational/card'

export default function TaskDetails({ navigation }) {
    const [Title, setTitle] = useState(navigation.getParam('Title'));
    const [Description, setDescription] = useState(navigation.getParam('Description'));
    const [Category, setCategory] = useState(navigation.getParam('Category'));
    const [DateTimeFormatted, setDateTimeFormatted] = useState(navigation.getParam('DateTimeFormatted'));

    
    return (
        <View style = {globalStyles.container}>

            <Card>
                <View style = {styles.title}>
                    <Text style = {globalStyles.titleText}> 
                        { Title } 
                    </Text>
                </View>
                <View style = {styles.category}>
                <Text style = {styles.categoryText}> 
                        { Category } 
                    </Text>
                </View>
                <View style = {styles.description}>
                    <Text style = {styles.descriptionText}> 
                        { Description } 
                    </Text>
                </View>
                <View style = {styles.dateTime}>
                    <Text style = {globalStyles.titleText}> 
                        { DateTimeFormatted } 
                    </Text>
                </View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignSelf: 'center'
    },
    category: {
        paddingTop: 16,
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignSelf: 'center'
    },
    categoryText: {
        fontStyle: 'italic',
        fontSize: 16,
        color: '#333'
    },
    description: {
        paddingTop: 16,
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignSelf: 'center'
    },
    descriptionText: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
        color: '#333',
    },
    dateTime: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingTop: 16,
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    }
})