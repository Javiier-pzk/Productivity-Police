import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Authentication from '../../api/auth';
import {StackActions} from '@react-navigation/native';

export default function ChangePasswordScreen({ navigation }) {
  const [oldSecureTextEntry, setOldSecureTextEntry] = useState(true);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const validationSchema = yup.object({
    oldPassword: yup
      .string()
      .required("Old Password is a required field")
      .min(8)
      .max(20)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Your old password contains at least 8 characters, One Uppercase, One Lowercase, One Number and one special case character"
      ),
    newPassword: yup
      .string()
      .required("New Password is a required field")
      .min(8)
      .max(20)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Your new password must contain at least 8 characters, One Uppercase, One Lowercase, One Number and one special case character"
      ),
    confirmNewPassword: yup
      .string()
      .required("Confirm New Password is a required field")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleSubmit = (values) => {
    Authentication.updatePassword(values);
    navigation.navigate('Account Details');
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.userInfoView}>
        <Formik
          initialValues={{oldPassword: "", newPassword: ""}}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(props) => (
            <KeyboardAwareScrollView enableOnAndroid>
              <Text style={styles.userInfoText}> Old Password </Text>
              <View style={styles.userInfo}>
                <FontAwesome name="lock" size={25} color="#05375a" />
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={oldSecureTextEntry}
                  placeholder="Enter old Password"
                  value={props.values.oldPassword}
                  onChangeText={props.handleChange("oldPassword")}
                  onBlur={props.handleBlur("oldPassword")}
                  autoCorrect={false}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() => setOldSecureTextEntry(!oldSecureTextEntry)}
                >
                  {oldSecureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.errorMsg}>
                {props.touched.oldPassword && props.errors.oldPassword}
              </Text>

              <Text style={styles.userInfoText}> New Password </Text>
              <View style={styles.userInfo}>
                <FontAwesome name="lock" size={25} color="#05375a" />
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={secureTextEntry}
                  placeholder="Enter new Password"
                  value={props.values.newPassword}
                  onChangeText={props.handleChange("newPassword")}
                  onBlur={props.handleBlur("newPassword")}
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
                {props.touched.newPassword && props.errors.newPassword}
              </Text>

              <Text style={styles.userInfoText}> Confirm New Password </Text>
              <View style={styles.userInfo}>
                <FontAwesome name="lock" color="#05375a" size={25} />
                <TextInput
                  placeholder="Retype your new Password"
                  style={styles.textInput}
                  secureTextEntry={confirmSecureTextEntry}
                  value={props.values.confirmNewPassword}
                  onChangeText={props.handleChange("confirmNewPassword")}
                  onBlur={props.handleBlur("confirmNewPassword")}
                  autoCorrect={false}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() =>
                    setConfirmSecureTextEntry(!confirmSecureTextEntry)
                  }
                >
                  {confirmSecureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.errorMsg}>
                {props.touched.confirmNewPassword &&
                  props.errors.confirmNewPassword}
              </Text>

              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.changePassword}
                  onPress={() => props.handleSubmit()}
                >
                  <Text style={styles.changePasswordText}> Change Password </Text>
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
  changePassword: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682b4",
  },
  changePasswordText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
});
