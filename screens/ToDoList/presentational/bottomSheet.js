import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

export default function bottomSheet({ deleteTask }) {

    renderContent = () => (
        <View style={styles.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Configure your task</Text>
            <Text style={styles.panelSubtitle}>Select action</Text>
          </View>
          <TouchableOpacity style={styles.panelButton} >
            <Text style={styles.panelButtonTitle}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={ deleteTask }>
            <Text style={styles.panelButtonTitle}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => this.bs.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );

    const renderHeader = () => ( 
        <View style = {styles.header}>
            <View style = {styles.panelHeader}>
                <View style = {styles.panelHandle}></View>
            </View>
        </View>
    )

    bs = React.createRef();
    fall = new Animated.Value(1);

    return(
        <View>
            <BottomSheet
                ref = {this.bs}
                snapPoints = {[330,0]}
                initialSnap = {1}
                callbackNode = {this.fall}
                enabledGestureInteraction = {true}
                renderContent = {renderContent}
                renderHeader = {renderHeader}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFF',
        shadowColor: '#333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        //elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
      },
    panelHeader: {
        alignItems: 'center',
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
      },
    panelHandle: {
       width: 40,
       height: 8,
       borderRadius: 4,
       backgroundColor: '#00000040', 
       marginBottom: 10,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },
      panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
      },
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
})
