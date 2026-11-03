// store.js
import axios from 'axios';
import { Text, useColorScheme } from 'react-native';
import { create } from 'zustand';
import { API } from './theme';

export const useStore = create((set) => ({
  mode:useColorScheme??"light",
  count: 0,
  user: null,
  clients: [],
  loading:false,
  userclients: [],
  usermessages: [],
  uclength: [],
  isLoggedIn: false,
  selectedClient: null,
  selectedMessage: null,
  selectedmm: null,
  allmms: [],
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setLoading: (loading) => set({ loading }),
  setUser: (user) => set({ user }),
  setClients: (clients) => set({ clients }),
  setallmms: (allmms) => set({ allmms }),
  setSelectedmm: (selectedmm) => set({ selectedmm: selectedmm }),
  setUserClients: (userclients) => set({ userclients }),
  setUserMessages: (usermessages) => set({ usermessages }),
  setuclength: (uclength) => set({ uclength }),
  increase: () => set((state) => ({ count: state.count + 1 })),
  setSelectedClient: (selectedClient) => set({ selectedClient: selectedClient }),
  setSelectedMessage: (selectedMessage) => set({ selectedMessage: selectedMessage }),
  
  refreshClients: async () => {
    try {
           const response = await fetch(`${API}clients/search`);
      const freshClients = await response.json();

      if (freshClients) {
        set({ clients: freshClients.data }); // ✅ CORRECT
        set({ loading: false });
      }

      return freshClients;
    } catch (error) {
      console.error('refreshUser error:', error);
      set({ loading: false });
      throw error;
    }
  },
  refreshSelectedClient: async (id) => {
    try {
           const response = await fetch(`${API}clients/view/single/${id}`);
      const latestclient = await response.json();
        console.log(latestclient?.data[0])
      if (latestclient) {
        set({ selectedClient: latestclient?.data[0] }); // ✅ CORRECT
        set({ loading: false });
      }

      return latestclient;
    } catch (error) {
      console.error('refreshUser error:', error);
      set({ loading: false });
      throw error;
    }
  },
  refreshMyClients: async (id) => {
    try {
      const res = await fetch(`${API}clients/view/${id}`);
      const myClient = await res.json();

    

      if (myClient) {
        set({ userclients: myClient?.data }); // ✅ CORRECT
        set({ loading: false });
      }
      if(myClient){
      }
      return myClient;
    } catch (error) {
      set({ loading: false });
      console.error('refreshUser error:', error);
      throw error;
    }
  },
  refreshMessages: async (id) => {
    try {
      const res = await fetch(`${API}messages/${id}`);
      const myClient = await res.json();

    

      if (myClient) {
        set({ usermessages: myClient?.data }); // ✅ CORRECT
        set({ loading: false });
      }
      if(myClient){
      }
      return myClient;
    } catch (error) {
      set({ loading: false });
      console.error('refreshUser error:', error);
      throw error;
    }
  },
  refreshMyClientsCount: async (id) => {
    try {
      const res = await axios.get(`${API}clients/view/${id}`);
       if (res.data) {
        set({ uclength: res?.data?.data?.length });
        set({ loading: false });
      }
      return null
    } catch (error) {
       if(error.status==404){
        set({ uclength: [] });
      }
      set({ loading: false });
    }
  },
  refreshUser: async (id) => {
    try {
      const res = await axios.get(`${API}getuser/${id}`);
      const freshUser = res?.data?.data;

      if (freshUser) {
        set({ user: freshUser }); // ✅ CORRECT
        set({ loading: false });
      }

      return freshUser;
    } catch (error) {
      console.error('refreshUser error:', error);
      set({ loading: false });
      throw error;
    }
  },
}));
const AppStore=()=>{
  return(
    <>
    <Text>Hi From Store</Text> 
    </>
  )
}

export default AppStore