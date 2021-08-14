import { createStackNavigator } from "react-navigation-stack";
import { MaterialIcons, EvilIcons } from "@expo/vector-icons";
import Main from "../screens/main";
import Header from "../../../shared/header";
import AlarmSetting from "../screens/alarmsetting";
import Nap from "../screens/nap";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import Dialog, {
  DialogContent,
  ScaleAnimation,
} from "react-native-popup-dialog";
import { Table, Row, Cols } from "react-native-table-component";

const tableHead = ["Age group/years", "Sleep duration/hrs"];
const tableContent = [
  ["1-2", "3-5", "9-12", "13-18", "18-60"],
  ["11-14", "10-13", "9-12", "8-10", "7"],
];

const screens = {
  Sleep: {
    screen: Main,
    navigationOptions: ({ navigation }) => {
      return {
        headerTransparent: true,
        headerTitle: () => <Header title="Sleep" />,
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
  "Alarm setting": {
    screen: AlarmSetting,
    navigationOptions: ({ navigation }) => {
      return {
        headerTransparent: true,
        headerTintColor: "#fff",
        headerTitle: () => {
          const [popupOpen, setPopupOpen] = useState(false);
          return (
            <View style={{ flexDirection: "row" }}>
              <Header title="Set Daily Alarms" />
              <EvilIcons
                name="question"
                size={30}
                color="white"
                // style={{ marginHorizontal: '1%' }}
                onPress={() => setPopupOpen(true)}
              />
              <Dialog
                visible={popupOpen}
                onTouchOutside={() => setPopupOpen(false)}
                dialogTitle={
                  <View style={styles.popupTitle}>
                    <Text style={{ fontFamily: "nunito-bold", fontSize: 16 }}>
                      Set daily alarms!
                    </Text>
                    <EvilIcons
                      name="close"
                      size={24}
                      color="black"
                      style={{
                        position: "absolute",
                        right: 0,
                        marginRight: "2%",
                        marginTop: "6%",
                      }}
                      onPress={() => setPopupOpen(false)}
                    />
                  </View>
                }
                width={0.8}
                height={0.5}
                dialogAnimation={
                  new ScaleAnimation({
                    initialValue: 0, // optional
                    useNativeDriver: true, // optional
                  })
                }
              >
                <DialogContent style={{ justifyContent: "center" }}>
                  <ScrollView style={{ height: "95%", width: "100%" }}>
                    <Text style={styles.writeupTitle}>
                      What alarms can I set?
                    </Text>
                    <Text style={styles.writeupContent}>
                      There are two alarms that you can set in this feature, an
                      alarm that will remind you to sleep at the time of your
                      choice, and an alarm that sounds when it's time to wake
                      up.
                    </Text>
                    <Text style={styles.writeupTitle}>
                      Understanding sleep cycles
                    </Text>

                    <Text style={styles.writeupContent}>
                      Every hour of sleep before midnight is worth two after
                      midnight. It's an old saying that has some truth in it.
                      Your sleep consists of 90 minute cycles during which your
                      brain moves from non-REM (non-rapid eye movement) sleep to
                      REM (rapid eye movement) sleep. It is also known that
                      non-REM sleep tends to dominate sleep cycles in the early
                      part of the night, while REM sleep muscles in as daybreak
                      creeps in. This is the reason why people that sleep
                      earlier wake up feeling more energised, as research
                      suggests that non-REM sleep is more restorative and deeper
                      than lighter dream infused REM sleep.
                    </Text>
                    <Text style={styles.writeupTitle}>
                      So what are the optimum hours to sleep?
                    </Text>
                    <Text style={styles.writeupSubTitle}>Sleeping time</Text>
                    <Text style={styles.writeupContent}>
                      When it comes to bedtime, there’s a window of several
                      hours—roughly between 8 PM and 12 AM—during which your
                      brain and body have the opportunity to get all the non-REM
                      and REM shuteye they need to function optimally.
                    </Text>
                    <Text style={styles.writeupSubTitle}>Waking time</Text>
                    <Text style={styles.writeupContent}>
                      Unlike bedtime, there is not really an ideal time to wake
                      up at which provides the most rest. The ideal waking time
                      depends on what time you go to bed, and the duration of
                      sleep you will get.
                    </Text>
                    <Text style={styles.writeupSubTitle}>Sleep duration</Text>
                    <Text style={styles.writeupContent}>
                      The recommended sleep duration differs between age groups,
                      and matter just as much as the time you decide to go to
                      bed. Below is a table of recommended sleep durations for
                      differing age groups.
                    </Text>
                    <Table
                      borderStyle={{ borderWidth: 2, borderColor: "black" }}
                      style={{ marginTop: "1%" }}
                    >
                      <Row
                        data={tableHead}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <Cols data={tableContent} textStyle={styles.text} />
                    </Table>
                    <Text style={styles.writeupTitle}>Conclusion</Text>
                    <Text style={styles.writeupContent}>
                      {"While it is important to sleep early in order to provide your body enough non-REM sleep, your genetics dictates whether you’re more comfortable going to bed earlier or later within that rough 8pm-12am window. You should also not have huge waking discrepancies, such as waking at 6am on weekdays and 11am on weekends. Another tip is to be careful of oversleeping as it can have negative effects on your daily lives. Happy sleeping!" +
                        "\n"}
                    </Text>
                  </ScrollView>
                </DialogContent>
              </Dialog>
            </View>
          );
        },
      };
    },
  },
  Nap: {
    screen: Nap,
    navigationOptions: ({ navigation }) => {
      return {
        headerTransparent: true,
        headerTintColor: "#fff",
        headerTitle: () => {
          const [popupOpen, setPopupOpen] = useState(false);
          return (
            <View style={{ flexDirection: "row" }}>
              <Header title="Set Power naps" />
              <EvilIcons
                name="question"
                size={30}
                color="white"
                onPress={() => setPopupOpen(true)}
              />
              <Dialog
                visible={popupOpen}
                onTouchOutside={() => setPopupOpen(false)}
                dialogTitle={
                  <View style={styles.popupTitle}>
                    <Text style={{ fontFamily: "nunito-bold", fontSize: 16 }}>
                      Introduction to power nap!
                    </Text>
                    <EvilIcons
                      name="close"
                      size={24}
                      color="black"
                      style={{
                        position: "absolute",
                        right: 0,
                        marginRight: "2%",
                        marginTop: "6%",
                      }}
                      onPress={() => setPopupOpen(false)}
                    />
                  </View>
                }
                width={0.8}
                height={0.5}
                dialogAnimation={
                  new ScaleAnimation({
                    initialValue: 0, // optional
                    useNativeDriver: true, // optional
                  })
                }
              >
                <DialogContent style={{ justifyContent: "center" }}>
                  <ScrollView style={{ height: "95%", width: "100%" }}>
                    <Text style={styles.writeupTitle}>
                      What is the aim of this feature?
                    </Text>
                    <Text style={styles.writeupContent}>
                      The aim of this feature is to give you a quick way of
                      setting nap times, and to provide the user information on
                      what's the most optimal nap timings to ensure maximum
                      productivity and not oversleep.
                    </Text>
                    <Text style={styles.writeupTitle}>
                      What is an optimal power nap time?
                    </Text>
                    <Text style={styles.writeupContent}>
                      In the scrollview provided below the picker, the user can
                      quick select a timing in which we have provided that is
                      considered the optimal nap timings.
                    </Text>
                    <Text style={styles.writeupTitle}>
                      So what are the best nap timings?
                    </Text>
                    <Text style={styles.writeupSubTitle}>
                      15 - 20 mins (Power nap)
                    </Text>
                    <Text style={styles.writeupContent}>
                      This is the best nap duration that boosts one's alertness
                      and motor learning skills and skills like playing the
                      piano! Power naps also ensure that you do not wake up
                      feeling groggy compared to longer naps that exceed 30
                      minutes.
                    </Text>
                    <Text style={styles.writeupSubTitle}>
                      30 - 60 mins (Slow-wave sleep)
                    </Text>
                    <Text style={styles.writeupContent}>
                      This nap timing is good for decision-making skills, such
                      as memorizing vocabulary or recalling directions. Any nap
                      timing lasting longer than 30 minutes however, may leave
                      you feeling dazed after waking up.
                    </Text>
                    <Text style={styles.writeupSubTitle}>
                      60 - 90 mins (rapid eye movement/REM sleep)
                    </Text>
                    <Text style={styles.writeupContent}>
                      This nap type plays a key role in making new connections
                      in the brain and solving creative problems.
                    </Text>
                    <Text style={styles.writeupTitle}>Extra tips</Text>
                    <Text style={styles.writeupSubTitle}>Be consistent</Text>
                    <Text style={styles.writeupContent}>
                      Keep a regular napping schedule. Prime napping time falls
                      in the period between 1pm to 3pm.
                    </Text>
                    <Text style={styles.writeupSubTitle}>
                      Shorten nap durations
                    </Text>
                    <Text style={styles.writeupContent}>
                      Set alarms for less than 30 mins to ensure that you do not
                      get groggy.
                    </Text>
                    <Text style={styles.writeupSubTitle}>Go dark</Text>
                    <Text style={styles.writeupContent}>
                      Taking a nap in a dark room or wearing an eye mask will
                      help you fall asleep faster.
                    </Text>
                    <Text style={styles.writeupSubTitle}>Keep warm</Text>
                    <Text style={styles.writeupContent}>
                      {"Use a blanket to keep warm as body temperature drops when you fall asleep. " +
                        "\n"}
                    </Text>
                  </ScrollView>
                </DialogContent>
              </Dialog>
            </View>
          );
        },
      };
    },
  },
};

const HomeSleepStack = createStackNavigator(screens);

const styles = StyleSheet.create({
  popupTitle: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 14,
    backgroundColor: "#f3f3f3",
  },
  writeupTitle: {
    fontSize: 18,
    marginVertical: "2%",
    fontFamily: "nunito-bold",
  },
  writeupSubTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: "1%",
    fontFamily: "nunito-bold",
  },
  writeupContent: {
    fontSize: 15,
    fontFamily: "nunito-regular",
    textAlign: "justify",
  },
});

export default HomeSleepStack;
