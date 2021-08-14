import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import Card from "../../../shared/card";
import SwitchSelector from "react-native-switch-selector";
import { AirbnbRating } from "react-native-ratings";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { setCP3 } from "../../../redux/checkpoint3";
import * as Goals from "../../../api/goals";
import * as Authentication from "../../../api/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CP3Details({ route }) {
  const checkpoint3 = route.params;
  const { cp3 } = useSelector((state) => state.checkpoint3);
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [rating, setRating] = useState(
    cp3.Rating !== undefined
      ? cp3.Rating
      : checkpoint3.Rating !== undefined
      ? checkpoint3.Rating
      : 5
  );

  const reflectionText =
    "Write down your thoughts on how you did for Checkpoint 3! \n";
  const improvementText =
    "What could you have done better? \n" +
    "\nImprovements for future checkpoints? \n";

  const pushNotes = (reflectionNote, improvementNote, rating) => {
    dispatch(
      setCP3({
        ReflectionNote: reflectionNote,
        ImprovementNote: improvementNote,
        Rating: rating,
      })
    );
    const newCheckpoint3 = {
      ...checkpoint3,
      ReflectionNote: reflectionNote,
      ImprovementNote: improvementNote,
      Rating: rating,
    };
    Goals.editCheckpoint3(
      newCheckpoint3,
      { userId: Authentication.getCurrentUserId(), goalId: checkpoint3.id },
      () => {},
      (error) => Alert.alert(error.message)
    );
    Alert.alert("Success!", "Notes for Checkpoint 3 have been updated");
  };

  return (
    <View style={globalStyles.container}>
      <SwitchSelector
        style={{ marginBottom: 10 }}
        options={[
          { label: "Details", value: "Details" },
          { label: "Notes", value: "Notes" },
        ]}
        initial={0}
        hasPadding
        onPress={(value) => {
          if (value === "Details") {
            setShowDetails(true);
            setShowNotes(false);
          } else {
            setShowDetails(false);
            setShowNotes(true);
          }
        }}
        selectedColor="#fff"
        buttonColor="#fa5d5d"
      />

      {showDetails && (
        <ScrollView style={{ flex: 1 }}>
          <Card>
            <View>
              <Text style={styles.title}> Daily </Text>
              <Text style={styles.bodyText}>{checkpoint3.Daily}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.title}> Weekly </Text>
              <Text style={styles.bodyText}>{checkpoint3.Weekly}</Text>
            </View>
            {checkpoint3.Monthly !== "" ? (
              <View style={styles.body}>
                <Text style={styles.title}> Monthly </Text>
                <Text style={styles.bodyText}>{checkpoint3.Monthly}</Text>
              </View>
            ) : null}
            {checkpoint3.Misc !== "" ? (
              <View style={styles.body}>
                <Text style={styles.title}> Miscellaneous </Text>
                <Text style={styles.bodyText}>{checkpoint3.Misc}</Text>
              </View>
            ) : null}
            <View style={styles.dateTime}>
              <Text style={globalStyles.titleText}>
                {checkpoint3.DateTimeFormatted}
              </Text>
            </View>
          </Card>
        </ScrollView>
      )}

      {checkpoint3.completed && showNotes && (
        <Formik
          initialValues={{
            ReflectionNote:
              cp3.ReflectionNote !== undefined
                ? cp3.ReflectionNote
                : checkpoint3.ReflectionNote !== undefined
                ? checkpoint3.ReflectionNote
                : "",
            ImprovementNote:
              cp3.ImprovementNote !== undefined
                ? cp3.ImprovementNote
                : checkpoint3.ImprovementNote !== undefined
                ? checkpoint3.ImprovementNote
                : "",
          }}
          onSubmit={(values) => {
            const reflectionNote = values.ReflectionNote;
            const improvementNote = values.ImprovementNote;
            pushNotes(reflectionNote, improvementNote, rating);
          }}
        >
          {(props) => (
            <KeyboardAwareScrollView
              style={{ marginTop: 10 }}
              extraHeight={300}
            >
              <Text style={styles.notesText}> Checkpoint 3 Notes: </Text>

              <Text style={globalStyles.bodyText}> Reflection: </Text>
              <TextInput
                style={{
                  ...globalStyles.input,
                  marginBottom: 30,
                }}
                multiline
                minHeight={80}
                placeholder={reflectionText}
                onChangeText={props.handleChange("ReflectionNote")}
                value={props.values.ReflectionNote}
              />

              <Text style={globalStyles.bodyText}>
                How would you rate your performance?
              </Text>

              <View style={styles.rating}>
                <View style={styles.ratingView}>
                  <Text style={styles.ratingText}> Rating: </Text>
                  <Text style={{ ...styles.ratingText, color: "#fa5d5d" }}>
                    {" "}
                    {rating}{" "}
                  </Text>
                  <Text style={styles.ratingText}>/ 5 </Text>
                </View>
                <AirbnbRating
                  ratingContainerStyle={styles.ratingContainerStyle}
                  count={5}
                  reviews={[
                    "Unsatisfactory",
                    `Can be improved`,
                    "Decent",
                    "Satisfactory",
                    "Excellent",
                  ]}
                  defaultRating={rating}
                  size={26}
                  reviewSize={19}
                  reviewColor="#fa5d5d"
                  onFinishRating={(rating) => setRating(rating)}
                />
              </View>

              <Text style={globalStyles.bodyText}>
                {" "}
                Areas for improvement:{" "}
              </Text>
              <TextInput
                style={{
                  ...globalStyles.input,
                  marginBottom: 30,
                }}
                multiline
                minHeight={80}
                placeholder={improvementText}
                onChangeText={props.handleChange("ImprovementNote")}
                value={props.values.ImprovementNote}
              />

              <TouchableOpacity
                style={styles.save}
                onPress={() => props.handleSubmit()}
              >
                <Text style={styles.saveText}> Save Changes </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          )}
        </Formik>
      )}

      {showNotes && !checkpoint3.completed && (
        <View style={styles.noNote}>
          <View style={styles.imageView}>
            <View style={styles.ImageBackground}>
              <ImageBackground
                source={require("../../../assets/police.png")}
                style={{ height: 200, width: 200 }}
                imageStyle={{ borderRadius: 15 }}
              />
            </View>
          </View>
          <Text style={{ ...styles.noNoteText, marginBottom: 10 }}>
            {" "}
            No notes here yet!{" "}
          </Text>
          <Text style={styles.noNoteText}>
            {" "}
            You can only add notes after this
          </Text>
          <Text style={styles.noNoteText}> checkpoint is completed. </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textDecorationLine: "underline",
    ...globalStyles.titleText,
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 10,
  },
  body: {
    paddingTop: 16,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bodyText: {
    fontFamily: "nunito-regular",
    fontSize: 16,
    color: "#333",
    alignSelf: "center",
  },
  dateTime: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: 16,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  notesText: {
    ...globalStyles.bodyText,
    alignSelf: "center",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  rating: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 30,
  },
  ratingContainerStyle: {
    paddingBottom: 12,
  },
  ratingView: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
    flexDirection: "row",
  },
  ratingText: {
    fontFamily: "nunito-bold",
    fontSize: 19,
    color: "#333",
  },
  imageView: {
    marginBottom: 30,
    alignSelf: "center",
  },
  ImageBackground: {
    height: 120,
    width: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  noNote: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 50,
  },
  noNoteText: {
    ...globalStyles.bodyText,
    alignSelf: "center",
    fontSize: 18,
  },
  save: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4682b4",
    //backgroundColor: "#4682b4",
  },
  saveText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4682b4",
  },
});
