import { SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';


import { Redirect } from "expo-router";
import { View } from 'react-native';
import Loading from './loading';
import { useStore } from './store';
import useFonts from './usefonts';
export default function App() {
  const { user, setUser, count, increase,isLoggedIn,setIsLoggedIn,loading,setLoading,mode } = useStore();

  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      await SplashScreen.preventAutoHideAsync();
      await useFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    load();
  }, []);
if(loading==true){
  return <><Loading/></>
 }

  if (!fontsLoaded) return null;

  const LoginDummy=()=>{
     setUser({"address": null, "adminrole": null, "area": null, "avatar": "1730684850805-me.jpg", "businessname": null, "ccode": "+92", "cdate": "2025-05-01T03:58:57.000Z", "charges": null, "city": "Kandiaro", "cnic": null, "country": "Pakistan", "description": null, "email": "ten3live@gmail.com", "fb": null, "fees": null, "gender": "Male", "groupname": null, "groupowner": null, "id": 641, "ig": null, "landline": null, "name": "Sajjad Ali", "nonreg": null, "password": "sajjadali7", "phone": "3058452372", "province": "Sindh", "reggov": null, "reggroup": null, "role": "user", "status": "enabled", "tt": null, "udate": "2024-11-04T01:47:30.000Z", "userId": "sk00311", "verified": "yes", "whatsapp": null, "workarea": null, "workingas": null, "workname": null, "yt": null})
      setIsLoggedIn(true)
    }
  const LogOut=()=>{
     setUser(null)
    setIsLoggedIn(false)
    }
  return (<View>
    {isLoggedIn
    ? <Redirect href="/(tabs)/home" />
    : <Redirect href="./login" />}
    </View>)
}