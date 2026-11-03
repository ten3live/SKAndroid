import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false,tabBarActiveTintColor:"purple",tabBarActiveBackgroundColor:"white",tabBarInactiveBackgroundColor:"#ebebeb" }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={28} color={"grey"} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Feather name="search" size={28} color={"grey"} />,
        }}
      />
        <Tabs.Screen
        name="messagelist"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <Feather name="message-square" size={28} color={"grey"} />,
        }}
      />
      <Tabs.Screen
        name="addclient"
        options={{
          title: "Add Client",
          tabBarIcon: ({ color }) => <Ionicons name="person-add-outline" size={28} color={"grey"} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Feather name="settings" size={28} color={"grey"} />,
        }}
      />
      <Tabs.Screen
        name="myclients"
        options={{
          title: "My Clients",
          href:null,
        }}
      />
    
      <Tabs.Screen
        name="messageview"
        options={{
          title: "My Clients",
          href:null,
        }}
      />
      <Tabs.Screen
        name="userdetails"
        options={{
          title: "My Clients",
          href:null,
        }}
      />
      <Tabs.Screen
        name="find"
        options={{
          title: "My Clients",
          href:null,
        }}
      />
      <Tabs.Screen
        name="viewclient"
        options={{
          title: "Client Details",
          href:null,
        }}
      />
      <Tabs.Screen
        name="updateclients"
        options={{
          title: "Update Clients",
          href:null,
        }}
      />
      <Tabs.Screen
        name="updatemmprofile"
        options={{
          title: "Update MM Profile",
          href:null,
        }}
      />
      <Tabs.Screen
        name="verifymmprofile"
        options={{
          title: "Verify MM Profile",
          href:null,
        }}
      />
      <Tabs.Screen
        name="allmmprofiles"
        options={{
          title: "All MM Profiles",
          href:null,
        }}
      />
      <Tabs.Screen
        name="updateclient"
        options={{
          title: "All MM Profiles",
          href:null,
        }}
      />
     
    </Tabs>
  );
}
