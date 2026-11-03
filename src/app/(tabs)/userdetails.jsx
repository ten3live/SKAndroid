import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Button } from "heroui-native";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import imaged from "../../../assets/skavatar.png";
import { useStore } from "../store";
import { API } from "../theme";

export default function Details({ route, navigation }) {
  const { selectedmm } = useStore();
  const imageURL = `${API}uploads/${selectedmm?.avatar}`;

  return (
    <View>
      <ScrollView style={{ marginHorizontal: 10, padding: 10 }}>
        <Button
          className="mt-10"
          style={{ borderRadius: 10, width: 80, height: 40 }}
          onPress={() => router.push("allmmprofiles")}
        >
          <LinearGradient
            colors={["#000000", "#000000"]}
            style={StyleSheet.absoluteFill}
          ></LinearGradient>
          <Button.Label>Back</Button.Label>
        </Button>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            resizeMode="contain"
            source={{ uri: imageURL ? imageURL : imaged }}
            style={{
              borderRadius: 25,
              marginVertical: 10,
              width: 250,
              height: 300,
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Name</Text>
          <Text>{selectedmm?.name}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Gender</Text>
          <Text>{selectedmm?.gender}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Role</Text>
          <Text>{selectedmm?.role}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Contact</Text>
          <Text>{selectedmm?.phone}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>WhatsApp</Text>
          <Text>{selectedmm?.whatsapp}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Landline</Text>
          <Text>{selectedmm?.landline}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Email</Text>
          <Text>{selectedmm?.email}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Area</Text>
          <Text>{selectedmm?.area}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Address</Text>
          <Text>{selectedmm?.address}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>City</Text>
          <Text>{selectedmm?.city}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Province</Text>
          <Text>{selectedmm?.province}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Country</Text>
          <Text>{selectedmm?.country}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Work Name</Text>
          <Text>{selectedmm?.workname}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Business Name</Text>
          <Text color="black">{selectedmm?.businessname}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Registered with a Govt Organization</Text>
          <Text>{selectedmm?.reggov}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Registered Group</Text>
          <Text>{selectedmm?.reggroup}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Non Registered Single Matchmaker</Text>
          <Text color="black">{selectedmm?.nonreg}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Work Area</Text>
          <Text>{selectedmm?.workarea}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Working As</Text>
          <Text>{selectedmm?.workingas}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Group Name</Text>
          <Text>{selectedmm?.groupname}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Charge in Advance</Text>
          <Text color="black">{selectedmm?.charges}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Fees Structure</Text>
          <Text>{selectedmm?.fees}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Group Admin</Text>
          <Text>{selectedmm?.groupowner}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Description</Text>
          <Text>{selectedmm?.description}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Facebook</Text>
          <Text color="black">{selectedmm?.fb}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Instagram</Text>
          <Text>{selectedmm?.ig}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Youtube</Text>
          <Text>{selectedmm?.yt}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#f7f9fc",
            padding: 5,
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Tiktok</Text>
          <Text>{selectedmm?.tt}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardGradient: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    overflow: "hidden",
  },
});
