import Logo from "@/assets/skavatar.png";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Button, Checkbox, Input, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import cities from "./cities.json";
import codes from "./codes.json";
import countries from "./countriesmin.json";
import Loading from "./loading";
import SelectComponent from "./select";
import { useStore } from "./store";
import { API } from "./theme";
const schema = Yup.object().shape({
  role: Yup.string(),
  gender: Yup.string(),
  ccode: Yup.string(),
  country: Yup.string(),
  province: Yup.string(),
  city: Yup.string(),
  name: Yup.string(),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string(),
  password: Yup.string().required("Password is required"),
});

// Convert country JSON to your format
const countryList = countries?.map((c) => ({
  label: c.name,
  value: c.name,
}));

// Provinces based on selected country
const provinceList = (countryName) => {
  const c = countries.find((x) => x.name === countryName);
  if (!c) return [];
  return c?.provinces?.map((p) => ({ label: p, value: p }));
};

// Cities based on selected province
const cityList = (provinceName) => {
  return cities
    ?.filter((c) => c.state_name === provinceName)
    .map((city) => ({
      label: city.city_name,
      value: city.city_name,
    }));
};

export default function App() {
  const { loading, setLoading } = useStore();
  const [country, setCountry] = useState(null);
  const [message, setmessage] = useState(null);
  const [role, setrole] = useState("user");
  const [gender, setgender] = useState("Male");
  const [ccode, setccode] = useState(null);

  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [image, setImage] = useState(null);
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const source = result.assets[0];
      setPhoto(source);
      setImage(result.assets[0].uri);
    }
  };

  const provinces = country ? provinceList(country.value) : [];
  const cityOptions = province ? cityList(province.value) : [];
  const showToasts = () => {
    Toast.info(`${message}`, { position: "top" });
  };
  useEffect(() => {
    message !== null && showToasts();
  }, [message]);

  if (loading == true) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <ToastManager />
      <Formik
        initialValues={{
          role: "user",
          gender: "Male",
          ccode: "",
          country: "",
          province: "",
          city: "",
          name: "",
          phone: "",
          email: "",
          password: "",
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const prepareImageForUpload = (image) => {
            if (!image) return null;

            let uri = image.uri;
            let filename = uri.split("/").pop();

            // Infer MIME type
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            return { uri, name: filename, type };
          };

          const formData = new FormData();
          formData.append("name", values?.name);
          formData.append("ccode", values?.ccode);
          formData.append("phone", parseInt(values?.phone));
          formData.append("email", values?.email);
          formData.append("password", values?.password);
          formData.append("role", values?.role);
          formData.append("status", "new");
          formData.append("gender", values?.gender);
          formData.append("city", values?.city);
          formData.append("province", values?.province);
          formData.append("country", values?.country);

          // Handle image
          if (photo) {
            const img = prepareImageForUpload(photo);
            formData.append("avatar", img);
          }
          try {
            const res = await axios({
              method: "post",
              url: `${API}register`,
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.status == 200 || res.status == 201) {
              // 1. Show the success toast immediately
              const successMsg = res.data.message || "Registration Successful!";
              Toast.success(`${successMsg}. Redirecting in 5 seconds...`, {
                position: "top",
                duration: 5000, // Ensure toast stays visible
              });

              // 2. Start the 5-second countdown to go back
              setTimeout(() => {
                router.back();
              }, 5000);
            }
          } catch (err) {
            let errorMessage = "Something went wrong";

            if (err.response) {
              errorMessage =
                err.response.data.message ||
                err.response.data.error ||
                "Conflict Error";
              console.log("Backend Error:", err.response.data);
            } else {
              errorMessage = err.message;
            }
            // Trigger toast IMMEDIATELY
            Toast.error(errorMessage, { position: "top" });
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <ScrollView className="p-5">
            <TouchableOpacity
              onPress={pickImage}
              className="items-center justify-center my-4"
            >
              <Image
                source={photo !== null ? { uri: image } : Logo}
                className="w-[120px] h-[120px] mt-4 rounded-full"
              />
            </TouchableOpacity>
            <Text
              className="text-base text-center text-yellow-600"
              onPress={pickImage}
            >
              Select Profile Picture
            </Text>
            <View className="flex-row gap-5 self-center justify-between">
              <View className="mt-2">
                <View className="flex-row justify-start items-center gap-1  ">
                  <Checkbox
                    isSelected={gender === "Male"}
                    onSelectedChange={() => {
                      setgender("Male");
                      setFieldValue("gender", "Male"); // ✅ FIXED
                    }}
                  />

                  <Text>Male</Text>
                </View>

                <View className="flex-row justify-start items-center gap-1 mt-4">
                  <Checkbox
                    isSelected={role === "user"}
                    onSelectedChange={() => {
                      setrole("user");
                      setFieldValue("role", "user"); // ✅ FIXED
                    }}
                  />
                  <Text>Candidate</Text>
                </View>
              </View>
              <View className="mt-2">
                <View className="flex-row justify-start items-center gap-1">
                  <Checkbox
                    isSelected={gender === "Female"}
                    onSelectedChange={() => {
                      setgender("Female");
                      setFieldValue("gender", "Female"); // ✅ FIXED
                    }}
                  />

                  <Text>Female</Text>
                </View>
                <View className="flex-row justify-start items-center gap-1 mt-4">
                  <Checkbox
                    isSelected={role === "matchmaker"}
                    onSelectedChange={() => {
                      setrole("matchmaker");
                      setFieldValue("role", "matchmaker"); // ✅ FIXED
                    }}
                  />
                  <Text>Matchmaker</Text>
                </View>
              </View>
            </View>

            <View className="mt-5">
              {/* ---------- INPUT FIELDS ---------- */}
              <FormikInput
                label="Name"
                value={values?.name}
                onChange={handleChange("name")}
                error={touched.name && errors.name}
                placeholder="Enter your name"
              />

              <SelectComponent
                title="Country Code"
                data={codes}
                value={ccode}
                onChange={(item) => {
                  setccode(item);
                  setFieldValue("ccode", item.value);
                }}
              />
              <FormikInput
                keyboard="numeric"
                label="Phone"
                value={values?.phone}
                onChange={(item) => setFieldValue("phone", parseInt(item))}
                error={touched.phone && errors.phone}
                placeholder="Enter your phone"
              />

              <FormikInput
                label="Email"
                value={values?.email}
                onChange={handleChange("email")}
                error={touched.email && errors.email}
                placeholder="Enter your email"
              />

              <FormikInput
                label="Password"
                value={values?.password}
                onChange={handleChange("password")}
                error={touched.password && errors.password}
                placeholder="Enter password"
                secure
              />
              {/* COUNTRY */}
              <SelectComponent
                title="Select Country"
                data={countryList}
                value={country}
                onChange={(item) => {
                  setCountry(item);
                  setFieldValue("country", item.value);
                  setProvince(null);
                  setCity(null);
                }}
              />
              {/* PROVINCE */}
              <SelectComponent
                title="Select Province"
                data={provinces}
                value={province}
                onChange={(item) => {
                  setProvince(item);
                  setFieldValue("province", item.value);
                  setCity(null);
                }}
              />

              {/* CITY */}
              <SelectComponent
                title="Select City"
                data={cityOptions}
                value={city}
                onChange={(item) => {
                  setFieldValue("city", item.value);
                  setCity(item);
                }}
              />
              {/* ---------- REGISTER BUTTON ---------- */}
            </View>

            <Button
              size="md"
              className="mt-5 self-center w-[200px]"
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
                {isSubmitting ? "Registering..." : "Register"}
              </Button.Label>
            </Button>

            {/* Login Button */}
            <Button
              onPress={() => router.back()}
              size="sm"
              className="mt-5 self-center w-[200px]"
            >
              <LinearGradient
                colors={["#000000", "#000000"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Button.Label className="text-white font-bold">Back</Button.Label>
            </Button>

            <StatusBar style={"light"} />
            <View className="mt-30"></View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
}

/* ------------------ FORM INPUT COMPONENT ------------------ */
function FormikInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  keyboard = "default",
  secure = false,
}) {
  return (
    <View className="mt-2">
      <TextField>
        <Input
          keyboardType={keyboard}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          secureTextEntry={secure}
        />
      </TextField>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
