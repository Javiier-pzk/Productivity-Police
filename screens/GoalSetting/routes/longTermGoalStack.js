import { createStackNavigator } from "@react-navigation/stack";
import LongTermGoals from "../screens/longTermGoals";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Header from "../../../shared/header";
import { MaterialIcons } from "@expo/vector-icons";
import LongTermGoalDetails from "../screens/longTermGoalDetails";
import CP1Details from "../screens/CP1Details";
import CP2Details from "../screens/CP2Details";
import CP3Details from "../screens/CP3Details";
import CheckPointStack from "./checkPointStack";
import EditLongTermGoalsForm from "../screens/editLongTermGoalsForm";
import EditCP1Form from "../screens/editCP1Form";
import EditCP2Form from "../screens/editCP2Form";
import EditCP3Form from "../screens/editCP3Form";
import { useDispatch } from "react-redux";
import { setCP1 } from "../../../redux/checkpoint1";
import { setCP2 } from "../../../redux/checkpoint2";
import { setCP3 } from "../../../redux/checkpoint3";
import { setGoalNotes } from "../../../redux/goal";

const Stack = createStackNavigator();

export default function LongTermGoalStack({ openDrawer }) {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#5f9ea0" },
      }}
    >
      <Stack.Screen
        name="Long Term Goals"
        component={LongTermGoals}
        options={({ navigation }) => ({
          headerTitle: () => <Header title="Long Term Goals" />,
          headerLeft: () => (
            <MaterialIcons
              style={{ marginLeft: 15 }}
              name="menu"
              size={28}
              color="#fff"
              onPress={openDrawer}
            />
          ),
          headerRight: () => (
            <MaterialIcons
              style={{ marginRight: 15 }}
              name="add"
              size={30}
              color="#fff"
              onPress={() => navigation.push("Create Goals")}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Goal Details"
        component={LongTermGoalDetails}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.goBack();
                dispatch(setCP1({}));
                dispatch(setCP2({}));
                dispatch(setCP3({}));
                dispatch(setGoalNotes({}));
              }}
            >
              <MaterialIcons name="arrow-back-ios" size={28} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  position: "absolute",
                  left: 16,
                }}
              >
                {" "}
                Back{" "}
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Checkpoint 1" component={CP1Details} />
      <Stack.Screen name="Checkpoint 2" component={CP2Details} />
      <Stack.Screen name="Checkpoint 3" component={CP3Details} />
      <Stack.Screen
        name="Create Goals"
        component={CheckPointStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Goal"
        component={EditLongTermGoalsForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Checkpoint 1"
        component={EditCP1Form}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Checkpoint 2"
        component={EditCP2Form}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Checkpoint 3"
        component={EditCP3Form}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
