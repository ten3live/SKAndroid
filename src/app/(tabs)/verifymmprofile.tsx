import { ScrollView, StyleSheet, Text, View } from "react-native";

import Axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router } from "expo-router";
import { Formik } from "formik";
import { Button, Card, Input, TextField } from "heroui-native";
import * as Yup from "yup";
import { useStore } from "../store";
import { API } from "../theme";

const LocationPicker = () => {
  const validationSchema = Yup.object().shape({
    workname: Yup.string().required().label("Workname"),
  });

  const { user, setUser } = useStore();
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
  return (
    <Card className="bg-zinc-300 p-5">
      <ToastManager />
      <ScrollView>
        <Formik
          initialValues={{
            workname: user && user?.workname,
            businessname: user && user?.businessname,
            reggov: user && user?.reggov,
            reggroup: user && user?.reggroup,
            nonreg: user && user?.nonreg,
            whatsapp: user && user?.whatsapp,
            landline: user && user?.landline,
            cnic: user && user?.cnic,
            address: user && user?.address,
            area: user && user?.area,
            groupowner: user && user?.groupowner,
            groupname: user && user?.groupname,
            description: user && user?.description,
            workingas: user && user?.workingas,
            charges: user && user?.charges,
            fees: user && user?.fees,
            workarea: user && user?.workarea,
            fb: user && user?.fb,
            yt: user && user?.yt,
            ig: user && user?.ig,
            tt: user && user?.tt,
            verified: "pending",
          }}
          onSubmit={async (values) => {
            try {
              await Axios.put(
                `${API}verify/${user && user?.userId}`,
                values,
              ).then((response) => {
                if (response.status == 200) {
                  return Toast.success("Profile Sent for Verification");
                }
              });
            } catch (error) {
              Toast.info("Something went Wrong");
            }
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            values,
            setFieldTouched,
            touched,
          }) => (
            <>
              <View>
                <View
                  style={{
                    marginVertical: 10,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      className="text-white"
                      style={{ marginHorizontal: 20 }}
                    >
                      Details Required For Verification
                    </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.workname}
                        placeholder={
                          user?.workname
                            ? user?.workname
                            : "Work Name (Nickname)"
                        }
                        onChangeText={handleChange("workname")}
                        onBlur={() => setFieldTouched("workname")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.businessname}
                        placeholder={
                          user?.businessname
                            ? user?.businessname
                            : "Bureau / Business Name"
                        }
                        onChangeText={handleChange("businessname")}
                        onBlur={() => setFieldTouched("businessname")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.reggov}
                        placeholder={
                          user?.reggov
                            ? user?.reggov
                            : "Registered With a Govt Organization"
                        }
                        onChangeText={handleChange("reggov")}
                        onBlur={() => setFieldTouched("reggov")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.reggroup}
                        placeholder={
                          user?.reggroup
                            ? user?.reggroup
                            : "Registered with a Matchmaker Group"
                        }
                        onChangeText={handleChange("reggroup")}
                        onBlur={() => setFieldTouched("reggroup")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.nonreg}
                        placeholder={
                          user?.nonreg
                            ? user?.nonreg
                            : "Non Registered (Single MM)"
                        }
                        onChangeText={handleChange("nonreg")}
                        onBlur={() => setFieldTouched("nonreg")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.whatsapp}
                        placeholder={
                          user?.whatsapp ? user?.whatsapp : "WhatsApp"
                        }
                        onChangeText={handleChange("whatsapp")}
                        onBlur={() => setFieldTouched("whatsapp")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.landline}
                        placeholder={
                          user?.landline ? user?.landline : "Landline"
                        }
                        onChangeText={handleChange("landline")}
                        onBlur={() => setFieldTouched("landline")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.cnic}
                        placeholder={
                          user?.cnic ? user?.cnic : "CNIC/Passport/SocialID"
                        }
                        onChangeText={handleChange("cnic")}

                        onBlur={() => setFieldTouched("cnic")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.area}
                        placeholder={user?.area ? user?.area : "Area"}
                        onChangeText={handleChange("area")}

                        onBlur={() => setFieldTouched("area")}
                      />
                    </TextField>
                  </View>
                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.address}
                        placeholder={user?.address ? user?.address : "Address"}
                        onChangeText={handleChange("address")}

                        onBlur={() => setFieldTouched("address")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.groupname}
                        placeholder={
                          user?.groupname ? user?.groupname : "Group Name"
                        }
                        onChangeText={handleChange("groupname")}

                        onBlur={() => setFieldTouched("groupname")}
                      />
                    </TextField>
                  </View>
                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.groupowner}
                        placeholder={
                          user?.groupowner
                            ? user?.groupowner
                            : "Group Owner (Admin)"
                        }
                        onChangeText={handleChange("groupowner")}

                        onBlur={() => setFieldTouched("groupowner")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.description}
                        placeholder={
                          user?.description
                            ? user?.description
                            : "Describe your self"
                        }
                        onChangeText={handleChange("description")}

                        onBlur={() => setFieldTouched("description")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.workarea}
                        placeholder={
                          user?.workarea ? user?.workarea : "Work Area"
                        }
                        onChangeText={handleChange("workarea")}

                        onBlur={() => setFieldTouched("workarea")}
                      />
                    </TextField>
                  </View>
                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.workingas}
                        placeholder={
                          user?.workingas ? user?.workingas : "Working as"
                        }
                        onChangeText={handleChange("workingas")}

                        onBlur={() => setFieldTouched("workingas")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.charges}
                        placeholder={
                          user?.charges ? user?.charges : "Charges in Advance"
                        }
                        onChangeText={handleChange("charges")}

                        onBlur={() => setFieldTouched("charges")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.fees}
                        placeholder={
                          user?.fees ? user?.fees : "Your fees Structure"
                        }
                        onChangeText={handleChange("fees")}

                        onBlur={() => setFieldTouched("fees")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.fb}
                        placeholder={user?.fb ? user?.fb : "Facebook"}
                        onChangeText={handleChange("fb")}

                        onBlur={() => setFieldTouched("fb")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.yt}
                        placeholder={user?.yt ? user?.yt : "Youtube"}
                        onChangeText={handleChange("yt")}

                        onBlur={() => setFieldTouched("yt")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.ig}
                        placeholder={user?.ig ? user?.ig : "Instagram"}
                        onChangeText={handleChange("ig")}

                        onBlur={() => setFieldTouched("ig")}
                      />
                    </TextField>
                  </View>

                  <View
                    style={{
                      marginVertical: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextField>
                      <Input
                        value={values?.tt}
                        placeholder={user?.tt ? user?.tt : "TikTok"}
                        onChangeText={handleChange("tt")}

                        onBlur={() => setFieldTouched("tt")}
                      />
                    </TextField>
                  </View>
                </View>
                <View className="flex-row gap-2 justify-between items-center">
                  <Button onPress={() => router.back()}>
                    <LinearGradient
                      colors={["#000000", "#000000"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Button.Label>Back</Button.Label>
                  </Button>
                  <Button onPress={() => handleSubmit()}>
                    <LinearGradient
                      colors={["#9333ea", "#ec4899"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Button.Label>Submit</Button.Label>
                  </Button>
                </View>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {},
  subcontainer: {
    width: "86%",
    flexDirection: "row",

    borderRadius: 5,
    marginHorizontal: 30,
    marginVertical: 8,
    fontSize: 16,
  },
  icon: { marginHorizontal: 10 },
  cardGradient: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    overflow: "hidden",
  },
});

export default LocationPicker;
