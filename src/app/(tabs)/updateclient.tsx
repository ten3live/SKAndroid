import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router } from "expo-router";
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
import cities from "../cities.json";
import countries from "../countriesmin.json";
import Loading from "../loading";
import SelectComponent from "../select";
import { useStore } from "../store";
import { API } from "../theme";
export default function App() {
  const [message, setmessage] = useState(null);
  const { user, selectedClient, refreshSelectedClient, setLoading, loading } =
    useStore();

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
  const [avatar, setAvatar] = useState(null);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [selectedavatar, setselectedavatar] = useState(selectedClient?.avatar);
  const [selectedphoto1, setselectedphoto1] = useState(selectedClient?.photo1);
  const [selectedphoto2, setselectedphoto2] = useState(selectedClient?.photo2);
  const [selectedsharetype, setsharetype] = useState(null);
  const [selectedtype, settype] = useState(null);
  const [selectedprio, setselectedprio] = useState(null);
  const [selectedfor, setselectedfor] = useState(null);

  const countryList = countries?.map((c) => ({
    label: c.name,
    value: c.name,
  }));
  const provinceList = (countryName) => {
    const c = countries.find((x) => x.name === countryName);
    if (!c) return [];
    return c?.provinces?.map((p) => ({ label: p, value: p }));
  };
  const cityList = (provinceName) => {
    return cities
      ?.filter((c) => c.state_name === provinceName)
      .map((city) => ({
        label: city.city_name,
        value: city.city_name,
      }));
  };
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

  if (loading == true) {
    return (
      <>
        <Loading />
      </>
    );
  }
  const handleImagesDelete = async () => {
    try {
      const res = await axios.put(
        `${API}clients/delete/images/${selectedClient?.clientid}`,
      );

      console.log(res.status);
      if (res.status === 200 || res.status === 201) {
        Toast.success("Deleted Successfully", { duration: 5000 });
        refreshSelectedClient(selectedClient?.clientid);
        (setselectedavatar(null),
          setselectedphoto1(null),
          setselectedphoto2(null),
          setPhoto1(null),
          setPhoto2(null),
          setAvatar(null));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Update failed";
      Toast.error(errorMessage, { duration: 5000 });
    }
  };

  const showToasts = () => {
    Toast.info(`${message}`, { position: "top" });
  };
  useEffect(() => {
    message !== null && showToasts();
  }, [message]);
  const stepSchemas = [
    Yup.object({
      name: Yup.string().required("Name required"),
      age: Yup.string().required("Age required"),
      gender: Yup.string().required("Select gender"),
    }),

    Yup.object({
      country: Yup.string().required("Country required"),
      city: Yup.string().required("City required"),
    }),

    Yup.object({
      reqage: Yup.string().required("Required age needed"),
    }),
  ];

  const [step, setStep] = useState(0);
  return (
    <>
      <ToastManager />
      <Formik
        initialValues={{
          gender: selectedClient?.gender,
          matchmakerid: user?.userId,
          matchmakername: user?.name,
          matchmakerphoto: user?.avatar,
          name: selectedClient?.name,
          age: selectedClient?.age,
          height: selectedClient?.height,
          ccode: user?.ccode,
          contact: user?.contact,
          cast: selectedClient?.cast,
          maslak: selectedClient?.maslak,
          complexion: selectedClient?.complexion,
          maritalstatus: selectedClient?.maritalstatus,
          divorcereason: selectedClient?.divorcereason,
          children: selectedClient?.children,
          education: selectedClient?.education,
          educationbrief: selectedClient?.educationbrief,
          job: selectedClient?.job,
          business: selectedClient?.business,
          income: selectedClient?.income,
          language: selectedClient?.language,
          belongs: selectedClient?.belongs,
          country: selectedClient?.country,
          province: selectedClient?.province,
          city: selectedClient?.city,
          area: selectedClient?.area,
          familystatus: selectedClient?.familystatus,
          fulladdress: selectedClient?.fulladdress,
          hometype: selectedClient?.hometype,
          homesize: selectedClient?.homesize,
          father: selectedClient?.father,
          mother: selectedClient?.mother,
          brothers: selectedClient?.brothers,
          sisters: selectedClient?.sisters,
          reqage: selectedClient?.reqage,
          reqageto: selectedClient?.reqageto,
          reqcast: selectedClient?.reqcast,
          reqmaslak: selectedClient?.reqmaslak,
          reqheight: selectedClient?.reqheight,
          reqfamilystatus: selectedClient?.reqfamilystatus,
          reqmaritalstatus: selectedClient?.reqmaritalstatus,
          reqeducation: selectedClient?.reqeducation,
          reqcity: selectedClient?.reqcity,
          reqprovince: selectedClient?.reqprovince,
          reqcountry: selectedClient?.reqcountry,
          proptype: selectedClient?.proptype,
          shareamount: selectedClient?.shareamount,
          amount: selectedClient?.amount,
          propfor: selectedClient?.propfor,
          propprio: selectedClient?.propprio,
          description: selectedClient?.description,
          role: user?.role,
        }}
        validationSchema={stepSchemas[step]}
        onSubmit={async (values) => {
          const mmclient = selectedClient?.clientid;

          const formData = {
            matchmakerid: user?.userId ?? "",
            matchmakername: user?.name ?? "",
            matchmakerphoto: user?.avatar ?? "",
            gender: values?.gender ?? "",
            name: values?.name ?? "",
            age: values?.age ?? "",
            height: values?.height ?? "",
            ccode: user?.ccode ?? "",
            contact: user?.phone ?? "",
            cast: values?.cast ?? "",
            maslak: values?.maslak ?? "",
            complexion: values?.complexion ?? "",
            maritalstatus: values?.maritalstatus ?? "",
            divorcereason: values?.divorcereason ?? "",
            children: values?.children ?? "",
            education: values?.education ?? "",
            educationbrief: values?.educationbrief ?? "",
            job: values?.job ?? "",
            business: values?.business ?? "",
            income: values?.income ?? "",
            language: values?.language ?? "",
            belongs: values?.belongs ?? "",
            country: values?.country ?? "",
            province: values?.province ?? "",
            city: values?.city ?? "",
            area: values?.area ?? "",
            familystatus: values?.familystatus ?? "",
            fulladdress: values?.fulladdress ?? "",
            hometype: values?.hometype ?? "",
            homesize: values?.homesize ?? "",
            father: values?.father ?? "",
            mother: values?.mother ?? "",
            brothers: values?.brothers ?? "",
            sisters: values?.sisters ?? "",
            reqage: values?.reqage ?? "",
            reqageto: values?.reqageto ?? "",
            reqcast: values?.reqcast ?? "",
            reqmaslak: values?.reqmaslak ?? "",
            reqheight: values?.reqheight ?? "",
            reqfamilystatus: values?.reqfamilystatus ?? "",
            reqmaritalstatus: values?.reqmaritalstatus ?? "",
            reqeducation: values?.reqeducation ?? "",
            reqcity: values?.reqcity ?? "",
            reqprovince: values?.reqprovince ?? "",
            reqcountry: values?.reqcountry ?? "",
            proptype: values?.proptype ?? "",
            shareamount: values?.shareamount ?? "",
            amount: values?.amount ?? "",
            propfor: values?.propfor ?? "",
            propprio: values?.propprio ?? "",
            description: values?.description ?? "",
            role: user?.role ?? "",
          };

          try {
            const res = await axios({
              method: "put",
              url: `${API}clients/update/${mmclient}`,
              headers: {
                "Content-Type": "application/json",
              },
              // Axios automatically stringifies this
              data: formData,
            });

            if (res.status === 200 || res.status === 201) {
              setStep(0);

              Toast.success("Updated Successfully", { duration: 5000 });
              refreshSelectedClient(selectedClient?.clientid);
              setTimeout(() => {
                router.back(); // ⬅️ navigate AFTER 5 seconds
              }, 5000);
            }
          } catch (err) {
            const errorMessage = err.response?.data?.message || "Update failed";
            console.error("Update Error:", errorMessage);
            Toast.error(errorMessage, { position: "top" });
          }
        }}
      >
        {(formik) => (
          <ScrollView className="p-5">
            <Text className="text-xl font-bold mb-2">Step {step + 1} of 3</Text>
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
            {step === 0 && <StepPersonal formik={formik} />}
            {step === 1 && <StepAddress formik={formik} />}
            {step === 2 && <StepRequirements formik={formik} />}
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
                  {step === 2 ? "Update Client" : "Next"}
                </Button.Label>
              </Button>
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

    const pickImage = async (setter) => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setter(result.assets[0]);
      }
    };

    const uploadImages = async () => {
      if (!avatar && !photo1 && !photo2) {
        Toast.error("Please select at least one image");
        return;
      }

      const prepareImage = (image, fieldName) => {
        if (!image?.uri) return null;

        const filename =
          image.fileName ||
          image.uri.split("/").pop() ||
          `${fieldName}-${Date.now()}.jpg`;

        const extension = filename.split(".").pop()?.toLowerCase();

        const mimeTypes = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          webp: "image/webp",
          heic: "image/heic",
          heif: "image/heif",
        };

        return {
          uri: image.uri,
          name: filename,
          type: image.mimeType || mimeTypes[extension] || "image/jpeg",
        };
      };

      try {
        const formData = new FormData();

        const images = [
          ["avatar", avatar],
          ["photo1", photo1],
          ["photo2", photo2],
        ];

        images.forEach(([fieldName, image]) => {
          const file = prepareImage(image, fieldName);

          if (file) {
            formData.append(fieldName, file);
          }
        });

        const res = await axios.put(
          `${API}clients/update/images/${selectedClient?.clientid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (res.status === 200 || res.status === 201) {
          Toast.success(res.data?.message || "Images updated successfully", {
            duration: 5000,
          });

          await refreshSelectedClient(selectedClient?.clientid);

          // Clear local selections after a successful upload.
          setAvatar(null);
          setPhoto1(null);
          setPhoto2(null);
        }
      } catch (err) {
        console.error("Image upload error:", err.response?.data || err.message);

        Toast.error(
          err.response?.data?.message || err.message || "Upload failed",
          { duration: 5000 },
        );
      }
    };
    return (
      <>
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
            onPress={() => pickImage(setAvatar)}
          >
            {avatar ? (
              <>
                <Image
                  source={{ uri: avatar.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 100,
                  }}
                />
              </>
            ) : (
              <Image
                source={{ uri: `${API}uploads/${selectedavatar}` }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                }}
              />
            )}
          </TouchableOpacity>

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
            onPress={() => pickImage(setPhoto1)}
          >
            {photo1 ? (
              <>
                <Image
                  source={{ uri: photo1.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 100,
                  }}
                />
              </>
            ) : (
              <Image
                source={{ uri: `${API}uploads/${selectedphoto1}` }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                }}
              />
            )}
          </TouchableOpacity>

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
            onPress={() => pickImage(setPhoto2)}
          >
            {photo2 ? (
              <>
                <Image
                  source={{ uri: photo2.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 100,
                  }}
                />
              </>
            ) : (
              <Image
                source={{ uri: `${API}uploads/${selectedphoto2}` }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                }}
              />
            )}
          </TouchableOpacity>
        </ScrollView>
        <Button className="mt-5 self-center text-center" onPress={uploadImages}>
          <LinearGradient
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Button.Label>Upload Photos</Button.Label>
        </Button>
        <Button
          className="mt-5 self-center text-center"
          onPress={() => {
            handleImagesDelete();
          }}
        >
          <LinearGradient
            colors={["red", "purple"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Button.Label>Delete Photos</Button.Label>
        </Button>

        <SelectComponent
          title={selectedClient?.proptype}
          data={shareType}
          value={selectedtype}
          onChange={(value) => {
            settype(value);
            setFieldValue("proptype", value.value); // ✅ FIXED
          }}
        />
        <SelectComponent
          title={selectedClient?.shareamount}
          data={sharing}
          value={selectedsharetype}
          onChange={(value) => {
            setsharetype(value);
            setFieldValue("shareamount", value.value); // ✅ FIXED
          }}
        />
        <SelectComponent
          title={selectedClient?.propfor}
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
          title={selectedClient?.propprio}
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
          title={selectedClient?.maritalstatus}
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
          label="Children"
        />
        {/* COUNTRY */}
        <SelectComponent
          title={selectedClient?.education}
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
          title={selectedClient?.country}
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
          title={selectedClient?.province}
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
          title={selectedClient?.city}
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
          title={selectedClient?.reqmaritalstatus}
          data={maritalStatus}
          value={rmstatus}
          onChange={(item) => {
            setrmstatus(item);
            setFieldValue("reqmaritalstatus", item.value);
          }}
        />
        <SelectComponent
          title={selectedClient?.reqeducation}
          data={educationlist}
          value={reducation}
          onChange={(item) => {
            setreducation(item);
            setFieldValue("reqeducation", item.value);
          }}
        />

        {/* COUNTRY */}
        <SelectComponent
          title={selectedClient?.reqcountry}
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
          title={selectedClient?.reqprovince}
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
          title={selectedClient?.reqcity}
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
