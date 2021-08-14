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
  Alert
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { List, Switch, IconButton } from "react-native-paper";
import { Formik } from "formik";
import * as yup from "yup";
import moment from "moment";
import {useSelector, useDispatch} from 'react-redux'
import { setCP3 } from "../../../redux/checkpoint3";
import * as Notifications from 'expo-notifications';

export default function CreateCP3Form({ navigation, route }) {
  const {cp3} = useSelector((state) => state.checkpoint3);
  console.log(cp3);
  const {GoalDateTimeFormatted, Daily, Weekly, Monthly, Misc, DateTimeFormatted} = route.params;
  const currentTime = new Date();
  const dispatch = useDispatch();
  const [dateTime, setDateTime] = useState(
    cp3 === null 
    ? new Date()
    : cp3.DateTimeFormatted !== undefined 
    ? moment(cp3.DateTimeFormatted, 'Do MMMM YYYY, h:mm a').toDate()
    : DateTimeFormatted === undefined
    ? new Date()
    : moment(DateTimeFormatted, 'Do MMMM YYYY, h:mm a').toDate()  
  );
  const [mode, setMode] = useState("date");
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const validationSchema = yup.object({
    Daily: yup
      .string()
      .required("Daily Goals is a required field")
      .min(8, "Daily Goals must be at least 8 characters"),
    Weekly: yup
      .string()
      .required("Weekly Goals is a required field")
      .min(8, "Weekly Goals must be at least 8 characters"),
    Monthly: yup.string().min(8, "Monthly Goals must be at least 8 characters"),
    Misc: yup
      .string()
      .min(8, "Miscellaneous Goals must be at least 8 characters"),
  });

  const dailyWeeklyValidator = yup.string().required().min(8);
  const monthlyMiscValidator = yup.string().min(8);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateTime(currentDate);
  };

  const showMode = (currentMode) => {
    if (currentMode === "date") {
      setShowDate(!showDate);
    } else {
      setShowTime(!showTime);
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
        <StatusBar barStyle="dark-content" />
        <Formik
          initialValues={{ 
            Daily: cp3 === null ? '' : cp3.Daily !== undefined ? cp3.Daily : Daily === undefined ? '' : Daily,
            Weekly: cp3 === null ? '': cp3.Weekly !== undefined ? cp3.Weekly : Weekly === undefined ? '' : Weekly,
            Monthly: cp3 === null ? '' : cp3.Monthly !== undefined ? cp3.Monthly : Monthly === undefined ? '' : Monthly,
            Misc: cp3 === null ? '' : cp3.Misc !== undefined ? cp3.Misc : Misc === undefined ? '' : Misc,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            if (moment(GoalDateTimeFormatted, 'Do MMMM YYYY, h:mm a').diff(moment(dateTime), 'minutes', true) <= 0) {
              Alert.alert('Invalid date or time', 'You cannot schedule Checkpoint 3 after your goal completion date and time')
            } else if (moment(dateTime).diff(moment(currentTime), 'minutes', true) <= 0) {
              Alert.alert('Invalid date or time', 
                'Checkpoint 3 completion date and time must be some time in the future');
            } else {
              values.DateTimeFormatted = moment(dateTime).format('Do MMMM YYYY, h:mm a');
              values.completed = false;
              dispatch(setCP3(values));
              navigation.goBack();
            }
          }}
        >
          {(props) => (
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelText}> Back </Text>
                </TouchableOpacity>
                <Text style={styles.headerText}> Edit Checkpoint 3 </Text>
                {dailyWeeklyValidator.isValidSync(props.values.Daily) &&
                monthlyMiscValidator.isValidSync(props.values.Weekly) ? (
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
                <Text style={styles.subheaderText}> Action Plan: </Text>

                <Text style={globalStyles.bodyText}>
                  {" "}
                  Daily goals you want to achieve:{" "}
                </Text>
                <TextInput
                  style={globalStyles.input}
                  multiline
                  minHeight={60}
                  placeholder="Eg: Practice coding for 30 minutes a day"
                  onChangeText={props.handleChange("Daily")}
                  value={props.values.Daily}
                  onBlur={props.handleBlur("Daily")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.Daily && props.errors.Daily}
                </Text>

                <Text style={globalStyles.bodyText}>
                  {" "}
                  Weekly goals you want to achieve:{" "}
                </Text>
                <TextInput
                  style={globalStyles.input}
                  multiline
                  minHeight={60}
                  placeholder="Eg: Revise lecture material for the week"
                  onChangeText={props.handleChange("Weekly")}
                  value={props.values.Weekly}
                  onBlur={props.handleBlur("Weekly")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.Weekly && props.errors.Weekly}
                </Text>

                <Text style={globalStyles.bodyText}>
                  {" "}
                  Monthly goals you want to achieve (if applicable):{" "}
                </Text>
                <TextInput
                  style={globalStyles.input}
                  multiline
                  minHeight={60}
                  placeholder="Eg: Do at least 2 timed practices"
                  onChangeText={props.handleChange("Monthly")}
                  value={props.values.Monthly}
                  onBlur={props.handleBlur("Monthly")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.Monthly && props.errors.Monthly}
                </Text>

                <Text style={globalStyles.bodyText}>
                  {" "}
                  Other Miscellaneous Goals (if applicable):{" "}
                </Text>
                <TextInput
                  style={globalStyles.input}
                  multiline
                  minHeight={60}
                  placeholder="Eg: Sleep by 12am everyday"
                  onChangeText={props.handleChange("Misc")}
                  value={props.values.Misc}
                  onBlur={props.handleBlur("Misc")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.Misc && props.errors.Misc}
                </Text>

                <Text style={globalStyles.bodyText}>
                  {" "}
                  Set Completion Date and Time:{" "}
                </Text>

                <View style={{ marginTop: 5, marginBottom: 30 }}>
                  <List.Item
                    style={styles.item}
                    title="Set Date"
                    titleStyle={styles.title}
                    left={() => (
                      <View style={{ justifyContent: "center" }}>
                        <Ionicons name="calendar" color="#666666" size={24} />
                      </View>
                    )}
                    right={() => (
                      <View style={{ justifyContent: "center" }}>
                        {showDate ? (
                          <MaterialIcons
                            name="expand-less"
                            color="#666666"
                            size={30}
                            onPress={() => {
                              showDatepicker();
                              setShowTime(false);
                            }}
                          />
                        ) : (
                          <MaterialIcons
                            name="expand-more"
                            color="#666666"
                            size={30}
                            onPress={() => {
                              showDatepicker();
                              setShowTime(false);
                            }}
                          />
                        )}
                      </View>
                    )}
                    description="Date to complete checkpoint 2"
                    descriptionStyle={styles.description}
                    onPress={() => {
                      showDatepicker();
                      setShowTime(false);
                    }}
                  />

                  <List.Item
                    style={styles.item}
                    title="Set Time"
                    titleStyle={styles.title}
                    left={() => (
                      <View style={{ justifyContent: "center" }}>
                        <Ionicons name="alarm" color="#666666" size={24} />
                      </View>
                    )}
                    right={() => (
                      <View style={{ justifyContent: "center" }}>
                        {showTime ? (
                          <MaterialIcons
                            name="expand-less"
                            color="#666666"
                            size={30}
                            onPress={() => {
                              showTimepicker();
                              setShowDate(false);
                            }}
                          />
                        ) : (
                          <MaterialIcons
                            name="expand-more"
                            color="#666666"
                            size={30}
                            onPress={() => {
                              showTimepicker();
                              setShowDate(false);
                            }}
                          />
                        )}
                      </View>
                    )}
                    description="Time to complete this goal by"
                    descriptionStyle={styles.description}
                    onPress={() => {
                      showTimepicker();
                      setShowDate(false);
                    }}
                  />
                  {(showDate || showTime) && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={dateTime}
                      mode={mode}
                      display="spinner"
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )}
                </View>
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
    marginBottom: 15,
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
  title: {
    alignSelf: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
  description: {
    alignSelf: "center",
    fontSize: 14,
  },
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.4,
    borderBottomColor: "#999",
    marginBottom: 3,
  },
  subheaderText: {
    ...globalStyles.bodyText,
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 18,
  },
});
