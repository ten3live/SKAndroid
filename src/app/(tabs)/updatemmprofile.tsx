import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Avatar, Button, Checkbox, Input, TextField } from "heroui-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import cities from "../cities.json";
import codes from "../codes.json";
import countries from "../countriesmin.json";
import SelectComponent from "../select";
import { useStore } from "../store";
import { API } from "../theme";
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
  const { user, refreshUser } = useStore();
  const [country, setCountry] = useState(null);
  const [gender, setgender] = useState("Male");
  const [ccode, setccode] = useState(null);

  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [image, setImage] = useState(null);
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]); // store image object
      setImage(result.assets[0].uri);
    }
  };

  if (user?.role == "guest") {
    return (
      <View className="mt-20 p-5">
        <Text>Only Users , Matchmakers can View This Page</Text>
        <Button className="bg-black mt-5" onPress={() => router.back()}>
          <Button.Label>Back</Button.Label>
        </Button>
      </View>
    );
  }

  const provinces = country ? provinceList(country.value) : [];
  const cityOptions = province ? cityList(province.value) : [];

  const uploadAvatar = async () => {
    try {
      if (!photo?.uri) {
        Toast.error("No image selected");
        return;
      }

      const uri = photo.uri;
      const filename =
        photo.fileName || uri.split("/").pop() || `avatar-${Date.now()}.jpg`;

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1].toLowerCase()}` : "image/jpeg";

      const img = {
        uri,
        name: filename,
        type,
      };

      const formData = new FormData();
      formData.append("avatar", img);

      const res = await axios.post(
        `${API}updateimage/${user?.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Toast.success(res.data?.message || "Avatar uploaded successfully!");

      await refreshUser(user?.userId);
    } catch (err) {
      console.log("Upload error:", err.response?.data || err.message);

      Toast.error(
        err.response?.data?.message || err.message || "Upload failed",
      );
    }
  };

  const formatNumber = (number) => {
    if (number.startsWith("0")) {
      return number.slice(1);
    } else {
      return number;
    }
  };
  return (
    <>
      <ToastManager />
      <Formik
        initialValues={{
          status: user?.status,
          role: user?.role,
          gender: user?.gender,
          ccode: user?.ccode,
          country: user?.country,
          province: user?.province,
          city: user?.city,
          name: user?.name,
          phone: user?.phone,
          email: user?.email,
          password: user?.password,
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const newvalues = {
            ccode: values?.ccode ? values?.ccode : user?.ccode,
            role: values?.role ? values?.role : user?.role,
            status: values?.status ? values?.status : user?.status,
            city: values?.city ? values?.city : user?.city,
            country: values?.country ? values?.country : user?.country,
            email: values?.email ? values?.email : user?.email,
            gender: values?.gender ? values?.gender : user?.gender,
            name: values?.name,
            password: values?.password,
            phone: formatNumber(values?.phone),
            province: values?.province ? values?.province : user?.province,
          };
          const result = await axios.put(
            `${API}updateuser/${user && user?.userId}`,
            newvalues,
          );
          if (result.status == 200) {
            return Toast.success("User Updated");
          }
          refreshUser(user && user?.userId);
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
          <ScrollView className="p-5 ">
            {user?.role == "guest" ? (
              <View></View>
            ) : (
              <>
                <TouchableOpacity
                  onPress={pickImage}
                  className="items-center justify-center my-4"
                >
                  <Avatar
                    alt="profile"
                    className="w-[120px] h-[120px] mt-2 rounded-full"
                  >
                    <Avatar.Image
                      source={
                        image !== null
                          ? { uri: image }
                          : { uri: `${API}uploads/${user?.avatar}` }
                      }
                      className="w-full h-full"
                      resizeMode="cover"
                    ></Avatar.Image>
                    <Avatar.Fallback>
                      <Ionicons name="person" size={28} />
                    </Avatar.Fallback>
                  </Avatar>
                </TouchableOpacity>
                <Text
                  className="text-base text-center text-purple-600 my-2"
                  onPress={pickImage}
                >
                  Select Profile Picture
                </Text>
                <View className="self-center w-[50%]">
                  <Button size="sm" onPress={() => uploadAvatar()}>
                    <LinearGradient
                      colors={["#000000", "#111111"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Button.Label>Update Image</Button.Label>
                  </Button>
                </View>
              </>
            )}

            <View className="flex-row gap-5 mt-5 self-center justify-between">
              <View className="flex-row gap-5">
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

                <View className="">
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
                title={user?.ccode}
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
                title={user?.country}
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
                title={user?.province}
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
                title={user?.city}
                data={cityOptions}
                value={city}
                onChange={(item) => {
                  setFieldValue("city", item.value);
                  setCity(item);
                }}
              />
              {/* ---------- REGISTER BUTTON ---------- */}
            </View>

            {user?.role == "guest" ? (
              <View></View>
            ) : (
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
                  {isSubmitting ? "Updating..." : "Update"}
                </Button.Label>
              </Button>
            )}
            {/* Login Button */}
            <Button
              onPress={() => router.back()}
              size="sm"
              className="mt-5 self-center w-[200px]"
            >
              <LinearGradient
                colors={["#000000", "#111111"]}
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
