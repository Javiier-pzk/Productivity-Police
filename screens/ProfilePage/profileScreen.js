import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import * as Authentication from "../../api/auth";
import * as Profile from '../../api/profile';
import { StackActions } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const newUsername = navigation.getParam("Username");

  const newImage = navigation.getParam("Image");

  const [userInfo, setUserInfo] = useState({});
  const [verified, setVerified]  = useState(false);
  
  useEffect(() => {
    return Profile.verification(Authentication.getCurrentUserId(), setUserInfo)
  }, [])
  
  useEffect(() => {
    if (userInfo) {
      setVerified(userInfo.emailVerified)
    }
  }, [userInfo]);

  useEffect(() => {
    let secTimer = setInterval(() => {
      Authentication.checkVerified(
        () => Profile.updateVerification(
          true, 
          Authentication.getCurrentUserId(),
          () => {},
          (error) => Alert.alert(error.message)
        ),
      );
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        {newImage === undefined || newImage === null ? (
          <View style={styles.ImageBackground}>
            <ImageBackground
              source={
                Authentication.getCurrentUserPhoto() === null
                  ? require("../../assets/police.png")
                  : { uri: Authentication.getCurrentUserPhoto() }
              }
              style={
                Authentication.getCurrentUserPhoto() === null
                  ? { height: 180, width: 180 }
                  : { height: 150, width: 150 }
              }
              imageStyle={{ borderRadius: 150 }}
            />
          </View>
        ) : (
          <View style={styles.ImageBackground}>
            <ImageBackground
              source={{ uri: newImage }}
              style={{ height: 150, width: 150 }}
              imageStyle={{ borderRadius: 150 }}
            />
          </View>
        )}

        {newUsername === undefined ? (
          <Text style={styles.username}>
            {" "}
            {Authentication.getCurrentUserName()}
          </Text>
        ) : (
          <Text style={styles.username}> {newUsername} </Text>
        )}
      </View>

      <View style={styles.userInfoView}>
        <Text style={styles.text}> Username </Text>
        <View style={styles.userInfo}>
          <FontAwesome name="user-o" size={20} color="#05375a" />
          {newUsername === undefined ? (
            <Text style={styles.userInfoText}>
              {" "}
              {Authentication.getCurrentUserName()}
            </Text>
          ) : (
            <Text style={styles.userInfoText}> {newUsername} </Text>
          )}
        </View>
        {verified ? (
          <View style={styles.verified}>
            <Text style={styles.text}> Email ( verified </Text>
            <Feather name="check-circle" size={20} color="green" />
            <Text style={styles.text}> ) </Text>
          </View>
        ) : (
          <View style={styles.verified}>
            <Text style={styles.text}> Email ( Not verified </Text>
            <FontAwesome name="times" size={20} color="red" />
            <Text style={styles.text}> ) </Text>
          </View>
        )}

        
          <View style={styles.userInfo}>
            <FontAwesome name="at" size={20} color="#05375a" />
            <Text style={styles.userInfoText}>
              {" "}
              {Authentication.getCurrentUserEmail()}
            </Text>
          </View>
        

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.editProfile}
            onPress={() => navigation.navigate("Edit Profile")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOut}
            onPress={() =>
              Alert.alert("Sign Out?", "Are you sure you want to sign out?", [
                {
                  text: "Yes",
                  onPress: () =>
                    Authentication.signOut(
                      () => navigation.dispatch(StackActions.popToTop()),
                      console.error
                    ),
                },
                {
                  text: "No",
                  style: "destructive",
                },
              ])
            }
          >
            <Text style={styles.signOutText}> Sign Out </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageView: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  ImageBackground: {
    height: 100,
    width: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    marginTop: 30,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "nunito-bold",
  },
  text: {
    color: "#05375a",
    fontSize: 18,
    marginBottom: 3,
  },
  userInfoView: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: "#777777",
    padding: 5,
  },
  userInfoText: {
    color: "#777777",
    marginLeft: 15,
    fontSize: 16,
  },
  verified: {
    flexDirection: "row",
  },
  button: {
    alignItems: "center",
    marginTop: 20,
  },
  editProfile: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682b4",
  },
  signOut: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#4682b4",
    borderWidth: 1,
    marginTop: 15,
  },
  editProfileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  signOutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "crimson",
  },
});
