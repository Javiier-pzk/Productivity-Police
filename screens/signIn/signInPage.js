import React, { useState } from "react";
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Alert,
  Modal,
  SafeAreaView,
  ImageBackground
} from "react-native";
import { FontAwesome, Feather } from  "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import { TouchableOpacity } from "react-native-gesture-handler";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { CommonActions } from '@react-navigation/native';
import * as Authentication from '../../api/auth';

export default function SignInPage({ navigation }) {  
  
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const validationSchema = yup.object().shape({
    Email: yup.string().required().email('Email is invalid'),
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

  const emailValidator = yup.string().required().email();

  const onSignIn = (values) => {
    Keyboard.dismiss();

    Authentication.signIn(
      values,
      (user) => navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{
          name: "Home",
          params: { Username: user.displayName }
        }]
      })),
      (error) => Alert.alert('Invalid User!', 
        'Email or Password is incorrect. Please ensure you have an existing account', [
        {text: 'Dismiss'}
      ])
    );
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
            initialValues={{ Email: "", Password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => onSignIn(values) }
          >
            {(props) => (
              <KeyboardAwareScrollView extraHeight = {50} enableOnAndroid>
                <Text style={styles.email}> Email </Text>
                <View style={styles.action}>
                  <FontAwesome name='at' color="#05375a" size={20} />
                  <TextInput
                    placeholder="Your Email"
                    style={styles.textInput}
                    value={props.values.Email}
                    onChangeText={props.handleChange("Email")}
                    onBlur={props.handleBlur("Email")}
                    autoCorrect = {false}
                    autoCapitalize = 'none'
                    keyboardType = 'email-address' 
                  />

                  { emailValidator.isValidSync(props.values.Email)
                  ? (
                    <Feather name="check-circle" color="green" size={20} />
                  ) : null}
                </View>

                <Text style={styles.errorMsg}>
                  {props.touched.Email && props.errors.Email}
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

                <View style = {styles.signUpInstead}>
                  <Text style = {styles.endText}> Don't have an account? </Text>
                  <TouchableOpacity onPress = {() => navigation.navigate('Sign Up Page')}>
                    <View style = {styles.registerHere}>
                      <Text style = {styles.registerHereText}> Register here! </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Modal visible = {modalOpen} animationType = 'slide'>
                    <StatusBar barStyle = 'dark-content' />
                    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}> 
                    <SafeAreaView style = {styles.modal}>
                      <View style = {styles.modalContent}>
                        <View style = {styles.imageView}>
                          <View style = {styles.ImageBackground}>
                            <ImageBackground
                              source = {require("../../assets/police.png")}
                              style = {{height:180, width:180}}
                              imageStyle= {{borderRadius: 15}}
                            />
                          </View>
                        </View>
                        <Text style = {styles.resetPassword}> Reset Password </Text>
                        <Text style = {styles.resetPasswordSubText}> Enter the email address of your account </Text>
                        <View style={styles.action}>
                          <FontAwesome name='at' color="#05375a" size={20} />
                          <TextInput
                            placeholderTextColor = '#333'
                            placeholder="Your Email"
                            style={styles.textInput}
                            value={props.values.Email}
                            onChangeText={props.handleChange("Email")}
                            onBlur={props.handleBlur("Email")}
                            autoCorrect = {false}
                            autoCapitalize = 'none'
                            keyboardType = 'email-address' 
                          />

                          { emailValidator.isValidSync(props.values.Email)
                          ? (
                            <Feather name="check-circle" color="green" size={20} />
                          ) : null}
                        </View>

                        <Text style={styles.errorMsg}>
                          {props.touched.Email && props.errors.Email}
                        </Text>

                          <TouchableOpacity style = {styles.signIn} onPress = { () => {
                            Authentication.sendPasswordResetEmail(props.values.Email,
                            () => Alert.alert('A password reset email has been sent','',
                             [{text: 'Ok', onPress: () => setModalOpen(false)}]),
                            (error) => Alert.alert(error.message))
                          }}>
                            <Text style = {styles.signInText}> Send a password reset link </Text>
                          </TouchableOpacity>

                          <TouchableOpacity style = {styles.cancelButton} onPress = {() => setModalOpen(false)}>
                            <Text style = {styles.cancelButtonText}> Cancel </Text>
                          </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    </TouchableWithoutFeedback>
                </Modal>
                
                
                <TouchableOpacity style = {styles.forgotPassword} onPress = {() => setModalOpen(true)}>
                  <FontAwesome name = 'key' size = {20} />
                  <Text style = {styles.forgotPasswordText}> Forgot Password? </Text>
                </TouchableOpacity>
                
              </KeyboardAwareScrollView>
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
  email: {
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
  signUpInstead: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  endText: {
    fontSize: 14,
    color: '#777777'
  },
  registerHere: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  registerHereText: {
    fontSize: 14,
    color: '#333'
  },
  modal: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  modalContent: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  imageView: {
    marginTop: 20,
    alignItems:'center',
    marginBottom: 50
  },
  ImageBackground: {
    height:100,
    width: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resetPassword: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  resetPasswordSubText: {
    fontSize: 18,
    marginTop: 5,
    alignSelf: 'center',
    marginBottom: 20
  },
  forgotPassword: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center'
  },
  forgotPasswordText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#cd5c5c',
  },
  cancelButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#4682b4",
    borderWidth: 1,
    marginTop: 15,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "crimson",
  },
});
