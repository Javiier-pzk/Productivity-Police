import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";
import * as Authentication from "../../api/auth";
import { globalStyles } from "../../Styles/globalStyles";

export default function SignInPage({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <SafeAreaView style={{ marginTop: 50 }}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.imageView}>
          <View style={styles.ImageBackground}>
            <ImageBackground
              source={require("../../assets/police.png")}
              style={{ height: 180, width: 180 }}
              imageStyle={{ borderRadius: 15 }}
            />
          </View>
        </View>
        <Text style={styles.greetings}> Hello {Authentication.getCurrentUserName()}! </Text>
        <Text style={styles.verifyEmail}>
          {" "}
          A verification email has been sent to {" "}
        </Text>

        <Text style={styles.emailText}>
          {" "}
          {Authentication.getCurrentUserEmail()} {" "}
        </Text>

        <Text style={styles.verifyEmailSubText}>
          {" "}
          Please check your email and verify your account.{" "}
        </Text>

        <Text style={styles.verifyEmailSubText}>
          {" "}
          If you don't see our email, check your junk folder.{" "}
        </Text>

        <TouchableOpacity
          style={styles.resend}
          onPress={async () => {
            await Authentication.sendVerificationEmail();
            Alert.alert(
              "A verification email has been sent",
              "Please check your email",
              [{ text: "Ok" }]
            );
          }}
        >
          <Text style={styles.resendText}> Resend Email Verification </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageView: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 50,
  },
  ImageBackground: {
    height: 100,
    width: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  resend: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4682b4",
    marginTop: 20
    //backgroundColor: "#4682b4",
  },
  resendText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4682b4",
  },
  greetings: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 5
  },
  verifyEmail: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 5
  },
  verifyEmailSubText: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 5
  },
  emailText: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 5,
    textDecorationLine: 'underline',
    marginBottom: 40
  }
});
