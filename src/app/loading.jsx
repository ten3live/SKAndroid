import { Spinner } from "heroui-native";
import { StyleSheet, Text, View } from "react-native";
import { useStore } from "./store";


import { MaterialCommunityIcons } from "@expo/vector-icons";
const loading = () => {
const {mode}=useStore()
  return (
    <View >
     <View className="h-screen justify-center self-center items-center text-center">
          <Spinner style={{height:80,width:80}} color="#EC4899">
          <Spinner.Indicator animation={{ rotation: { speed: 0.7 } }}>
            <MaterialCommunityIcons name="ring" size={80} color="#EC4899" />
           
          </Spinner.Indicator>
        </Spinner>
         <Text className="text-pink-600">Loading...</Text>
        </View>
    </View>
  )
}

export default loading

const styles = StyleSheet.create({})