import header from '@/assets/appabc.png';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import * as Application from "expo-application";
import ToastManager, { Toast } from "expo-react-native-toastify";
import Constants from "expo-constants";
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Loading from '../loading';
import { useStore } from '../store';
export default function App() {
  const [updateMessage, setUpdateMessage] = useState(false);
  const checkUpdate = async () => {
    try {
    const res = await fetch("https://skworld.org/appversion.json");
    const data = await res.json();
const currentVersion = Constants.expoConfig?.version;
console.log(data.latestVersion)
console.log(currentVersion)
    if (currentVersion !== data.latestVersion) {
            setUpdateMessage(true);
      }else{
      setUpdateMessage(false);
    }
  } catch (err) {
    console.log("Update check failed", err);
  }
};
  const mode =useColorScheme()??'light'
  const { user, setUser, setIsLoggedIn,refreshUser,loading,setLoading } = useStore();
  useEffect(()=>{
    checkUpdate();
    setLoading(false)
  },[user])
const [refreshing, setRefreshing] = useState(false);
  const [message, setmessage] = useState(null);
  const LogOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/login');
  };
const onRefresh = async () => {
  if (!user?.userId) return;
  setLoading(true);
  setRefreshing(true);
  try {
    await refreshUser(user?.userId);
    checkUpdate();
  } finally {
    setRefreshing(false);
    setLoading(false);
  }
};
  useEffect(() => {
    checkUpdate();
  }, []);
  const showToasts = () => {
    Toast.info(`${message}`,{position:'top'});
  }
  useEffect(() => {
    message !== null && showToasts()
    checkUpdate()
  }, [message])
const MenuCard = ({ colors, angle, icon, text, onPress }) => (
  <LinearGradient
    colors={colors}
    start={angle.start}
    end={angle.end}
    style={styles.gradientBox}
  >
    <BlurView intensity={40} tint="systemChromeMaterialDark" style={styles.blurBox}>
      <TouchableOpacity onPress={onPress} style={styles.cardButton}>
        <Ionicons color="white" name={icon} size={24} style={{ marginRight: 8 }} />
        <Text style={styles.cardText}>{text}</Text>
      </TouchableOpacity>
    </BlurView>
  </LinearGradient>
);
 if(loading==true){
  return <><Loading/></>
 }
  return (
    <>
      {/* TOP AVATAR */}
      {/* <View style={styles.avatarWrap}>
        <Avatar alt="Photo" size="lg">
          <Avatar.Fallback>
            <Ionicons color={'white'} name="person" size={22} />
          </Avatar.Fallback>
        </Avatar>
      </View> */}

      <ScrollView   refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#ffffff"           // iOS spinner color
      colors={['#9333ea', '#ec4899']} // Android spinner colors
    />
  } contentContainerStyle={{ padding: 15,marginTop:10 }}>
<ToastManager />


<Card className="items-center justify-center self-center">
        {/* WELCOME TEXT */}
        <ImageBackground className='object-contain flex-row justify-center items-center text-center self-center' source={header} style={{height:120,width:240}}>
        <View className='justify-center items-center text-center' >
          <Text  className="mt-[60px] flex-row justify-center items-center text-center text-zinc-100" >
         
          Welcome 
        </Text><Text style={styles.welcomeText}>{user !== null ? user?.name : "Guest"}</Text></View>
</ImageBackground>
{updateMessage!==false &&<Button size='sm' onPress={() => Linking.openURL("https://skworld.org/SKMatrimonial.apk")}><LinearGradient
              colors={["red", "red"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            /><Button.Label>Update App</Button.Label></Button>}

  <View style={styles.row}>
          <MenuCard
            colors={['#ff6b6b', '#1f1f1f']}
            angle={{ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }}
            icon="people"
            text="My Clients"
            onPress={()=>router.push('/myclients')}
          />

          <MenuCard
            colors={['#3458eb', '#1f1f1f']}
            angle={{ start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }}
            icon="search"
            text="Search Profiles"
            onPress={()=>router.push('/search')}
          />
        </View>

        {/* ---------- ROW 2 ---------- */}
        <View style={styles.row}>
          <MenuCard
            colors={['#1dcf72', '#1f1f1f']}
            angle={{ start: { x: 0, y: 1 }, end: { x: 1, y: 0 } }}
            icon="person-add"
            text="Add Client"
            onPress={()=>router.push('/addclient')}
          />

          <MenuCard
            colors={['#b30047', '#1f1f1f']}
            angle={{ start: { x: 1, y: 1 }, end: { x: 0, y: 0 } }}
            icon="create"
            text="Update Client"
            onPress={()=>router.push('/updateclients')}
          />
        </View>

        {/* ---------- ROW 3 ---------- */}
        <View style={styles.row}>
          <MenuCard
            colors={['#8e44ad', '#1f1f1f']}
            angle={{ start: { x: 0.5, y: 0 }, end: { x: 1, y: 1 } }}
            icon="sync"
            text="Update MM Profile"
            onPress={()=>router.push('/updatemmprofile')}
          />

          <MenuCard
            colors={['#f39c12', '#1f1f1f']}
            angle={{ start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }}
            icon="checkmark-circle"
            text="Verify MM Profile"
            onPress={()=>router.push('/verifymmprofile')}
          />
        </View>

        {/* ---------- ROW 4 ---------- */}
        <View style={styles.row}>
          <MenuCard
            colors={['#9b59b6', '#1f1f1f']}
            angle={{ start: { x: 0, y: 1 }, end: { x: 1, y: 0 } }}
            icon="list"
            text="View MM List"
            onPress={()=>router.push('/allmmprofiles')}
          />

          <MenuCard
            colors={['#000000', '#434343']}
            angle={{ start: { x: 1, y: 0 }, end: { x: 1, y: 1 } }}
            icon="log-out"
            text="Logout"
            onPress={LogOut}
          />
        </View>

</Card>
        {/* ---------- ROW 1 ---------- */}
      
        <StatusBar style="light" />

      </ScrollView>
    </>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  
  avatarWrap: {
    padding: 20,
    alignItems: "center",
  },
welcomeText: {
  fontSize: 18,
  color: 'white',
  fontWeight: '600',
  textAlign: 'center'
},


  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  gradientBox: {
    padding: 2,
  
    borderRadius: 12,
    width: "50%",
    marginHorizontal:5,
  },
 cardButton: {
  flexDirection: "row",
  flexWrap: "wrap",
  backgroundColor: "transparent",
  paddingVertical: 15,
  borderRadius: 10,
  height: 60,
  justifyContent: "center",
  alignItems: "center",
},

  cardText: {
  color: "white",
  fontSize: 13,
  fontWeight: "600",
  flexShrink: 1,
  flexWrap: "wrap",
  textAlign: "center",
  maxWidth: 80,
},
  blurBox: {
  borderRadius: 12,
  overflow: "hidden",
  width: "100%",
},

});
