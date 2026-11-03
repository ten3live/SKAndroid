import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { Formik } from "formik";
import { Button, Checkbox, Input, TextField } from "heroui-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import SelectComponent from "../select";

import { useStore } from "../store";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useIsFocused } from "expo-router/react-navigation";
import cities from "../cities.json";
import countries from "../countriesmin.json";
import { API } from "../theme";

export default function App() {
  const {
    user,
    uclength,
    userclients,
    refreshMyClients,
    refreshMyClientsCount,
    loading,
    setLoading,
  } = useStore();
  const [country, setCountry] = useState(null);
  const [rcountry, setRCountry] = useState(null);
  const [rprovince, setRProvince] = useState(null);
  const [rmstatus, setrmstatus] = useState(null);

  const [rcity, setRCity] = useState(null);

  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);

  const [education, seteducation] = useState(null);
  const [reducation, setreducation] = useState(null);
  const [mstatus, setmstatus] = useState(null);
  const [image, setImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoa, setPhotoa] = useState(null);
  const [photob, setPhotob] = useState(null);
  const [photoaa, setPhotoaa] = useState(null);
  const [photobb, setPhotobb] = useState(null);
  const [selectedsharetype, setsharetype] = useState(null);
  const [selectedtype, settype] = useState(null);
  const [selectedprio, setselectedprio] = useState(null);
  const [selectedfor, setselectedfor] = useState(null);

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
  const isFocussed = useIsFocused();
  useEffect(() => {
    if (isFocussed) {
      refreshMyClientsCount(user?.userId);
    }
  }, [isFocussed]);

  useFocusEffect(
    useCallback(() => {
      refreshMyClientsCount(user?.userId);
    }, []),
  );

  const provinces = country ? provinceList(country.value) : [];
  const cityOptions = province ? cityList(province.value) : [];
  const rprovinces = rcountry ? provinceList(rcountry.value) : [];
  const rcityOptions = rprovince ? cityList(rprovince.value) : [];

  const maritalStatus = [
    { label: "Single", value: "Single" },
    { label: "Divorced", value: "Divorced" },
    { label: "DivorcedChild", value: "DivorcedChild" },
    { label: "Nikkah Break", value: "Nikkah Break" },
    { label: "Widowed", value: "Widowed" },
    { label: "Separated", value: "Separated" },
    { label: "Second Marriage", value: "Second Marriage" },
  ];

  const educationlist = [
    { label: "All", value: "" },
    { label: "Primary/Nursery/KG", value: "Primary/Nursery/KG" },
    { label: "Matric/O-level", value: "Matric/O-level" },
    { label: "Intermediate/A-Level", value: "Intermediate/A-Level" },
    { label: "Bachelor/BSc", value: "Bachelor/BSc" },
    { label: "Master/MA/MSc", value: "Master/MA/MSc" },
    { label: "Ms/M.Phil", value: "Ms/MPhil" },
    { label: "Doctorate", value: "Doctorate" },
    { label: "Professional/CA/ACCA etc.", value: "Professional/CA/ACCA etc." },
    { label: "Diploma/Cert-Matric", value: "Diploma/Cert-Matric" },
    { label: "Diploma/Cert-Intermediate", value: "Diploma/Cert-Intermediate" },
    { label: "Major Training-Medical", value: "Major Training-Medical" },
  ];

  /* ------------------ INITIAL VALUES ------------------ */
  const initialValues = {
    gender: "Male",
    matchmakerid: user?.userId,
    matchmakername: user?.name,
    matchmakerphoto: user?.avatar,
    name: "",
    age: "",
    height: "",
    ccode: user?.ccode,
    contact: user?.contact,
    cast: "",
    maslak: "",
    complexion: "",
    maritalstatus: "",
    divorcereason: "",
    children: "",
    education: "",
    educationbrief: "",
    job: "",
    business: "",
    income: "",
    language: "",
    belongs: "",
    country: "",
    province: "",
    city: "",
    area: "",
    familystatus: "",
    fulladdress: "",
    hometype: "",
    homesize: "",
    father: "",
    mother: "",
    brothers: "",
    sisters: "",
    reqage: "",
    reqageto: "",
    reqcast: "",
    reqmaslak: "",
    reqheight: "",
    reqfamilystatus: "",
    reqmaritalstatus: "",
    reqeducation: "",
    reqcity: "",
    reqprovince: "",
    reqcountry: "",
    proptype: "",
    shareamount: "",
    amount: "",
    propfor: "",
    propprio: "",
    description: "",
    role: user?.role,
    avatar: null,
    photo1: null,
    photo2: null,
  };

  /* ------------------ STEP VALIDATION ------------------ */
  const stepSchemas = [
    Yup.object({
      name: Yup.string().required("Name required"),
      maritalstatus: Yup.string().required("Name required"),
      age: Yup.string().required("Age required"),
      gender: Yup.string().required("Select gender"),
    }),
  ];

  const [step, setStep] = useState(0);
  const prepareImageForUpload = (image) => {
    if (!image) return null;

    let uri = image.uri;
    let filename = uri.split("/").pop();

    // Infer MIME type
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    return { uri, name: filename, type };
  };
  return (
    <>
      <ToastManager />
      <Formik
        initialValues={initialValues}
        validationSchema={stepSchemas[step]}
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append("matchmakerid", user?.userId);
          formData.append("matchmakername", user?.name);
          formData.append("matchmakerphoto", user?.avatar);
          formData.append("gender", values?.gender);
          formData.append("name", values?.name);
          formData.append("age", values?.age);
          formData.append("height", values?.height);
          formData.append("ccode", user?.ccode);
          formData.append("contact", user?.phone);
          formData.append("cast", values?.cast);
          formData.append("maslak", values?.maslak);
          formData.append("complexion", values?.complexion);
          formData.append("maritalstatus", values?.maritalstatus);
          formData.append("divorcereason", values?.divorcereason);
          formData.append("children", values?.children);
          formData.append("education", values?.education);
          formData.append("educationbrief", values?.educationbrief);
          formData.append("job", values?.job);
          formData.append("business", values?.business);
          formData.append("income", values?.income);
          formData.append("language", values?.language);
          formData.append("belongs", values?.belongs);
          formData.append("country", values?.country);
          formData.append("province", values?.province);
          formData.append("city", values?.city);
          formData.append("area", values?.area);
          formData.append("familystatus", values?.familystatus);
          formData.append("fulladdress", values?.fulladdress);
          formData.append("hometype", values?.hometype);
          formData.append("homesize", values?.homesize);
          formData.append("father", values?.father);
          formData.append("mother", values?.mother);
          formData.append("brothers", values?.brothers);
          formData.append("sisters", values?.sisters);
          formData.append("reqage", values?.reqage);
          formData.append("reqageto", values?.reqageto);
          formData.append("reqcast", values?.reqcast);
          formData.append("reqmaslak", values?.reqmaslak);
          formData.append("reqheight", values?.reqheight);
          formData.append("reqfamilystatus", values?.reqfamilystatus);
          formData.append("reqmaritalstatus", values?.reqmaritalstatus);
          formData.append("reqeducation", values?.reqeducation);
          formData.append("reqcity", values?.reqcity);
          formData.append("reqprovince", values?.reqprovince);
          formData.append("reqcountry", values?.reqcountry);
          formData.append("proptype", values?.proptype);
          formData.append("shareamount", values?.shareamount);
          formData.append("amount", values?.amount);
          formData.append("propfor", values?.propfor);
          formData.append("propprio", values?.propprio);
          formData.append("description", values?.description);
          formData.append("role", user?.role);

          if (photo) {
            const img = prepareImageForUpload(photo);
            formData.append("avatar", img);
          }
          if (photoa) {
            const img1 = prepareImageForUpload(photoaa);
            formData.append("photo1", img1);
          }
          if (photob) {
            const img2 = prepareImageForUpload(photobb);
            formData.append("photo2", img2);
          }

          // console.log(formData)
          const response = await axios({
            method: "post",
            url: `${API}clients/add`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.status === 200 || response.status === 201) {
            setStep(0);

            Toast.success("Client Created", { duration: 5000 });

            setTimeout(() => {
              router.back(); // ⬅️ navigate AFTER 5 seconds
            }, 5000);
          }
        }}
      >
        {(formik) => (
          <ScrollView className="p-5">
            {/* STEP HEADER */}
            <Text className="text-xl font-bold mb-2">Step {step + 1} of 3</Text>

            {/* PROGRESS BAR */}
            <View className="flex-row mb-5">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className={`flex-1 h-2 mx-1 rounded ${
                    i <= step ? "bg-purple-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </View>

            {/* STEP CONTENT */}
            {step === 0 && <StepPersonal formik={formik} />}
            {step === 1 && <StepAddress formik={formik} />}
            {step === 2 && <StepRequirements formik={formik} />}

            {/* NAVIGATION */}
            <View className="flex-row justify-between mt-6 mb-20">
              {step >= 0 && (
                <Button
                  onPress={() => {
                    if (step === 0) {
                      return router.push("/(tabs)/home");
                    } else {
                      setStep(step - 1);
                    }
                  }}
                >
                  <LinearGradient
                    colors={["#000000", "#000000"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Button.Label>Back</Button.Label>
                </Button>
              )}
              {/* {step > 0 && (
              <Button onPress={() => setStep(step - 1)}>
                <LinearGradient
            colors={["#000000", "#000000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
                <Button.Label>Back</Button.Label>
              </Button>
            )} */}
              {user?.role == "user" && uclength < 1 && (
                <View>
                  <Button
                    onPress={() => {
                      if (step === 2) {
                        formik.handleSubmit();
                      } else {
                        formik.validateForm().then((errors) => {
                          if (Object.keys(errors).length === 0) {
                            setStep(step + 1);
                          }
                        });
                      }
                    }}
                  >
                    <LinearGradient
                      colors={["#9333ea", "#ec4899"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Button.Label>
                      {step === 2 ? "Add Client" : "Next"}
                    </Button.Label>
                  </Button>
                </View>
              )}

              {user?.role == "guest" && <View></View>}
              {user?.role == "matchmaker" && (
                <Button
                  onPress={() => {
                    if (step === 2) {
                      formik.handleSubmit();
                    } else {
                      formik.validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          setStep(step + 1);
                        }
                      });
                    }
                  }}
                >
                  <LinearGradient
                    colors={["#9333ea", "#ec4899"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Button.Label>
                    {step === 2 ? "Add Client" : "Next"}
                  </Button.Label>
                </Button>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
  function StepPersonal({ formik }) {
    const { values, handleChange, errors, touched, setFieldValue } = formik;

    const shareType = [
      { label: "Own", value: "Own" },
      { label: "Sharing Local", value: "Sharing Local" },
      { label: "Sharing Abroad", value: "Sharing Abroad" },
    ];

    const propPrio = [
      { label: "Low", value: "Low" },
      { label: "Normal", value: "Normal" },
      { label: "Urgent", value: "Urgent" },
      { label: "Very Urgent", value: "Very Urgent" },
    ];

    const sharing = [
      { label: "No Sharing", value: "No Sharing" },
      { label: "Will Give Sharing", value: "Will Give Sharing" },
      { label: "Will Get Sharing", value: "Will Get Sharing" },
    ];

    const propFor = [
      { label: "Local To Local", value: "Local To Local" },
      { label: "Local To Abroad", value: "Local To Abroad" },
      { label: "Abroad To Local", value: "Abroad To Local" },
      { label: "Abroad To Abroad", value: "Abroad To Abroad" },
      { label: "Both Local & Abroad", value: "Both Local & Abroad" },
    ];

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
        setPhoto(result.assets[0]);
        setImage(result.assets[0].uri);
      }
    };
    const pickImagea = async () => {
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
        setPhotoaa(result.assets[0]);
        setPhotoa(result.assets[0].uri);
      }
    };
    const pickImageb = async () => {
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
        setPhotobb(result.assets[0]);
        setPhotob(result.assets[0].uri);
      }
    };
    if (user?.role == "guest") {
      return (
        <View>
          <Text>Guest don't have permission to add Client</Text>
        </View>
      );
    } else if (user?.role == "user" && uclength > 0) {
      return (
        <View>
          <Text>Candidate can add only one Client</Text>
        </View>
      );
    }

    return (
      <>
        <View>
          <ScrollView
            horizontal
            style={{ display: "flex", flexDirection: "row" }}
          >
            <TouchableOpacity
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                backgroundColor: "#808080",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                alignContent: "center",
                margin: 10,
                marginLeft: 50,
              }}
              onPress={pickImage}
            >
              {photo ? (
                <>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 100,
                    }}
                  />
                </>
              ) : (
                <MaterialCommunityIcons
                  name="account-box-outline"
                  size={50}
                  color="white"
                />
              )}
            </TouchableOpacity>
            {photo && (
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  backgroundColor: "#808080",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                  margin: 10,
                }}
                onPress={pickImagea}
              >
                {photoa ? (
                  <>
                    <Image
                      source={{ uri: photoa }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 100,
                      }}
                    />
                  </>
                ) : (
                  <MaterialCommunityIcons
                    name="account-box-outline"
                    size={50}
                    color="white"
                  />
                )}
              </TouchableOpacity>
            )}
            {photoa && (
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  backgroundColor: "#808080",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                  margin: 10,
                }}
                onPress={pickImageb}
              >
                {photob ? (
                  <>
                    <Image
                      source={{ uri: photob }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 100,
                      }}
                    />
                  </>
                ) : (
                  <MaterialCommunityIcons
                    name="account-box-outline"
                    size={50}
                    color="white"
                  />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
          <Button
            className="mt-5 self-center text-center"
            onPress={() => {
              (setImage(null),
                setPhoto(null),
                setPhotoa(null),
                setPhotoaa(null),
                setPhotob(null),
                setPhotobb(null));
            }}
          >
            <LinearGradient
              colors={["black", "black"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Button.Label>Clear Photos</Button.Label>
          </Button>
          <SelectComponent
            title="Proposal Type"
            data={shareType}
            value={selectedtype}
            onChange={(value) => {
              settype(value);
              setFieldValue("proptype", value.value); // ✅ FIXED
            }}
          />
          <SelectComponent
            title="Share Type"
            data={sharing}
            value={selectedsharetype}
            onChange={(value) => {
              setsharetype(value);
              setFieldValue("shareamount", value.value); // ✅ FIXED
            }}
          />
          <SelectComponent
            title="Proposal Origin"
            data={propFor}
            value={selectedfor}
            onChange={(value) => {
              setselectedfor(value);
              setFieldValue("propfor", value.value); // ✅ FIXED
            }}
          />

          <FormikInput
            label="Share Amount"
            onChange={handleChange("amount")}
            value={values?.amount}
            error={touched.amount && errors.amount}
          />
          <SelectComponent
            title="Priority"
            data={propPrio}
            value={selectedprio}
            onChange={(value) => {
              setselectedprio(value);
              setFieldValue("propprio", value.value); // ✅ FIXED
            }}
          />
          <View className="flex-row gap-4 mt-4">
            <Checkbox
              isSelected={values?.gender === "Male"}
              onSelectedChange={() => setFieldValue("gender", "Male")}
            />
            <Text>Male</Text>

            <Checkbox
              isSelected={values?.gender === "Female"}
              onSelectedChange={() => setFieldValue("gender", "Female")}
            />
            <Text>Female</Text>
          </View>
          {touched.gender && errors.gender && (
            <Text className="text-red-500 mt-1">{errors.gender}</Text>
          )}

          <FormikInput
            error={touched.name && errors.name}
            onChange={handleChange("name")}
            value={values?.name}
            label="Name"
          />

          <FormikInput
            error={touched.age && errors.age}
            onChange={handleChange("age")}
            value={values?.age}
            label="Age"
          />

          <FormikInput
            error={touched.height && errors.height}
            onChange={handleChange("height")}
            value={values?.height}
            label="Height"
          />

          <FormikInput
            error={touched.cast && errors.cast}
            onChange={handleChange("cast")}
            value={values?.cast}
            label="Cast"
          />

          <FormikInput
            error={touched.maslak && errors.maslak}
            onChange={handleChange("maslak")}
            value={values?.maslak}
            label="Maslak"
          />

          <FormikInput
            error={touched.complexion && errors.complexion}
            onChange={handleChange("complexion")}
            value={values?.complexion}
            label="Complexion"
          />
          <SelectComponent
            title="Marital Status"
            data={maritalStatus}
            value={mstatus}
            onChange={(item) => {
              setmstatus(item);
              setFieldValue("maritalstatus", item.value);
            }}
          />

          <FormikInput
            error={touched.divorcereason && errors.divorcereason}
            onChange={handleChange("divorcereason")}
            value={values?.divorcereason}
            label="Divorce Reason"
          />

          <FormikInput
            error={touched.children && errors.children}
            onChange={handleChange("children")}
            value={values?.children}
            label="Childrens"
          />
          {/* COUNTRY */}
          <SelectComponent
            title="Select Education"
            data={educationlist}
            value={education}
            onChange={(item) => {
              seteducation(item);
              setFieldValue("education", item.value);
            }}
          />
          <FormikInput
            error={touched.educationbrief && errors.educationbrief}
            onChange={handleChange("educationbrief")}
            value={values?.educationbrief}
            label="Education Brief"
          />
          <FormikInput
            error={touched.job && errors.job}
            onChange={handleChange("job")}
            value={values?.job}
            label="Job"
          />

          <FormikInput
            error={touched.business && errors.business}
            onChange={handleChange("business")}
            value={values?.business}
            label="Business"
          />

          <FormikInput
            error={touched.income && errors.income}
            onChange={handleChange("income")}
            value={values?.income}
            label="Income"
          />

          <FormikInput
            error={touched.language && errors.language}
            onChange={handleChange("language")}
            value={values?.language}
            label="Language"
          />

          <FormikInput
            error={touched.belongs && errors.belongs}
            onChange={handleChange("belongs")}
            value={values?.belongs}
            label="Belongs"
          />
        </View>
      </>
    );
  }
  function StepAddress({ formik }) {
    const { values, setFieldValue, errors, touched, handleChange } = formik;

    return (
      <>
        <FormikInput
          error={touched.area && errors.area}
          onChange={handleChange("area")}
          value={values?.area}
          label="Area"
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

        <FormikInput
          error={touched.familystatus && errors.familystatus}
          onChange={handleChange("familystatus")}
          value={values?.familystatus}
          label="Family Status"
        />

        <FormikInput
          error={touched.fulladdress && errors.fulladdress}
          onChange={handleChange("fulladdress")}
          value={values?.fulladdress}
          label="Full Address"
        />

        <FormikInput
          error={touched.hometype && errors.hometype}
          onChange={handleChange("hometype")}
          value={values?.hometype}
          label="Home Type"
        />

        <FormikInput
          error={touched.homesize && errors.homesize}
          onChange={handleChange("homesize")}
          value={values?.homesize}
          label="Home Size"
        />

        <FormikInput
          error={touched.father && errors.father}
          onChange={handleChange("father")}
          value={values?.father}
          label="Father"
        />

        <FormikInput
          error={touched.mother && errors.mother}
          onChange={handleChange("mother")}
          value={values?.mother}
          label="Mother"
        />

        <FormikInput
          error={touched.brothers && errors.brothers}
          onChange={handleChange("brothers")}
          value={values?.brothers}
          label="Brothers"
        />

        <FormikInput
          error={touched.sisters && errors.sisters}
          onChange={handleChange("sisters")}
          value={values?.sisters}
          label="Sisters"
        />
      </>
    );
  }
  function StepRequirements({ formik }) {
    const {
      values,
      handleChange,
      errors,
      touched,
      handleSubmit,
      isSubmitting,
      setFieldValue,
    } = formik;

    return (
      <>
        <Text>Requirements</Text>
        <FormikInput
          error={touched.reqage && errors.reqage}
          onChange={handleChange("reqage")}
          value={values?.reqage}
          label="Age From"
        />

        <FormikInput
          error={touched.reqageto && errors.reqageto}
          onChange={handleChange("reqageto")}
          value={values?.reqageto}
          label="Age To"
        />

        <FormikInput
          error={touched.reqcast && errors.reqcast}
          onChange={handleChange("reqcast")}
          value={values?.reqcast}
          label="Cast"
        />

        <FormikInput
          error={touched.reqmaslak && errors.reqmaslak}
          onChange={handleChange("reqmaslak")}
          value={values?.reqmaslak}
          label="Maslak"
        />

        <FormikInput
          error={touched.reqheight && errors.reqheight}
          onChange={handleChange("reqheight")}
          value={values?.reqheight}
          label="Height"
        />

        <FormikInput
          error={touched.reqfamilystatus && errors.reqfamilystatus}
          onChange={handleChange("reqfamilystatus")}
          value={values?.reqfamilystatus}
          label="Family Status"
        />
        <SelectComponent
          title="Marital Status"
          data={maritalStatus}
          value={rmstatus}
          onChange={(item) => {
            setrmstatus(item);
            setFieldValue("reqmaritalstatus", item.value);
          }}
        />
        <SelectComponent
          title="Education"
          data={educationlist}
          value={reducation}
          onChange={(item) => {
            setreducation(item);
            setFieldValue("reqeducation", item.value);
          }}
        />

        {/* COUNTRY */}
        <SelectComponent
          title="Select Country"
          data={countryList}
          value={rcountry}
          onChange={(item) => {
            setRCountry(item);
            setFieldValue("reqcountry", item.value);
            setRProvince(null);
            setRCity(null);
          }}
        />
        {/* PROVINCE */}
        <SelectComponent
          title="Select Province"
          data={rprovinces}
          value={rprovince}
          onChange={(item) => {
            setRProvince(item);
            setFieldValue("reqprovince", item.value);
            setRCity(null);
          }}
        />

        {/* CITY */}
        <SelectComponent
          title="Select City"
          data={rcityOptions}
          value={rcity}
          onChange={(item) => {
            setFieldValue("reqcity", item.value);
            setRCity(item);
          }}
        />

        <FormikInput
          error={touched.description && errors.description}
          onChange={handleChange("description")}
          value={values?.description}
          label="Description"
        />
      </>
    );
  }
  //   function toPascalCase(text) {
  //   return text
  //     .replace(/[_-]+/g, ' ')        // replace _ and - with spaces
  //     .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
  //     .replace(/^(.)/, (_, c) => c.toUpperCase())
  //     .replace(/\s/g, '');
  // }
  function FormikInput({
    label = "Enter Text",
    value,
    onChange,
    error,
    keyboard = "default",
  }) {
    return (
      <View className="mt-3">
        <TextField>
          <Input
            placeholder={label}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboard}
          />
        </TextField>
        {error && <Text className="text-red-500">{error}</Text>}
      </View>
    );
  }
}
