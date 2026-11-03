import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager from "expo-react-native-toastify";
import { router, useFocusEffect } from "expo-router";
import {openWhatsApp,shareClientProfile} from "../share";
import { Button } from "heroui-native";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import Loading from "../loading";
import { useStore } from "../store";
import { API } from "../theme";

const MyClients = () => {
  const {
    user,
    mode,
    userclients,
    setUserClients,
    setSelectedClient,
    setClients,
    refreshMyClients,
    loading,
    setLoading,
  } = useStore();

useFocusEffect(
   useCallback(() => {
       refreshMyClients(user?.userId);
   }, []))
if(user?.role == "guest"){
    return (<View className="mt-20 p-5">
      <Text>Only Users , Matchmakers can View This Page</Text>
      <Button className="bg-black mt-5" onPress={()=>router.back()}>
        <Button.Label>Back</Button.Label>
      </Button>
      </View>)
  }
  if (loading == true) {
    return (
      <>
        <Loading />
      </>
    );
  }
  const passdata = (item) => {
    console.log(item);
    setSelectedClient(item);
    router.push("/(tabs)/viewclient");
  };
  const findmatch = (item) => {
    console.log(item);
    setSelectedClient(item);
    router.push("/(tabs)/find");
  };


  const renderCard = ({ item }) => (
    <>
      <TouchableOpacity onPress={() => passdata(item)}>
        <View  style={styles.card}>
          <View>
            {/* Avatar */}
            <Image
              source={{
                uri: `${API}uploads/${item.avatar || "default.jpg"}`,
              }}
              style={styles.avatar}
            />
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
            <Text className="mt-1" style={styles.name}>{item.name.trim().toUpperCase()}</Text>

            <Text className="mt-1" style={styles.detail}>
              {item.city}, {item.province}, {item.country}
            </Text>
            <Text className="mt-1" style={styles.detail}>Education {item.education}</Text>
            <Text className="mt-1"style={styles.detail}>Job {item.job || "Not provided"}</Text>

            {/* Tags */}
            <View style={styles.tagRow}>
              <Text style={styles.tag} className="mt-5">
                Marital Status: {item.maritalstatus}
              </Text>
            </View>

            <View style={styles.tagRow}>
              <Text className="mt-1" style={styles.tag}>Cast: {item.cast}</Text>
              <Text className="mt-1" style={styles.tag}>Maslak: {item.maslak}</Text>
            </View>

            <View style={styles.tagRow}>
              <Text className="mt-1" style={styles.tag}>Matchmaker: {item.matchmakername}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View className="flex-row gap-2 mb-5">
        <Button size="sm" onPress={() => findmatch(item)}>
          <LinearGradient
            className=""
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Button.Label>Find Matches</Button.Label>
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
      <View  style={{ padding: 12 }}>
        {Array.isArray(userclients) && userclients?.length > 0 ? (
          <FlatList
            data={userclients}
            renderItem={renderCard}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View className="text-center self-center items-center justify-center h-screen"><Text>No clients found.</Text></View>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 15,
    marginTop: 18,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: "#fff",},

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
    marginBottom: 5,
  },

  detail: {
    fontSize: 14,
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
    marginBottom: 6,
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
    fontSize: 13,
    fontWeight: "600",
  },
});

export default MyClients;
