import React, { useState } from "react";
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Alert
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import { TouchableOpacity } from "react-native-gesture-handler";
import Users from './dataBase';

export default function SignUpPage({ navigation }) {
  
    const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validationSchema = yup.object({
    Username: yup.string().required().min(4).max(20),
    Password: yup
      .string()
      .required()
      .min(8)
      .max(20)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Your password must contain at least 8 characters, One Uppercase, One Lowercase, One Number and one special case character"
      ),
  });

  const onSignIn = (obj) => {

    const foundUser = Users.filter( item => item.Username === obj.Username && item.Password == obj.Password);
    if ( foundUser.length === 0 ) {
        Alert.alert('Invalid User!', 'Username or password is incorrect.', [
            {text: 'Dismiss'}
        ]);
    } else {
        navigation.navigate('Home');
    }
}
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}> Welcome back! </Text>
        </View>
        <View style={styles.footer}>
          <Formik
            initialValues={{ Username: "", Password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => onSignIn(values) }
          >
            {(props) => (
              <View>
                <Text style={styles.username}> Username </Text>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color="#05375a" size={20} />
                  <TextInput
                    placeholder="Your Username"
                    style={styles.textInput}
                    value={props.values.Username}
                    onChangeText={props.handleChange("Username")}
                    onBlur={props.handleBlur("Username")}
                    autoCorrect = {false} 
                  />

                  {props.values.Username.length >= 4 &&
                  props.values.Username.length <= 20 ? (
                    <Feather name="check-circle" color="green" size={20} />
                  ) : null}
                </View>

                <Text style={styles.errorMsg}>
                  {props.touched.Username && props.errors.Username}
                </Text>

                <Text style={styles.password}> Password </Text>
                <View style={styles.action}>
                  <FontAwesome name="lock" color="#05375a" size={25} />
                  <TextInput
                    placeholder="Your Password"
                    style={styles.textInput}
                    secureTextEntry={secureTextEntry}
                    value={props.values.Password}
                    onChangeText={props.handleChange("Password")}
                    onBlur={props.handleBlur("Password")}
                    autoCorrect = {false}
                  />

                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
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

                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {
                    props.handleSubmit();
                  }}
                >
                  <Text style={styles.signInText}> Sign In </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4682b4",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  username: {
    color: "#05375a",
    fontSize: 18,
  },
  password: {
    marginTop: 20,
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 6,
    textAlign: "center",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682b4",
    marginTop: 20,
  },
  signInText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
