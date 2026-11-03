import Logo from "@/assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { StatusBar } from "expo-status-bar";
import { Button, Input, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "./loading";

import axios from "axios";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useStore } from "./store";
import { API } from "./theme";

const LoginSchema = Yup.object().shape({
  phone: Yup.string().required().label("Phone"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function App() {
  const {
    user,
    setUser,
    count,
    increase,
    mode,
    isLoggedIn,
    setIsLoggedIn,
    loading,
    setLoading,
  } = useStore();

  const [visibility, setvisibility] = useState("hidden");
  const [message, setmessage] = useState(null);
  const LoginU = () => {
    setUser({
      address: null,
      adminrole: null,
      area: null,
      avatar: "1730684850805-me.jpg",
      businessname: null,
      ccode: "+92",
      cdate: "2025-05-01T03:58:57.000Z",
      charges: null,
      city: "Kandiaro",
      cnic: null,
      country: "Pakistan",
      description: null,
      email: "ten3live@gmail.com",
      fb: null,
      fees: null,
      gender: "Male",
      groupname: null,
      groupowner: null,
      id: 641,
      ig: null,
      landline: null,
      name: "Sajjad Ali",
      nonreg: null,
      password: "sajjadali7",
      phone: "3058452372",
      province: "Sindh",
      reggov: null,
      reggroup: null,
      role: "user",
      status: "enabled",
      tt: null,
      udate: "2024-11-04T01:47:30.000Z",
      userId: "sk00311",
      verified: "yes",
      whatsapp: null,
      workarea: null,
      workingas: null,
      workname: null,
      yt: null,
    });
    setIsLoggedIn(true);
    router.replace("/(tabs)/home");
  };
  const LoginMM = () => {
    setUser({
      address: null,
      adminrole: null,
      area: null,
      avatar: "1730684850805-me.jpg",
      businessname: null,
      ccode: "+92",
      cdate: "2025-05-01T03:58:57.000Z",
      charges: null,
      city: "Kandiaro",
      cnic: null,
      country: "Pakistan",
      description: null,
      email: "ten3live@gmail.com",
      fb: null,
      fees: null,
      gender: "Male",
      groupname: null,
      groupowner: null,
      id: 641,
      ig: null,
      landline: null,
      name: "Sajjad Ali",
      nonreg: null,
      password: "sajjadali7",
      phone: "3058452372",
      province: "Sindh",
      reggov: null,
      reggroup: null,
      role: "matchmaker",
      status: "enabled",
      tt: null,
      udate: "2024-11-04T01:47:30.000Z",
      userId: "sk00311",
      verified: "no",
      whatsapp: null,
      workarea: null,
      workingas: null,
      workname: null,
      yt: null,
    });
    setIsLoggedIn(true);
    router.replace("/(tabs)/home");
  };
  const LoginG = () => {
    setUser({
      address: null,
      adminrole: null,
      area: null,
      avatar: "default",
      businessname: null,
      ccode: "+92",
      cdate: "2025-05-01T03:58:57.000Z",
      charges: null,
      city: "Karachi",
      cnic: null,
      country: "Pakistan",
      description: null,
      email: "abc@gmail.com",
      fb: null,
      fees: null,
      gender: "Male",
      groupname: null,
      groupowner: null,
      id: 100,
      ig: null,
      landline: null,
      name: "Guest",
      nonreg: null,
      password: "guest",
      phone: "3050000000",
      province: "Sindh",
      reggov: null,
      reggroup: null,
      role: "guest",
      status: "enabled",
      tt: null,
      udate: "2024-11-04T01:47:30.000Z",
      userId: "sk00000",
      verified: "no",
      whatsapp: null,
      workarea: null,
      workingas: null,
      workname: null,
      yt: null,
    });
    setIsLoggedIn(true);
    router.replace("/(tabs)/home");
  };
  const LogOut = () => {
    setUser(null);
    setIsLoggedIn(false);
  };
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${API}login`, {
        phone: parseInt(values?.phone),
        password: values?.password,
      });
      setmessage(res.data.message);
      console.log(res.status);

      if (res.data.data.status == "enabled" || res.data.data.role == "admin") {
        setLoading(true);
        setIsLoggedIn(true);
        setUser(res.data.data);
        router.replace("/(tabs)/home");
      } else {
        setmessage(`Account is not approved yet \n Please Contact Admin`);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setmessage("Please enter correct phone and password");
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const showToasts = () => {
    Toast.info(`${message}`, { position: "top" });
  };
  useEffect(() => {
    message !== null && showToasts();
  }, [message]);

  const handleVisible = () => {
    visibility == "hidden" ? setvisibility("visible") : setvisibility("hidden");
  };
  if (loading == true) {
    return (
      <>
        <Loading />
      </>
    );
  }
  return (
    <ScrollView className="p-5">
      <ToastManager />
      <View className="items-center justify-center my-4">
        <Image source={Logo} className="w-[120px] h-[120px] mt-4 rounded" />
        <Text
          style={{
            color: "black",
            fontSize: 28,
            textAlign: "center",
          }}
        >
          SK Matrimonial
        </Text>
        <Text
          className=""
          style={{
            color: "black",
            fontSize: 16,
            textAlign: "center",
            fontFamily: "GreatVibes",
          }}
        >
          Candidates/Match Makers Login Here
        </Text>
      </View>

      <Formik
        initialValues={{ phone: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            {/* phone Field */}
            <TextField className="mt-5">
              <Input
                placeholder="Enter your phone"
                value={values?.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                keyboardType="numeric"
                autoCapitalize="none"
              />
              {errors.phone && touched.phone && (
                <Text className="text-red-500 mt-1 text-sm">
                  {errors.phone}
                </Text>
              )}
            </TextField>

            {/* Password Field */}
            <TextField className="mt-2">
              <Input
                placeholder="Enter password"
                secureTextEntry
                value={values?.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              {errors.password && touched.password && (
                <Text className="text-red-500 mt-1 text-sm">
                  {errors.password}
                </Text>
              )}
            </TextField>
            <Text className="text-red-500 mt-1 text-sm text-center">
              {message !== null && message}
            </Text>
            <Button
              size="md"
              className="mt-5 self-center w-[200px]"
              isDisabled={isSubmitting}
              onPress={() => handleSubmit()}
            >
              <LinearGradient
                colors={["#9333ea", "#ec4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Button.Label className="text-white font-bold">
                {isSubmitting ? "Loading..." : "Login"}
              </Button.Label>
            </Button>

            {/* Register Button */}
            <Button
              onPress={() => router.push("./register")}
              size="sm"
              className="mt-5 self-center w-[200px]"
            >
              <LinearGradient
                colors={["#000000", "#000000"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Button.Label className="text-white font-bold">
                Register
              </Button.Label>
            </Button>

            <TouchableOpacity
              onPress={handleVisible}
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <Text>
                {visibility == "hidden"
                  ? "Forgot Password ?"
                  : "Contact Admin +92 332 3661898"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
              <Text> Forgot Password ?</Text>
            </TouchableOpacity>

            <Button variant="ghost" onPress={() => LoginG()}>
              <Button.Label>Login as Guest</Button.Label>
            </Button>
            <Button variant="ghost" onPress={() => LoginU()}>
              <Button.Label>Login as User</Button.Label>
            </Button>
            <Button variant="ghost" onPress={() => LoginMM()}>
              <Button.Label>Login as MM</Button.Label>
            </Button>
            <StatusBar style={"light"} />
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
// import React, { useState } from 'react';
// import { View, TextInput, Button, Text } from 'react-native';
// import axios from 'axios';
// import { API } from './theme';

// export default function ResetPasswordScreen({ route }) {
//   const { token } = route.params;
//   const [newPassword, setNewPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleResetPassword = async () => {
//     try {
//       const res = await axios.post(`${API}reset-password`, { token, newPassword });
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response.data.message || 'Error');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         placeholder="Enter new password"
//         value={newPassword}
//         onChangeText={setNewPassword}
//         style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
//       />
//       <Button title="Reset Password" onPress={handleResetPassword} />
//       {message && <Text style={{ marginTop: 10 }}>{message}</Text>}
//     </View>
//   );
// }
