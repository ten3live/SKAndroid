import { LinearGradient } from "expo-linear-gradient";
import ToastManager from "expo-react-native-toastify";
import { useFocusEffect } from "expo-router";
import { Avatar, Button, Input, TextField } from "heroui-native";

import { useCallback, useState } from "react";

import axios from "axios";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Loading from "../loading";
import { useStore } from "../store";
import { API } from "../theme";
const MyClients = () => {
  const { user, selectedMessage, loading } = useStore();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API}messages/all/${selectedMessage?.message_id}`,
      );
      console.log(response.data.data);
      setMessages(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const VALUES = {
        message_id: selectedMessage?.message_id,
        content: message,
        senderId: user?.userId,
        senderName: user?.name,
        senderImage: user?.avatar,
        receiverId: selectedMessage?.receiver_id,
        receiverName: selectedMessage?.receiver_name,
        receiverImage: selectedMessage?.receiver_photo,
        date: formatDate(new Date()),
      };

      await axios.post(`${API}messages`, VALUES);
      setMessage("");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [selectedMessage, user?.userid]),
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  if (loading && !refreshing) {
    return <Loading />;
  }

  const renderCard = ({ item }) => {
    const isMe = item?.sender_id === user?.userId;

    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        {!isMe && (
          <Avatar alt="profile" style={styles.avatar}>
            <Avatar.Image
              source={{ uri: `${API}uploads/${item?.sender_image}` }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <Avatar.Fallback>
              <Ionicons name="person" size={28} />
            </Avatar.Fallback>
          </Avatar>
        )}

        {isMe ? (
          <LinearGradient
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.myBubble}
          >
            <Text style={styles.myText}>{item?.content}</Text>
            <Text style={styles.mytime}>{item?.date}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.otherBubble}>
            <Text style={styles.otherText}>{item?.content}</Text>
            <Text style={styles.time}>{item?.date}</Text>
          </View>
        )}

        {isMe && (
          <Avatar alt="profile" style={styles.avatar}>
            <Avatar.Image
              source={{ uri: `${API}uploads/${user?.avatar}` }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <Avatar.Fallback>
              <Ionicons name="person" size={28} />
            </Avatar.Fallback>
          </Avatar>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ToastManager />

      {/* CHAT LIST */}
      <FlatList
        data={messages}
        renderItem={renderCard}
        keyExtractor={(item) => item.id?.toString()}
        ListHeaderComponent={() => (
          <View className="justify-center items-center mt-5">
            <Text className="text-xl">
              {selectedMessage ? selectedMessage.receiver_name : "New Message"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No messages found</Text>
          </View>
        }
        contentContainerStyle={{ paddingVertical: 10 }}
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9333ea", "#ec4899"]}
            tintColor="#9333ea"
          />
        }
      />

      <View style={styles.inputContainer}>
        <TextField className="mr-3 flex-1">
          <Input
            style={{ flex: 1, marginRight: 8 }}
            placeholder="Enter Message..."
            value={message}
            onChangeText={setMessage}
          />
        </TextField>

        <Button onPress={sendMessage}>
          <LinearGradient
            colors={["#9333ea", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Button.Label>Send</Button.Label>
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    paddingHorizontal: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },

  myBubble: {
    marginTop: 15,
    maxWidth: "70%",
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#f3f3f3",
    borderBottomRightRadius: 4,
  },

  otherBubble: {
    marginTop: 15,
    maxWidth: "70%",
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },

  myText: {
    color: "#fff",
    fontSize: 15,
  },
  emptyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  otherText: {
    color: "#222",
    fontSize: 15,
  },

  time: {
    color: "#0a0a0a",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  mytime: {
    color: "#fafafa",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
export default MyClients;
