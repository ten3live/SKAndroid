import { LinearGradient } from "expo-linear-gradient";
import ToastManager from "expo-react-native-toastify";
import { router, useFocusEffect } from "expo-router";
import { Button, Card, Checkbox, Input, TextField } from "heroui-native";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import cities from "../cities.json";
import countries from "../countriesmin.json";
import SelectComponent from "../select";
import { openWhatsApp, sendMessage, shareClientProfile } from "../share";
import { useStore } from "../store";
import { API } from "../theme";
//import Share from 'react-native-share';

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

  const { user, clients, setClients, setSelectedClient } = useStore();

  const fetchData = async () => {
    if (!user?.userId) return;

    try {
      const response = await fetch(`${API}clients/search`);
      const data = await response.json();

      if (data?.data) {
        setClients(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const passdata = (item) => {
    console.log(item);
    setSelectedClient(item);
    router.push("/(tabs)/viewclient");
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const [loading, setLoading] = useState(true);
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
  const provinces = country ? provinceList(country.value) : [];
  const cityOptions = province ? cityList(province.value) : [];

  const onRefresh = async () => {
    setLoading;
  };

  const getSortedData = (data) => {
    return data.slice(0).sort((a, b) => {
      const fieldA = a[sortField].toLowerCase();
      const fieldB = b[sortField].toLowerCase();

      if (fieldA < fieldB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredData = getSortedData(clients).filter((item) => {
    // Convert values safely
    const nameMatch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // AGE FILTER (optional if fields are empty)

    const lowerAge = parseInt(ageFilter);
    const upperAge = parseInt(agetoFilter);

    const ageValid = lowerAge <= item?.age && item?.age <= upperAge;

    // MARITAL STATUS FILTER (optional)
    const maritalMatch =
      maritalStatusFilter === "" ||
      item.maritalstatus
        ?.toLowerCase()
        .includes(maritalStatusFilter.toLowerCase());
    const educationMatch =
      educationFilter === "" ||
      item.education?.toLowerCase().includes(educationFilter.toLowerCase());

    // GENDER FILTER (optional)
    const genderMatch =
      genderFilter === "" ||
      item.gender?.toLowerCase() === genderFilter.toLowerCase();

    // EDUCATION FILTER (optional)
    const statusMatch =
      maritalStatusFilter === "" ||
      item.maritalstatus
        ?.toLowerCase()
        .includes(maritalStatusFilter.toLowerCase());

    // COUNTRY → PROVINCE → CITY FILTERS
    const countryMatch =
      countryFilter === "" ||
      item.country?.toLowerCase() === countryFilter.toLowerCase();

    const provinceMatch =
      provinceFilter === "" ||
      item.province?.toLowerCase() === provinceFilter.toLowerCase();

    const cityMatch =
      cityFilter === "" ||
      item.city?.toLowerCase() === cityFilter.toLowerCase();

    // CLIENT ID FILTER
    const idMatch =
      iDFilter === "" ||
      item.clientid?.toLowerCase().includes(iDFilter.toLowerCase());

    // EXCLUDE DISABLED & SELF-PROFILES
    const notDisabled = item.status !== "disabled";
    const notOwnProfile = item.matchmakerid !== user?.userId;

    // FINAL RETURN
    return (
      nameMatch &&
      ageValid &&
      maritalMatch &&
      educationMatch &&
      genderMatch &&
      statusMatch &&
      countryMatch &&
      provinceMatch &&
      cityMatch &&
      idMatch &&
      notDisabled &&
      notOwnProfile
    );
  });

  const handleVisible = () => {
    visibility == "hidden" ? setvisibility("visible") : setvisibility("hidden");
  };
  const genderitems = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const ageitems = ["15", "20", "25", "30", "35", "40", "45", "50"];
  const agetoitems = [
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
    "60",
    "65",
    "70",
    "75",
    "80",
  ];

  const msitems = [
    { label: "Single", value: "Single" },
    { label: "Divorced", value: "Divorced" },
    { label: "DivorcedChild", value: "DivorcedChild" },
    { label: "Nikkah Break", value: "Nikkah Break" },
    { label: "Widowed", value: "Widowed" },
    { label: "Separated", value: "Separated" },
    { label: "Second Marriage", value: "Second Marriage" },
  ];
  const educationitems = [
    { label: "All", value: "" },
    { label: "Primary/Nursery/KG", value: "Primary/Nursery/KG" },
    { label: "Matric/O-level", value: "Matric/O-level" },
    { label: "Intermediate/A-Level", value: "Intermediate/A-Level" },
    { label: "Bachelor/BSc", value: "Bachelor/BSc" },
    { label: "Master/MA/MSc", value: "Master/MA/MSc" },
    { label: "Ms/M.Phil", value: "Ms/M.Phil" },
    { label: "Doctorate", value: "Doctorate" },
    { label: "Professional/CA/ACCA etc.", value: "Professional/CA/ACCA etc." },
    { label: "Diploma/Cert-Matric", value: "Diploma/Cert-Matric" },
    { label: "Diploma/Cert-Intermediate", value: "Diploma/Cert-Intermediate" },
    { label: "Major Training-Medical", value: "Major Training-Medical" },
  ];

  const renderCard = ({ item }) => (
    <>
      <TouchableOpacity onPress={() => passdata(item)}>
        <View style={styles.card}>
          <View>
            {/* Avatar */}
            {user?.role == "guest" ? (
              <View style={styles.avatar}></View>
            ) : (
              <Image
                source={{
                  uri: `${API}uploads/${item.avatar || "default.jpg"}`,
                }}
                style={styles.avatar}
              />
            )}
            <Text style={styles.tag} className="mt-2">
              ID: {item.clientid}
            </Text>
            <Text style={styles.tag} className="mt-1">
              Gender: {item.gender}
            </Text>
            <Text style={styles.tag} className="mt-1">
              Age: {item.age}
            </Text>
          </View>
          {/* Main Info */}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name.trim().toUpperCase()}</Text>

            <Text style={styles.detail}>
              {item.city}, {item.province}, {item.country}
            </Text>
            <Text style={styles.detail}>Education {item.education}</Text>
            <Text style={styles.detail}>Job {item.job || "Not provided"}</Text>

            {/* Tags */}
            <View style={styles.tagRow}>
              <Text style={styles.tag} className="mt-5">
                Marital Status: {item.maritalstatus}
              </Text>
            </View>

            <View style={styles.tagRow}>
              <Text style={styles.tag}>Cast: {item.cast}</Text>
              <Text style={styles.tag}>Maslak: {item.maslak}</Text>
            </View>

            <View style={styles.tagRow}>
              <Text style={styles.tag}>Matchmaker: {item.matchmakername}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View className="flex-row gap-2 mb-5">
        <Button size="sm" onPress={() => sendMessage(item)}>
          <LinearGradient
            className=""
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Button.Label>Message</Button.Label>
        </Button>
        <Button size="sm" onPress={() => shareClientProfile(item)}>
          <LinearGradient
            className=""
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Button.Label>Share</Button.Label>
        </Button>
        <Button size="sm" onPress={() => openWhatsApp(item)}>
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
                <Text>Search Clients</Text>
              </View>

              <View className="flex-row gap-2">
                <View style={{ width: "48%" }}>
                  <TextField>
                    <Input
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      placeholder="Name"
                    />
                  </TextField>

                  <View>
                    <View className="mt-2">
                      <TextField>
                        <Input
                          placeholder="Age From"
                          onChangeText={setAgeFilter}
                          value={ageFilter}
                        />
                      </TextField>
                    </View>
                    <View className="mt-2">
                      <TextField>
                        <Input
                          placeholder="Age To"
                          onChangeText={setAgetoFilter}
                          value={agetoFilter}
                        />
                      </TextField>
                    </View>
                    <SelectComponent
                      title="Marital Status"
                      data={msitems}
                      value={maritalStatus}
                      onChange={(item) => {
                        setMaritalStatusFilter(item.value);
                        setMaritalStatus(item);
                      }}
                    />

                    <SelectComponent
                      title="Education"
                      data={educationitems}
                      value={education}
                      onChange={(item) => {
                        setEducationFilter(item.value);
                        seteducation(item);
                      }}
                    />
                  </View>
                </View>
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

            keyExtractor={(item) => item.clientid.toString()}
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
