import Logo from "@/assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { Button } from "heroui-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import Loading from "./loading";
import { useStore } from "./store";
import { API } from "./theme";

const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const { loading } = useStore();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      Toast.info(message, { position: "top" });
    }
  }, [message]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <ToastManager />

      {/* Header */}
      <View className="items-center justify-center my-6">
        <Image source={Logo} style={{ width: 120, height: 120 }} />
        <Text style={{ fontSize: 28, color: "black", marginTop: 10 }}>
          SK Matrimonial
        </Text>
        <Text style={{ fontSize: 16, color: "black" }}>
          Forgot Password
        </Text>
      </View>

      {/* Form */}
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await axios.post(`${API}forgot-password`, {
              email: values.email,
            });
            console.log(res)
            setMessage(res.data.message);
          } catch (error) {
            setMessage(
              error.response?.data?.message || "Something went wrong"
            );
          } finally {
            setSubmitting(false);
          }
        }}
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
            {/* Email Input */}
            <TextInput
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                padding: 10,
                marginBottom: 5,
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {touched.email && errors.email && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                {errors.email}
              </Text>
            )}

            {/* Submit Button */}
            <Button
              size="md"
              className="mt-4 self-center w-[200px]"
              isDisabled={isSubmitting}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={["#9333ea", "#ec4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Button.Label className="text-white font-bold">
                {isSubmitting ? "Sending..." : "Submit"}
              </Button.Label>
            </Button>

            {/* Back Button */}
            <Button
              onPress={() => router.back()}
              size="sm"
              className="mt-5 self-center w-[200px]"
            >
              <LinearGradient
                colors={["#000000", "#000000"]}
                style={StyleSheet.absoluteFill}
              />
              <Button.Label className="text-white font-bold">
                Back
              </Button.Label>
            </Button>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}
