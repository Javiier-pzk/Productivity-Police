import React, { useState, useEffect } from "react";
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
  Platform,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import * as Authentication from "../../api/auth";
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import * as Profile from '../../api/profile';

export default function EditProfileScreen({ navigation }) {
  const [image, setImage] = useState(Authentication.getCurrentUserPhoto());
  const bs = React.createRef();
  const fall = new Animated.Value(1);

  const validationSchema = yup.object({
    Username: yup.string().required().min(4).max(20),
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}> Upload Photo </Text>
        <Text style={styles.panelSubtitle}> Choose your profile photo </Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
      >
        <Text style={styles.panelButtonTitle}> Take Photo </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takephotoFromGallery}
      >
        <Text style={styles.panelButtonTitle}> Choose From Library </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          Authentication.removePhoto();
          setImage(null);
          bs.current.snapTo(1);
        }}
      >
        <Text style={styles.panelButtonTitle}> Remove Current Photo </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelCancelButton}
        onPress={() => bs.current.snapTo(1)}
      >
        <Text style={styles.panelCancelTitle}> Cancel </Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "You have not granted permission",
            "You can grant permission in your phone settings",
            [{ text: "Ok" }]
          );
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "You have not granted permission",
            "You can edit permission preferences in your phone settings",
            [{ text: "Ok" }]
          );
        }
      }
    })();
  }, []);

  const takePhotoFromCamera = async () => {
    bs.current.snapTo(1);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takephotoFromGallery = async () => {
    bs.current.snapTo(1);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = (values) => {
    const username = values.Username;
    values.Image = image;
    Alert.alert("Proceed with changes?", "", [
      {
        text: "Yes",
        onPress: () => {
          Authentication.updateProfile(values);
          Profile.updateUsernameAndPhoto(
            username,
            image, 
            Authentication.getCurrentUserId(),
            () => {}, 
            (error) => Alert.alert(error.message)
          );
          navigation.navigate("Account Details", values);
        },
      },
      {
        text: "No",
        style: "destructive",
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        bs.current.snapTo(1);
      }}
    >
      <View style={styles.container}>
        <BottomSheet
          ref={bs}
          snapPoints={[400, 0]}
          callbackNode={fall}
          initialSnap={1}
          renderContent={renderContent}
          renderHeader={renderHeader}
          enabledBottomInitialAnimation={true}
        />
        <Animated.View
          style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}
        >
          <View style={styles.imageView}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                bs.current.snapTo(0);
              }}
            >
              <View style={styles.ImageBackground}>
                {image === null ? (
                  <ImageBackground
                    source={require("../../assets/police.png")}
                    style={{ height: 180, width: 180 }}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <View style={styles.cameraOverlay}>
                      <FontAwesome
                        name="camera"
                        size={80}
                        color="#fff"
                        style={styles.camera}
                      />
                    </View>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={{ uri: image }}
                    style={{ height: 150, width: 150 }}
                    imageStyle={{ borderRadius: 150 }}
                  >
                    <View style={styles.cameraOverlay}>
                      <FontAwesome
                        name="camera"
                        size={80}
                        color="#fff"
                        style={styles.camera}
                      />
                    </View>
                  </ImageBackground>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.imageText}> Change profile photo </Text>
          </View>

          <View style={styles.userInfoView}>
            <Formik
              initialValues={{
                Username: Authentication.getCurrentUserName(),
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {(props) => (
                <View>
                  <Text style={styles.userInfoText}> Update Username </Text>
                  <View style={styles.userInfo}>
                    <FontAwesome name="user-o" size={20} color="#05375a" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter new Username"
                      value={props.values.Username}
                      onChangeText={props.handleChange("Username")}
                      onBlur={props.handleBlur("Username")}
                      autoCorrect={false}
                    />
                    {props.values.Username.length >= 4 &&
                    props.values.Username.length <= 20 ? (
                      <Feather name="check-circle" color="green" size={20} />
                    ) : null}
                  </View>

                  <Text style={styles.errorMsg}>
                    {props.touched.Username && props.errors.Username}
                  </Text>

                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.edit}
                      onPress={async () => {
                        await Authentication.sendVerificationEmail();
                        Alert.alert(
                          "A verification email has been sent",
                          "Please verify your email",
                          [{ text: "Ok" }]
                        );
                      }}
                    >
                      <Text style={styles.editText}> Verify Email </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.edit, { marginTop: 15 }]}
                      onPress={() => navigation.navigate("Change Password")}
                    >
                      <Text style={styles.editText}> Change Password </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 50 }}>
                    <TouchableOpacity
                      style={styles.done}
                      onPress={() => props.handleSubmit()}
                    >
                      <Text style={styles.doneText}> Done </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
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
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    opacity: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    marginTop: 45,
    color: "#05375a",
    fontSize: 18,
  },
  userInfoView: {
    paddingHorizontal: 30,
    marginBottom: 25,
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
  edit: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4682b4",
    //backgroundColor: "#4682b4",
  },
  done: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682b4",
  },
  editText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4682b4",
  },
  doneText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#4682b4",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  panelCancelButton: {
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4682b4",
    alignItems: "center",
    marginVertical: 7,
  },
  panelCancelTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "crimson",
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  footer: {
    alignItems: "flex-end",
    height: 40,
    backgroundColor: "#fff",
  },
});
