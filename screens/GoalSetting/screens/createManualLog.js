import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import { Formik } from "formik";
import * as yup from "yup";


export default function CreateManualLog({ closeModal, addLog }) {
  const validationSchema = yup.object({
    Number: yup
      .string()
      .required('Value is a required field')
      .test(
        "is-num-1-100",
        "Value must be a number between 1 - 100",
        (val) => parseInt(val) >= 1 && parseInt(val) <= 100
      ),
  });

  const numberValidator = yup
    .string()
    .required("Value is a required field")
    .test(
      "is-num-1-100",
      "Value must be a number 1 - 100",
      (val) => parseInt(val) >= 1 && parseInt(val) <= 100
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
        <StatusBar barStyle="dark-content" />
        <Formik
          initialValues={{ Number: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => addLog(values)}
        >
          {(props) => (
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelText}> Cancel </Text>
                </TouchableOpacity>

                {numberValidator.isValidSync(props.values.Number) ? (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => props.handleSubmit()}
                  >
                    <Text style={styles.saveTextAfterValidation}> Save </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.saveText}> Save </Text>
                )}
              </View>
              <ScrollView style={styles.scrollView}>
                <View style={styles.imageView}>
                  <View style={styles.ImageBackground}>
                    <ImageBackground
                      source={require("../../../assets/police.png")}
                      style={{ height: 180, width: 180 }}
                      imageStyle={{ borderRadius: 15 }}
                    />
                  </View>
                </View>
                <Text style = {styles.logProgress}> Log Progress </Text>
                <Text style={globalStyles.bodyText}>
                  {" "}
                  Enter number of minutes or hours clocked{" "}
                </Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Number entered must be between 1-100"
                  onChangeText={props.handleChange("Number")}
                  value={props.values.Number}
                  keyboardType="number-pad"
                  onBlur={props.handleBlur("Number")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.Number && props.errors.Number}
                </Text>
              </ScrollView>
            </SafeAreaView>
          )}
        </Formik>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 35,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  cancelButton: {
    position: "absolute",
    left: 0,
  },
  cancelText: {
    fontSize: 18,
    color: "crimson",
  },
  saveButton: {
    position: "absolute",
    right: 0,
  },
  saveText: {
    fontSize: 18,
    color: "crimson",
    opacity: 0.6,
    position: "absolute",
    right: 0,
  },
  saveTextAfterValidation: {
    fontSize: 18,
    color: "crimson",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  imageView: {
    marginTop: 30,
    alignItems:'center',
    marginBottom: 35
  },
  ImageBackground: {
    height:100,
    width: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logProgress: {
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 30
  }
});
