import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  SectionList,
  ImageBackground,
  Modal,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../presentational/globalStyles";
import TitleCard from "../presentational/titleCard";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { Checkbox, IconButton, List } from "react-native-paper";
import * as Authentication from "../../../api/auth";
import * as Tasks from "../../../api/tasks";
import * as Profile from "../../../api/profile";
import * as Notifs from "../../../api/notifis";
import * as Notifications from "expo-notifications";
import EditTaskForm from "./editTaskForm";

export default function Main({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({});
  const [editTask, setEditTask] = useState({});
  const [sectionedTasks, setSectionedTasks] = useState([]);
  const [time, setTime] = useState(new Date());
  const [modalEditTask, setModalEditTask] = useState(false);
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    Notifs.registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        setNotification(notification)
      );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (response.notification.request.content.data.task !== undefined) {
          navigation.navigate(
            "Task Details",
            response.notification.request.content.data.task
          );
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    return Tasks.subscribe(userId, setTasks);
  }, []);

  useEffect(() => {
    if (tasks) {
      const categorisedTasks = [];
      const tasksArray = Object.values(tasks);
      const taskCount = tasksArray.filter((task) => !task.completed).length;
      const schoolTasks = tasksArray.filter(
        (task) => task.Category === "School"
      );
      const workTasks = tasksArray.filter((task) => task.Category === "Work");
      const personalTasks = tasksArray.filter(
        (task) => task.Category === "Personal"
      );
      const leisureTasks = tasksArray.filter(
        (task) => task.Category === "Leisure"
      );
      const otherTasks = tasksArray.filter(
        (task) => task.Category === "Others"
      );

      if (schoolTasks.length > 0)
        categorisedTasks.push({
          title: "School",
          data: schoolTasks.sort((t1, t2) => t1.Priority - t2.Priority),
        });
      if (workTasks.length > 0)
        categorisedTasks.push({
          title: "Work",
          data: workTasks.sort((t1, t2) => t1.Priority - t2.Priority),
        });
      if (personalTasks.length > 0)
        categorisedTasks.push({
          title: "Personal",
          data: personalTasks.sort((t1, t2) => t1.Priority - t2.Priority),
        });
      if (leisureTasks.length > 0)
        categorisedTasks.push({
          title: "Leisure",
          data: leisureTasks.sort((t1, t2) => t1.Priority - t2.Priority),
        });
      if (otherTasks.length > 0)
        categorisedTasks.push({
          title: "Others",
          data: otherTasks.sort((t1, t2) => t1.Priority - t2.Priority),
        });

      setSectionedTasks(categorisedTasks);
      Profile.updateTaskCount(
        taskCount,
        Authentication.getCurrentUserId(),
        () => {},
        (error) => Alert.alert(error.message)
      );
    } else {
      setSectionedTasks([]);
      Profile.updateTaskCount(
        0,
        Authentication.getCurrentUserId(),
        () => {},
        (error) => Alert.alert(error.message)
      );
      handleCancelAllNotifs();
    }
  }, [tasks]);

  const closeModal = () => setModalEditTask(false);

  const handleCompleteTask = async (taskId, identifier) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    Tasks.completeTask(
      { userId: Authentication.getCurrentUserId(), taskId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleUncompleteTask = async (taskId) => {
    Tasks.uncompleteTask(
      { userId: Authentication.getCurrentUserId(), taskId },
      () => {},
      (error) => Alert.alert(error.message)
    );
    Tasks.rescheduleNotifWhenUncomplete(
      { userId: Authentication.getCurrentUserId(), taskId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleDeleteTask = (taskId, identifier) => {
    Alert.alert("Delete this task?", "Deleted task is not retrievable", [
      {
        text: "Yes",
        onPress: async () => {
          await Notifications.cancelScheduledNotificationAsync(identifier);
          Tasks.deleteTask(
            { userId: Authentication.getCurrentUserId(), taskId },
            () => {},
            (error) => Alert.alert(error.message)
          );
        },
      },
      {
        text: "No",
        style: "destructive",
      },
    ]);
  };

  const handleEditTask = async (
    values,
    cat,
    dateTime,
    dateTimeFormatted,
    priority
  ) => {
    try {
      const title = values.Title;
      const description = values.Description;
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "You have an upcoming task",
          body: `${cat} - ${title}`,
          data: {
            task: {
              Title: title,
              Category: cat,
              Description: description,
              DateTimeFormatted: dateTimeFormatted,
            },
          },
          sound: true,
        },
        trigger: { date: dateTime },
      });
      Tasks.editTask(
        title,
        description,
        cat,
        dateTime,
        dateTimeFormatted,
        priority,
        identifier,
        { userId: Authentication.getCurrentUserId(), taskId: editTask.id },
        () => {},
        (error) => Alert.alert(error.message)
      );
      setModalEditTask(false);
    } catch (error) {
      Alert.alert(
        "Invalid date or time",
        "You cannot schedule a task at this date or time"
      );
    }
  };

  const handleCancelAllNotifs = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const renderList = ({ item, index, section, separators }) => {
    return (
      <TitleCard>
        <List.Item
          title={item.Title}
          left={(props) => (
            <View style={{ justifyContent: "center" }}>
              <Checkbox.Android
                {...props}
                color="green"
                onPress={() =>
                  item.completed
                    ? handleUncompleteTask(item.id)
                    : handleCompleteTask(item.id, item.Identifier)
                }
                status={item.completed ? "checked" : "unchecked"}
              />
            </View>
          )}
          right={(props) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                style={{ position: "absolute", right: 40 }}
                name="edit"
                size={22}
                color="#555"
                onPress={() => {
                  setModalEditTask(true);
                  setEditTask(item);
                }}
              />
              <IconButton
                {...props}
                icon="close"
                onPress={() => handleDeleteTask(item.id, item.Identifier)}
              />
            </View>
          )}
          titleStyle={
            item.completed ? styles.completedTask : globalStyles.titleText
          }
          description={moment(
            item.DateTimeFormatted,
            "Do MMMM YYYY, h:mm a"
          ).from(time)}
          onPress={() => navigation.navigate("Task Details", item)}
        />
      </TitleCard>
    );
  };

  useEffect(() => {
    let secTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#4682b4"
        />
      ) : (
        <View style = {{flex: 1}}>
          <Modal visible={modalEditTask} animationType="slide">
            <EditTaskForm
              handleEditTask={handleEditTask}
              oldTitle={editTask.Title}
              oldDesc={editTask.Description}
              oldCat={editTask.Category}
              oldDateTime={editTask.DateTimeFormatted}
              identifier={editTask.Identifier}
              closeModal={closeModal}
            />
          </Modal>

          {sectionedTasks.length === 0 ? (
            <View style={styles.noTask}>
              <View style={styles.imageView}>
                <View style={styles.ImageBackground}>
                  <ImageBackground
                    source={require("../../../assets/police.png")}
                    style={{ height: 200, width: 200 }}
                    imageStyle={{ borderRadius: 15 }}
                  />
                </View>
              </View>
              <Text style={styles.noTaskText}>
                {" "}
                You have no pending tasks currently.{" "}
              </Text>
              <Text style={styles.noTaskText}>
                {" "}
                Click + to add a new task now!
              </Text>
            </View>
          ) : (
            <SectionList
              sections={sectionedTasks}
              keyExtractor={(item, index) => item + index}
              renderItem={renderList}
              renderSectionHeader={({ section: { title } }) => (
                <List.Subheader style={styles.category}>
                  {" "}
                  {title}{" "}
                </List.Subheader>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
    fontSize: 17,
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#4682b4",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "grey",
    fontFamily: "nunito-bold",
    fontSize: 18,
  },
  imageView: {
    marginBottom: 40,
    alignSelf: "center",
  },
  ImageBackground: {
    height: 120,
    width: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  noTask: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  noTaskText: {
    ...globalStyles.bodyText,
    alignSelf: "center",
    fontSize: 18,
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  }
});
