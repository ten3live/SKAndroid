import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { router, useFocusEffect } from "expo-router";
import { Button, Dialog } from "heroui-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loading from "../loading";
import { useStore } from "../store";
import { API } from "../theme";

const MyClients = () => {
  const { user, userclients, setUserClients,setSelectedClient,loading,setLoading,refreshMyClientsCount } = useStore();
    const [clientToDelete, setClientToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [message, setmessage] = useState(null);
   
  const showToasts = () => {
    Toast.info(`${message}`,{position:'top'});
  }

  const fetchData = async () => {
    if (!user?.userId) return;

    try {
      const response = await fetch(`${API}clients/view/${user?.userId}`);
      const data = await response.json();

      if (data?.data) {
        setUserClients(data.data);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching data:", error);
    }
  };
useFocusEffect(
  useCallback(() => {
  fetchData()
  }, []))
  
  useEffect(() => {
    message !== null && showToasts()

  }, [message])
 if(loading==true){
  return <><Loading/></>
 }


 const handleBlock = async client => {
    const newStatus = client?.status === 'disabled' ? 'enabled' : 'disabled';
    const clientid = client?.clientid;
    try {
      const response = await axios.put(
        `${API}clients/updatestatus/${clientid}/${newStatus}`,
      );
      if (response.data.message) {
        fetchData(); // This will refresh the list and show the new status
      }
    } catch (error) {}
  };
if(user?.role == "guest"){
    return (<View className="mt-20 p-5">
      <Text>Only Users , Matchmakers can View This Page</Text>
      <Button className="bg-black mt-5" onPress={()=>router.back()}>
        <Button.Label>Back</Button.Label>
      </Button>
      </View>)
  }
  const handleYesDelete = async client => {
    setShowModal(false);

    try {
      const response = await axios.post(
        `${API}clients/delete/${client}`,
      );
      if (response.status==200) {
        Toast.success("Deleted Successfully", { position: "top" });
        const data = prevClients =>
          prevClients.filter(c => c.clientid !== client);
        setUserClients(data);
        refreshMyClientsCount(user?.userId);
        fetchData();
   
}    } catch (err) {
    const errorMessage = err.response?.data?.message || "Update failed";
    console.error("Update Error:", errorMessage);
    
    // Trigger Error Toast IMMEDIATELY
    Toast.error(errorMessage, { position: "top" });
  }

  };

  const handleDelete = async client => {
    setShowModal(true);
    setClientToDelete(client)
  };
  const handleEdit = async client => {
    setSelectedClient(client)

    router.push("/(tabs)/updateclient");
  };

const passdata=(item)=>{
console.log(item)
  setSelectedClient(item)
  router.push('/(tabs)/viewclient')
}

const renderCard = ({ item }) => (<>
  <TouchableOpacity onPress={()=>passdata(item)}>
  <View style={styles.card}>
   <View> 
    {/* Avatar */}
    <Image
      source={{
        uri: `${API}uploads/${item.avatar || "default.jpg"}`,
      }}
      style={styles.avatar}
    />
    <Text className={`rounded-xl mt-2 p-1 mx-2 text-center ${item.status=="disabled"?" bg-red-400 text-white":" text-green-500 bg-[#f0f0f0]"}`}>{item.status!=="disabled"?"Enabled":"Disabled"}</Text>
    <Text style={styles.tag} className="mt-2">ID: {item.clientid}</Text>
    <Text style={styles.tag} className="mt-1">Gender: {item.gender}</Text>
    <Text style={styles.tag} className="mt-1">Age: {item.age}</Text>
</View>
    {/* Main Info */}
    <View style={styles.info}>
      <Text style={styles.name}>{item.name.trim().toUpperCase()}</Text>

      <Text style={styles.detail}>{item.city}, {item.province}, {item.country}</Text>
      <Text style={styles.detail}>Education {item.education}</Text>
      <Text style={styles.detail}>Job {item.job || "Not provided"}</Text>

      {/* Tags */}
      <View style={styles.tagRow} >
        
         <Text style={styles.tag} className="mt-5">Marital Status: {item.maritalstatus}</Text>
      </View>

      <View style={styles.tagRow}>
       
          <Text style={styles.tag}>Cast: {item.cast}</Text>
        <Text style={styles.tag}>Maslak: {item.maslak}</Text>

      </View>

      <View style={styles.tagRow}>
    
        <Text style={styles.tag}>Matchmaker: {item.matchmakername}</Text>
      </View>

 
    </View>
  </View></TouchableOpacity>
  <View className="flex-row gap-2">
        <View><Button size="sm" className="" onPress={()=>handleBlock(item)}>
  {item?.status === "disabled" ?  <LinearGradient
                            colors={["blue", "black"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                          /> :  <LinearGradient
                            colors={["black", "black"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                          /> }
   
      <Button.Label>{item?.status === "disabled" ? "Unblock Client" : "Block Client"}</Button.Label>
    </Button></View>
    <View><Button size="sm" className="" onPress={()=>handleEdit(item)}>
    <LinearGradient           
                            colors={["black", "#ec4899"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                          />
      <Button.Label>Edit Client</Button.Label>
    </Button></View>
    <View><Dialog
  isOpen={showModal}
  onOpenChange={setShowModal}
  closeDelay={200} // Match this with closing animation duration
  animation={{
    entering: {
      type: 'spring',
      config: { damping: 130, stiffness: 1100 },
    },
    exiting: {
      type: 'timing',
      config: { duration: 200 }, // Should match closeDelay
    },
  }}
>
  <Dialog.Trigger><Button size="sm"  onPress={()=>handleDelete(item)}>
    <LinearGradient
                            colors={["red", "#ec4899"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                          />
      <Button.Label>Delete Client</Button.Label>
    </Button>
    
    </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content><Text className="my-10">You want to Delete this record ?</Text>
      <Text>{clientToDelete?.name}</Text>
      <Text>{clientToDelete?.clientid}</Text>
    
    <Button className="my-5" onPress={()=>{handleYesDelete(clientToDelete?.clientid)}}>
      <LinearGradient
                              colors={["red", "#ec4899"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
      <Button.Label>Yes</Button.Label>
    </Button>
     <Button   onPress={()=>setShowModal(false)}>
      <LinearGradient
                              colors={["#000000", "#000000"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
      <Button.Label>Cancel</Button.Label>
    </Button>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
    </View>

    
    
    
    
  </View>
  </>
);

  return (
    <>
    <ToastManager/>
    <View style={{ padding: 12 }}>
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
    color: "#0366d6",
    fontSize: 13,
    fontWeight: "600",
  },

});


export default MyClients;
