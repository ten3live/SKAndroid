
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router, useFocusEffect } from "expo-router";
import { Button, Avatar } from "heroui-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Loading from "../loading";
import { useStore } from "../store";
import { API } from "../theme";

const MyClients = () => {
  const {
    user,
    usermessages,
    setUserMessages,
    setSelectedMessage,
    loading,
    setLoading,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);

      const response = await axios.get(`${API}messages/${user?.userId}`);
      const list = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      // Remove duplicate message_id
      const uniqueMessages = list.filter(
        (item, index, self) =>
          index === self.findIndex(m => m.message_id === item.message_id)
      );

      setUserMessages(uniqueMessages);
    } catch (error) {
      Toast.error("Failed to load messages", { position: "top" });
    } finally {
      setLoading(false);
    }
  };

  // ================= ON SCREEN FOCUS =================
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user?.userId])
  );

  // ================= PULL TO REFRESH =================
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // ================= ACCESS CONTROL =================
  if (user?.role === "guest") {
    return (
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text>Only Users & Matchmakers can view this page</Text>
        <Button onPress={() => router.back()}>
          <Button.Label>Back</Button.Label>
        </Button>
      </View>
    );
  }

  if (loading && !refreshing) {
    return <Loading />;
  }
const handleMessage = (item) => {
  setSelectedMessage(null)
  if (!item || !user?.userId) return;

  const isSenderMe = item.sender_id === user?.userId;

  setSelectedMessage({
    message_id: item.message_id,

    receiver_id: isSenderMe
      ? item.receiver_id
      : item.sender_id,

    receiver_name: isSenderMe
      ? item.receiver_name
      : item.sender_name,

    receiver_photo: isSenderMe
      ? item.receiver_image || null
      : item.sender_image || null,
  });

  router.push("/(tabs)/messageview");
};

  // ================= RENDER CARD =================
  const renderCard = ({ item }) => {
  const isSenderMe = item.sender_id === user?.userId;

  const name = isSenderMe
    ? item.receiver_name
    : item.sender_name;

  const avatar = isSenderMe
    ? item.receiver_image
    : item.sender_image;

  return (<>
    <TouchableOpacity
      onPress={() => handleMessage(item)}
      style={styles.row}
      activeOpacity={0.7}
    >
      <Avatar alt="profile" style={styles.avatar}>
        <Avatar.Image source={{ uri: `${API}uploads/${avatar}` }} />
        <Avatar.Fallback>
          <Ionicons name="person" size={26} />
        </Avatar.Fallback>
      </Avatar>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.time}>
            {item.date}
          </Text>
        </View>

        <Text style={styles.message} numberOfLines={1}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
    </>
  );
};


  // ================= UI =================
  return (
    <View className="bg-white h-screen">
      <ToastManager />

      <FlatList
        data={usermessages}
        renderItem={renderCard}
        keyExtractor={item => item.id?.toString()}
        ListHeaderComponent={()=><View className="justify-center items-center my-5"><Text className="text-xl">Messages</Text></View>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9333ea", "#ec4899"]}
            tintColor="#9333ea"
          />
        }
      
        ListEmptyComponent={<View style={styles.emptyContainer}><Text>No messages found</Text></View>}
      />
    </View>
  );
};



const styles=StyleSheet.create({
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderTopWidth: 1,
  borderColor: "#e5e5e5",
  backgroundColor: "#fff",
},



myBubble: {
  maxWidth: "100%",
  padding: 5,
  borderRadius: 18,
  backgroundColor: "#f3f3f3",

},

otherBubble: {
  maxWidth: "100%",
  backgroundColor: "#f3f3f3",
  padding: 5,
  borderRadius: 18,


},

myText: {
  color: "#fff",
  fontSize: 15,
},

otherText: {
  color: "#222",
  fontSize: 15,
},

emptyContainer:{
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
},
row: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: "#eee",
  backgroundColor: "#fff",
},

avatar: {
  width: 46,
  height: 46,
  borderRadius: 23,
  marginRight: 12,
},

content: {
  flex: 1,
},

topRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

name: {
  fontSize: 16,
  fontWeight: "600",
  color: "#111",
  maxWidth: "70%",
},

message: {
  fontSize: 14,
  color: "#666",
  marginTop: 4,
},

time: {
  fontSize: 12,
  color: "#999",
},


})


export default MyClients;
