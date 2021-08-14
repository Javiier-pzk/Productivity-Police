import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { globalStyles } from "../Styles/globalStyles";
import * as Authentication from "../api/auth";
import * as Profile from "../api/profile";
import { List, Avatar, Title, Caption } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [taskCount, setTaskCount] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentExp, setCurrentExp] = useState(0);
  const [currentUsername, setCurrentUsername] = useState(
    Authentication.getCurrentUserName()
  );
  const [currentDisplayPic, setCurrentDisplayPic] = useState(
    Authentication.getCurrentUserPhoto()
  );
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [habitCount, setHabitCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    return Profile.subscribe(Authentication.getCurrentUserId(), setUserInfo);
  }, []);

  useEffect(() => {
    if (userInfo) {
      setTaskCount(userInfo.taskCount);
      setCurrentLevel(userInfo.currentLevel);
      setCurrentExp(userInfo.currentExp);
      setCurrentUsername(userInfo.username);
      setCurrentDisplayPic(userInfo.photoURL);
      setHabitCount(userInfo.recurringGoals);
      setGoalCount(userInfo.longTermGoals);
      setBedTime(userInfo.bedTime);
      setWakeTime(userInfo.wakeUpTime);
    }
  }, [userInfo]);

  const toDoListDesc = `You have ${taskCount} outstanding ${
    taskCount === 1 ? "task" : "tasks"
  }`;
  const focusTimerDesc = `Current level: ${currentLevel} \nEXP to next level: ${
    1000 - currentExp
  }`;
  const sleepDesc = `Your bedtime is set for ${bedTime}\nYour next alarm is set for ${wakeTime}`;
  const goalsDesc = `You have ${habitCount} outstanding ${
    habitCount === 1 ? "habit" : "habits"
  } and 
    ${goalCount} outstanding long-term ${goalCount === 1 ? "goal" : "goals"}`;

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#4682b4"
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            {currentDisplayPic === null || currentDisplayPic === undefined ? (
              <Avatar.Image
                source={require("../assets/police.png")}
                size={85}
              />
            ) : (
              <Avatar.Image source={{ uri: currentDisplayPic }} size={85} />
            )}
            <View style={styles.headerText}>
              <Title style={styles.headerTitle}>
                {" "}
                Hello {currentUsername}!{" "}
              </Title>
              <Caption style={styles.caption}>
                {" "}
                Here's your profile at a glance{" "}
              </Caption>
            </View>
          </View>

          <List.Item
            style={styles.item}
            title="To Do List"
            titleStyle={styles.title}
            left={() => (
              <View style={{ justifyContent: "center" }}>
                <Ionicons name="checkbox-outline" color="#666666" size={28} />
              </View>
            )}
            right={() => (
              <View style={{ justifyContent: "center" }}>
                <MaterialIcons
                  name="arrow-forward-ios"
                  color="#666666"
                  size={25}
                  onPress={() => navigation.navigate("To Do List")}
                />
              </View>
            )}
            description={toDoListDesc}
            descriptionStyle={styles.description}
            onPress={() => navigation.navigate("To Do List")}
          />
          <List.Item
            style={styles.item}
            title="Focus Timer"
            titleStyle={styles.title}
            left={() => (
              <View style={{ justifyContent: "center" }}>
                <Ionicons name="timer" color="#666666" size={28} />
              </View>
            )}
            right={() => (
              <View style={{ justifyContent: "center" }}>
                <MaterialIcons
                  name="arrow-forward-ios"
                  color="#666666"
                  size={25}
                  onPress={() => navigation.navigate("Focus Timer")}
                />
              </View>
            )}
            description={focusTimerDesc}
            descriptionStyle={styles.description}
            onPress={() => navigation.navigate("Focus Timer")}
          />
          <List.Item
            style={styles.item}
            title="Sleep"
            titleStyle={styles.title}
            left={() => (
              <View style={{ justifyContent: "center" }}>
                <Ionicons name="bed" color="#666666" size={28} />
              </View>
            )}
            right={() => (
              <View style={{ justifyContent: "center" }}>
                <MaterialIcons
                  name="arrow-forward-ios"
                  color="#666666"
                  size={25}
                  onPress={() => navigation.navigate("Sleep")}
                />
              </View>
            )}
            descriptionNumberOfLines={3}
            description={sleepDesc}
            descriptionStyle={styles.description}
            onPress={() => navigation.navigate("Sleep")}
          />
          <List.Item
            style={styles.item}
            title="Goal Settings"
            titleStyle={styles.title}
            left={() => (
              <View style={{ justifyContent: "center" }}>
                <Ionicons name="flag" color="#666666" size={28} />
              </View>
            )}
            right={() => (
              <View style={{ justifyContent: "center" }}>
                <MaterialIcons
                  name="arrow-forward-ios"
                  color="#666666"
                  size={25}
                  onPress={() => navigation.navigate("Goal Setting")}
                />
              </View>
            )}
            description={goalsDesc}
            descriptionStyle={styles.description}
            onPress={() => navigation.navigate("Goal Setting")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    justifyContent: "center",
    marginLeft: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7b68ee",
  },
  caption: {
    fontSize: 16,
    color: "#db7093",
  },
  title: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    alignSelf: "center",
    fontSize: 16,
  },
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.4,
    borderBottomColor: "#999",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});
