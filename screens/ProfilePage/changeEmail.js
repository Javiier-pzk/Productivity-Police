import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import * as Authentication from "../../api/auth";
import * as Profile from '../../api/profile';
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {StackActions} from '@react-navigation/native'

export default function ChangeEmailScreen({ navigation }) {
  const emailValidator = yup.string().required().email();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validationSchema = yup.object({
    Email: yup
      .string()
      .required()
      .email("Email is invalid"),
    Password: yup
      .string()
      .required("You must enter your password to change ur account email")
      .min(8)
      .max(20)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Your password contains at least 8 characters, One Uppercase, One Lowercase, One Number and one special case character"
      ),
  });

  
  const handleSubmit = (values) => {
    Authentication.updateEmail(values);
    navigation.navigate('Account Details', values);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.userInfoView}>
        <Formik
          initialValues={{
            Email: Authentication.getCurrentUserEmail(),
            Password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(props) => (
            <KeyboardAwareScrollView enableOnAndroid>
              <Text style={styles.userInfoText}> Change Email </Text>
              <View style={styles.userInfo}>
                <FontAwesome name="at" size={20} color="#05375a" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new Email"
                  value={props.values.Email}
                  onChangeText={props.handleChange("Email")}
                  onBlur={props.handleBlur("Email")}
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {emailValidator.isValidSync(props.values.Email) ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : null}
              </View>

              <Text style={styles.errorMsg}>
                {props.touched.Email && props.errors.Email}
              </Text>

              <Text style={styles.userInfoText}> Enter Password </Text>
              <View style={styles.userInfo}>
                <FontAwesome name="lock" size={25} color="#05375a" />
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={secureTextEntry}
                  placeholder="Enter your Password"
                  value={props.values.Password}
                  onChangeText={props.handleChange("Password")}
                  onBlur={props.handleBlur("Password")}
                  autoCorrect={false}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  {secureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.errorMsg}>
                {props.touched.Password && props.errors.Password}
              </Text>


              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.changeEmail}
                  onPress={() => props.handleSubmit()}
                >
                  <Text style={styles.changeEmailText}> Change Email </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          )}
        </Formik>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  userInfoView: {
    paddingHorizontal: 30,
    marginBottom: 25,
    paddingVertical: 30,
    flex: 1
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.2,
    borderBottomColor: "#777777",
    padding: 5,
  },
  userInfoText: {
    color: "#05375a",
    fontSize: 18,
    marginBottom: 3,
  },
  errorMsg: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    marginTop: 10,
  },
  changeEmail: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682b4",
  },
  changeEmailText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  signOutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "crimson",
  }, 
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
});
