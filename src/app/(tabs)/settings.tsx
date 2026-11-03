import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Toast } from "expo-react-native-toastify";
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Card } from 'heroui-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';
import { API } from '../theme';
export default function App() {

  const { user, setUser, setIsLoggedIn,refreshUser } = useStore();
const [refreshing, setRefreshing] = useState(false);
const [message, setmessage] = useState(null);

const showToasts = () => {
  Toast.info(`${message}`,{position:'top'});
}
useEffect(() => {
  message !== null && showToasts()

}, [message])
  const LogOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/login');
  };
const onRefresh = async () => {
  if (!user?.userId) return;

  setRefreshing(true);
  try {
    await refreshUser(user?.userId);
  } finally {
    setRefreshing(false);
  }
};
  // 🔹 Reusable menu card component
  // const MenuCard = ({ colors, angle, icon, text, onPress }) => (
  //   <LinearGradient
  //     colors={colors}
  //     start={angle.start}
  //     end={angle.end}
  //     style={styles.gradientBox}
  //   >
  //     <TouchableOpacity onPress={onPress} style={styles.cardButton}>
  //       <Ionicons color="white" name={icon} size={22} style={{ marginRight: 8 }} />
  //       <Text style={styles.cardText}>{text}</Text>
  //     </TouchableOpacity>
  //   </LinearGradient>
  // );

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
  return (
    <><ScrollView  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#ffffff"           // iOS spinner color
      colors={['#9333ea', '#ec4899']} // Android spinner colors
    />
  }>
    <View className='justify-center items-center my-10 gap-1'><Avatar alt="profile"  className="w-[120px] h-[120px] mt-2 rounded-full">
            <Avatar.Image
      source={
      
      { uri: `${API}uploads/${user?.avatar}` }
    }
      className="w-full h-full"
      resizeMode="cover"
    >
  </Avatar.Image>
  <Avatar.Fallback>
    <Ionicons name="person" size={28} />
  </Avatar.Fallback>
</Avatar>
<Text>{user?.name}</Text>
</View>
<Card className='p-5 m-5'>
  
      

        {/* ---------- ROW 3 ---------- */}
        <View className=' gap-2' >
          <MenuCard
            colors={['#8e44ad', '#1f1f1f']}
            angle={{ start: { x: 0.5, y: 0 }, end: { x: 1, y: 1 } }}
            icon="sync"
            text="Update Profile"
            onPress={()=>router.push('/updatemmprofile')}
          />

          <MenuCard
            colors={['#f39c12', '#1f1f1f']}
            angle={{ start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }}
            icon="checkmark-circle"
            text="Verify MM Profile"
            onPress={()=>router.push('/verifymmprofile')}
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
       
      
  

      </ScrollView>
    </>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({

  
  gradientBox: {
    padding: 2,
  
    borderRadius: 12,
    marginHorizontal:5,
  },
 cardButton: {
  flexDirection: "row",
  flexWrap: "wrap",
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
