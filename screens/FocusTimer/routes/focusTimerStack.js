import { createStackNavigator } from "react-navigation-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Main from "../screens/main";
import Normal from "../screens/normal";
import Pomodoro from "../screens/pomodoro";
import React from "react";
import Header from "../../../shared/header";
import Achievements from "../screens/achievements";

const screens = {
  "Focus Timer": {
    screen: Main,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title="Focus Timer" />,
        headerLeft: () => (
          <MaterialIcons
            style={{ marginLeft: 15 }}
            name="menu"
            size={28}
            color="#fff"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
      };
    },
  },
  Achievements: {
    screen: Achievements,
  },
  Pomodoro: {
    screen: Pomodoro,
  },
  Standard: {
    screen: Normal,
  },
};

const FocusTimerStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: "#7b68ee",
    },
    headerTitleAlign: "center",
  },
});

export default FocusTimerStack;
