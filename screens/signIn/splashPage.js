import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";

export default function SplashPage({ navigation }) {

  
    return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require("../../assets/police.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.title}> Welcome to </Text>
        <Text style={styles.title}> Productivity Police </Text>
        <Text style={styles.text}> Sign in with existing account </Text>
        <Text style={styles.text}>
          {" "}
          Don't have an account? Register for one now!{" "}
        </Text>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => navigation.navigate("Sign In Page") }
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUp}
            onPress={() => navigation.navigate("Sign Up Page") }
          >
            <Text style={styles.signUpText}> Sign Up </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4682b4",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
    marginTop: 35
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682b4",
  },
  signUp: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#4682b4",
    borderWidth: 1,
    marginTop: 15,
  },
  signInText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  signUpText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4682b4",
  },
});
