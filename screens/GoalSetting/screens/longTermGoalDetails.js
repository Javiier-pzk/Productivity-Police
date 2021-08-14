import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import Card from "../../../shared/card";
import SwitchSelector from "react-native-switch-selector";
import { AirbnbRating } from "react-native-ratings";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { setGoalNotes } from "../../../redux/goal";
import * as Goals from "../../../api/goals";
import * as Authentication from "../../../api/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LongTermGoalDetails({ navigation, route }) {
  const item = route.params;
  const { goalNotes } = useSelector((state) => state.goal);
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [rating, setRating] = useState(
    goalNotes.Rating !== undefined
      ? goalNotes.Rating
      : item.Rating !== undefined
      ? item.Rating
      : 5
  );

  const reflectionText =
    "Write down your thoughts on how you did for this goal! \n";
  const improvementText =
    "What could you have done better? \n" +
    "\nImprovement for future goals? \n";

  const pushNotes = (reflectionNote, improvementNote, rating) => {
    const notes = {
      ReflectionNote: reflectionNote,
      ImprovementNote: improvementNote,
      Rating: rating,
    };
    dispatch(setGoalNotes(notes));
    Goals.updateGoalNotes(
      notes,
      { userId: Authentication.getCurrentUserId(), goalId: item.id },
      () => {},
      (error) => Alert.alert(error.message)
    );
    Alert.alert("Success!", "Notes for this goal have been updated");
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
        <View>
          <Card>
            <View style={styles.title}>
              <Text style={globalStyles.titleText}>{item.Title}</Text>
            </View>
            <View style={styles.endGoal}>
              <Text style={styles.endGoalText}>{item.EndGoal}</Text>
            </View>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{item.Category}</Text>
            </View>
            <View style={styles.dateTime}>
              <Text style={globalStyles.titleText}>
                {item.DateTimeFormatted}
              </Text>
            </View>
          </Card>

          {item.Checkpoint1 !== undefined ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Checkpoint 1", {
                  ...item.Checkpoint1,
                  id: item.id,
                })
              }
            >
              <Card>
                <View style={styles.title}>
                  <Text
                    style={
                      item.Checkpoint1.completed
                        ? styles.completedCheckpoint
                        : globalStyles.titleText
                    }
                  >
                    {" "}
                    Checkpoint 1{" "}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ) : null}

          {item.Checkpoint2 !== undefined ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Checkpoint 2", {
                  ...item.Checkpoint2,
                  id: item.id,
                })
              }
            >
              <Card>
                <View style={styles.title}>
                  <Text
                    style={
                      item.Checkpoint2.completed
                        ? styles.completedCheckpoint
                        : globalStyles.titleText
                    }
                  >
                    {" "}
                    Checkpoint 2{" "}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ) : null}

          {item.Checkpoint3 !== undefined ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Checkpoint 3", {
                  ...item.Checkpoint3,
                  id: item.id,
                })
              }
            >
              <Card>
                <View style={styles.title}>
                  <Text
                    style={
                      item.Checkpoint3.completed
                        ? styles.completedCheckpoint
                        : globalStyles.titleText
                    }
                  >
                    {" "}
                    Checkpoint 3{" "}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {item.completed && showNotes && (
        <Formik
          initialValues={{
            ReflectionNote:
              goalNotes.ReflectionNote !== undefined
                ? goalNotes.ReflectionNote
                : item.ReflectionNote !== undefined
                ? item.ReflectionNote
                : "",
            ImprovementNote:
              goalNotes.ImprovementNote !== undefined
                ? goalNotes.ImprovementNote
                : item.ImprovementNote !== undefined
                ? item.ImprovementNote
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
              <Text style={styles.notesText}> Goal Notes: </Text>

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

      {showNotes && !item.completed && (
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
          <Text style={styles.noNoteText}> goal is completed. </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: "center",
  },
  category: {
    paddingTop: 16,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignSelf: "center",
  },
  categoryText: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#333",
  },
  endGoal: {
    paddingTop: 16,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignSelf: "center",
  },
  endGoalText: {
    fontFamily: "nunito-regular",
    fontSize: 16,
    color: "#333",
  },
  dateTime: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: 16,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  completedCheckpoint: {
    textDecorationLine: "line-through",
    color: "grey",
    fontFamily: "nunito-bold",
    fontSize: 18,
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
