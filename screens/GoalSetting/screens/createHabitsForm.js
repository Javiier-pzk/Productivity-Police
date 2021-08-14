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
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import SwitchSelector from "react-native-switch-selector";
import { Formik } from "formik";
import * as yup from "yup";
import { Switch } from "react-native-paper";
import moment from "moment";

export default function CreateHabitsForm({
  closeModal,
  handleCreateHabit,
}) {
  const [dateTime, setDateTime] = useState(new Date());
  const [switchOn, setSwitchOn] = useState(true);
  const [cat, setCat] = useState("Day");
  const [type, setType] = useState("times");

  const validationSchema = yup.object({
    Subject: yup.string().required().min(4).max(25),
    Repetitions: yup
      .string()
      .required()
      .test(
        "is-num-1-100",
        "Repetitions must be a number 1 - 100",
        (val) => parseInt(val) >= 1 && parseInt(val) <= 100
      ),
  });

  const subjectValidator = yup.string().required().min(4).max(25);
  const repetitionsValidator = yup
    .string()
    .required()
    .test(
      "is-num-1-100",
      "Repetitions must be a number 1 - 100",
      (val) => parseInt(val) >= 1 && parseInt(val) <= 100
    );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateTime(currentDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
        <StatusBar barStyle = 'dark-content'/>
        <Formik
          initialValues={{ Subject: "", Repetitions: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleCreateHabit(
              values,
              type,
              cat,
              switchOn,
              moment(dateTime).format('MMMM Do YYYY, h:mm a'),
              moment(dateTime).format("HH:mm") //reminder
            );
          }}
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
                <Text style={styles.headerText}> New Habit </Text>
                {subjectValidator.isValidSync(props.values.Subject) &&
                repetitionsValidator.isValidSync(props.values.Repetitions) ? (
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
                <Text style = {globalStyles.bodyText}> Enter Habit </Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Eg: Drink Water"
                  onChangeText={props.handleChange("Subject")}
                  value={props.values.Subject}
                  onBlur={props.handleBlur("Subject")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.Subject && props.errors.Subject}
                </Text>

                <Text style={globalStyles.bodyText}>
                  {" "}
                  Enter Repetition Count (Eg. 4 times per day):{" "}
                </Text>

                <View>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Enter number from 1 to 100"
                    onChangeText={props.handleChange("Repetitions")}
                    value={props.values.Repetitions}
                    onBlur={props.handleBlur("Repetitions")}
                    keyboardType="number-pad"
                  />
                </View>

                <Text style={globalStyles.errorText}>
                  {props.touched.Repetitions && props.errors.Repetitions}
                </Text>

                <View>
                  <SwitchSelector
                    style={{ marginTop: 10, marginBottom: 5 }}
                    options={[
                      { label: "times", value: "times" },
                      { label: "minutes", value: "minutes" },
                      { label: "hours", value: "hours" },
                    ]}
                    initial={0}
                    hasPadding
                    onPress={(value) => setType(value)}
                    selectedColor="#fff"
                    buttonColor="#fa5d5d"
                  />

                  <Text
                    style={{ ...globalStyles.bodyText, alignSelf: "center" }}
                  >
                    {" "}
                    Per{" "}
                  </Text>

                  <SwitchSelector
                    style={{ marginTop: 5, marginBottom: 30 }}
                    options={[
                      // { label: "Minute", value: "Minute" },
                      // { label: "Hour", value: "Hour" },
                      { label: "Day", value: "Day" },
                      { label: "Week", value: "Week" },
                      { label: "Month", value: "Month" },
                    ]}
                    initial={0}
                    hasPadding
                    onPress={(value) => setCat(value)}
                    selectedColor="#fff"
                    buttonColor="#fa5d5d"
                  />
                </View>

                <View style={styles.switch}>
                  <Text style={globalStyles.bodyText}>
                    {" "}
                    Receive notifications for this habit?{" "}
                  </Text>
                  <Switch
                    value={switchOn}
                    onValueChange={() => setSwitchOn(!switchOn)}
                    color='#fa5d5d'
                  />
                </View>

                {switchOn && (
                  <View style={{ marginTop: 20 }}>
                    <Text style={globalStyles.bodyText}>
                      {" "}
                      Set a time to receive a daily reminder:{" "}
                    </Text>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={dateTime}
                      mode={"time"}
                      display="spinner"
                      is24Hour={true}
                      onChange={onChange}
                    />
                  </View>
                )}
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
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
  picker: {
    marginBottom: 9,
  },
  repetition: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor:"#999",
    borderTopWidth:0.4,
    borderBottomWidth: 0.4,
    borderBottomColor: "#999",
    paddingTop: 20,
    paddingBottom: 20

  }
});
