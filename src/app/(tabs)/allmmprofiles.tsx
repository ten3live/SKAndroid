import verified from "@/assets/verified.png";
import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router, useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { Button, Card, Checkbox, Input, TextField } from "heroui-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import cities from "../cities.json";
import countries from "../countriesmin.json";
import SelectComponent from "../select";
import { useStore } from "../store";
import { API } from "../theme";

const SearchScreen = () => {
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

  const { user, allmms, setallmms, setSelectedmm, loading, setLoading } =
    useStore();

  const fetchData = async () => {
    const response = await fetch(`${API}getusers`);
    const data = await response.json();
    console.log(data);
    if (data?.data) {
      setallmms(data.data);
    }
  };
  const passdata = (item) => {
    console.log(item);
    setSelectedmm(item);
    router.push("/(tabs)/userdetails");
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const [education, seteducation] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [visibility, setvisibility] = useState("visible");
  const [ageFilter, setAgeFilter] = useState("");
  const [agetoFilter, setAgetoFilter] = useState("");
  const [maritalStatusFilter, setMaritalStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [genderFilter, setgenderFilter] = useState("Female");
  const [educationFilter, setEducationFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [iDFilter, setiDFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortField, setSortField] = useState("name"); // Default sorting field
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction
  const [country, setCountry] = useState("");
  const [role, setrole] = useState("user");

  const [maritalStatus, setMaritalStatus] = useState("");

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [message, setmessage] = useState(null);
  const provinces = country ? provinceList(country.value) : [];
  const cityOptions = province ? cityList(province.value) : [];

  const showToasts = () => {
    Toast.info(`${message}`, { position: "top" });
  };
  useEffect(() => {
    message !== null && showToasts();
  }, [message]);

  const onRefresh = async () => {
    setLoading(true);
  };

  const getSortedData = (data) => {
    return data.slice(0).sort((a, b) => {
      const fieldA = a[sortField]?.toLowerCase();
      const fieldB = b[sortField]?.toLowerCase();

      if (fieldA < fieldB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredData = getSortedData(allmms).filter((item) => {
    // Convert values safely
    const nameMatch = item.name
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());

    // GENDER FILTER (optional)
    const genderMatch =
      genderFilter === "" ||
      item.gender?.toLowerCase() === genderFilter?.toLowerCase();

    // COUNTRY → PROVINCE → CITY FILTERS
    const countryMatch =
      countryFilter === "" ||
      item.country?.toLowerCase() === countryFilter?.toLowerCase();

    const provinceMatch =
      provinceFilter === "" ||
      item.province?.toLowerCase() === provinceFilter?.toLowerCase();

    const cityMatch =
      cityFilter === "" ||
      item.city?.toLowerCase() === cityFilter?.toLowerCase();

    // CLIENT ID FILTER
    const idMatch =
      iDFilter === "" ||
      item?.userId?.toLowerCase().includes(iDFilter?.toLowerCase());

    // EXCLUDE DISABLED & SELF-PROFILES
    const notDisabled = item?.status !== "disabled";
    const notOwnProfile = item?.userId !== user?.userId;

    // FINAL RETURN
    return (
      nameMatch &&
      genderMatch &&
      countryMatch &&
      provinceMatch &&
      cityMatch &&
      idMatch &&
      notDisabled &&
      notOwnProfile
    );
  });

  const shareContent = async (client) => {
    const imageUrl = `${API}uploads/${client?.avatar}`;
    const localUri = `${FileSystem.cacheDirectory}${client?.avatar}`;

    const download = await FileSystem.downloadAsync(imageUrl, localUri);

    const message = `https://wa.me/${
      client?.ccode + client?.phone
    }?text=Profile from skworld.org is this available?
  \n \n \n User Details\n 
  \n Role:${client?.role}
  \n Gender:${client?.gender}
  \n Name:${client?.name}
  \n Whatsapp:${client?.whatsapp}
  \n Landline:${client?.landline}
  \n Email:${client?.email}
  \n Area:${client?.area}
  \n Full Address:${client?.address}
  \n Country:${client?.country}
  \n Province:${client?.province}
  \n City:${client?.city}
  \n \n \n Other Details\n 
  \n Work Name:${client?.workname}
  \n Business Name:${client?.businessname}
  \n Registered with a Government Organization:${client?.reggov}
  \n Registered Group:${client?.reggroup}
  \n Non Registered Single Matchmaker:${client?.nonreg}
  \n Group Admin:${client?.groupowner}
  \n Group Name:${client?.groupname}
  \n Working As:${client?.workingas}
  \n Working Area:${client?.workingarea}
  \n Charge In Advance:${client?.charges}
  \n Fees Structure:${client?.fees}
  \n Facebook:${client?.fb}
  \n Youtube:${client?.yt}
  \n Instagram:${client?.ig}
  \n Tiktok:${client?.tt}
  \n Descibe your Self:${client?.description}`;

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Sharing is not available on this device");
      return;
    }

    // 4️⃣ Share image + message
    await Sharing.shareAsync(localUri, {
      mimeType: "image/jpeg",
      dialogTitle: `Share ${client?.name}'s Profile`,
      UTI: "public.jpeg",
    });
  };

  const WhatsApp = (data) => {
    let url = `https://wa.me/${data?.ccode + data?.phone}?text=Hi`;

    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("WhatsApp is not installed on this device.");
        }
      })
      .catch();
  };

  const handleVisible = () => {
    visibility == "hidden" ? setvisibility("visible") : setvisibility("hidden");
  };

  const renderCard = ({ item }) => (
    <>
      <TouchableOpacity onPress={() => passdata(item)}>
        <View style={styles.card}>
          <View>
            {/* Avatar */}
            <Image
              source={{
                uri: `${API}uploads/${item.avatar || "default.jpg"}`,
              }}
              style={styles.avatar}
            />
          </View>
          {/* Main Info */}
          <View style={styles.info}>
            <View className="flex-row">
              <Text style={styles.name}>{item.name.trim().toUpperCase()}</Text>
              {item?.verified == "yes" ? (
                <Image
                  source={verified}
                  style={{
                    width: 28,
                    height: 28,
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                />
              ) : null}
            </View>

            <Text style={styles.detail}>
              {item.city}, {item.province}, {item.country}
            </Text>
            <Text style={styles.tag} className="mt-2">
              ID: {item?.userId}
            </Text>
            <Text style={styles.tag} className="mt-1">
              Gender: {item.gender}
            </Text>
            <Text style={styles.tag} className="mt-1">
              Role: {item.role}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View className="flex-row gap-2 mb-5">
        <Button size="sm" onPress={() => shareContent(item)}>
          <LinearGradient
            className=""
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Button.Label>Share</Button.Label>
        </Button>
        <Button size="sm" onPress={() => WhatsApp(item)}>
          <LinearGradient
            className=""
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Button.Label>WhatsApp</Button.Label>
        </Button>
      </View>
    </>
  );

  if (user?.verified !== "yes") {
    return (
      <View className="mt-20 p-5">
        <Text>Only Verified Matchmakers can View This Page</Text>
        <Button className="bg-black mt-5" onPress={() => router.back()}>
          <Button.Label>Back</Button.Label>
        </Button>
      </View>
    );
  }
  return (
    <>
      <ToastManager />
      <View style={styles.container}>
        <View style={{}}>
          {visibility !== "hidden" ? (
            <Card className="bg-zinc-300">
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text>Search</Text>
              </View>

              <View className="flex-row gap-2">
                <View style={{ width: "48%" }}>
                  <View>
                    <View className="flex-row gap-2 my-3">
                      <View className="flex-row justify-start items-center gap-1 ">
                        <Checkbox
                          isSelected={genderFilter === "Male"}
                          onSelectedChange={() => {
                            setgenderFilter("Male");
                          }}
                        />
                        <Text>Male</Text>
                      </View>
                      <View className="flex-row justify-start items-center gap-1">
                        <Checkbox
                          isSelected={genderFilter === "Female"}
                          onSelectedChange={() => {
                            setgenderFilter("Female");
                          }}
                        />
                        <Text>Female</Text>
                      </View>
                    </View>
                  </View>

                  <TextField>
                    <Input
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      placeholder="Name"
                    />
                  </TextField>

                  <View className="mt-2">
                    <TextField>
                      <Input
                        placeholder="Client ID"
                        onChangeText={setiDFilter}
                        value={iDFilter}
                      />
                    </TextField>
                  </View>
                </View>
                <View style={{ width: "48%" }}>
                  <View>
                    {/* COUNTRY */}
                    <SelectComponent
                      title="Select Country"
                      data={countryList}
                      value={country}
                      onChange={(item) => {
                        setCountry(item);
                        setCountryFilter(item.value);
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
                        setProvinceFilter(item.value);
                        setCity(null);
                      }}
                    />

                    {/* CITY */}
                    <SelectComponent
                      title="Select City"
                      data={cityOptions}
                      value={city}
                      onChange={(item) => {
                        setCityFilter(item.value);
                        setCity(item);
                      }}
                    />
                  </View>
                </View>
              </View>
            </Card>
          ) : null}

          <LinearGradient
            className="justify-center items-center my-2"
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 50 }}
          >
            <TouchableOpacity
              onPress={handleVisible}
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                width: 200,
                borderRadius: 50,
              }}
            >
              <Text style={{ color: "white" }}>
                {visibility == "hidden" ? "Show Search" : "Hide Search"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <FlatList
            //data={filteredData}
            data={filteredData}
            ListFooterComponent={() => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f7f9fc",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <Text>Copyright@SKMatrimonial</Text>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f7f9fc",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <Text>Developed by Tahiri Services</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  marginTop: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View className="text-center self-center items-center justify-center">
                  <Text>No clients found.</Text>
                </View>
              </View>
            )}
            renderItem={renderCard}

            keyExtractor={(item) => item?.userId.toString()}
            refreshControl={
              <RefreshControl
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["black"]}
                tintColor={"white"}
              />
            }
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    padding: 15,
  },
  cardGradient: {
    height: "100%",
    overflow: "hidden",
  },
  input: {
    height: 40,
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  avatar: {
    width: 80,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginRight: 15,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
  },

  detail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginVertical: 6,
    fontSize: 12,
    color: "#444",
  },

  mmBox: {
    marginTop: 8,
    backgroundColor: "#e8f4ff",
    padding: 8,
    borderRadius: 8,
  },

  mmText: {
    color: "#0366d6",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default SearchScreen;
