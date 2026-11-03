import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { Alert, Linking } from "react-native";
import { useStore } from "./store";
import { API } from "./theme";

/**
 * Build WhatsApp message text
 */
const buildWhatsAppMessage = (client) => `\n \n \n Proposal Details\n 
          \n Proposal Type:${client.proptype}
          \n Sharing Type:${client.shareamount}
          \n Amount In Rupees:${client.amount}
          \n Proposal Priority:${client.propprio}
          \n Proposal For:${client.propfor} 
          \n \n \n Personal Details\n 
          \n Profile By:${client.role}
          \n Gender:${client.gender}
          \n Name:${client.name}
          \n Age:${client.age}
          \n Height:${client.height}
          \n Marital Status:${client.maritalstatus}
          \n Divorce Reason:${client.divorcereason}
          \n Children:${client.children}
          \n Education:${client.education}
          \n Job:${client.job}
          \n Business:${client.business}
          \n Income:${client.income}
          \n Language:${client.language}
          \n Cast:${client.cast}
          \n Maslak:${client.maslak}
          \n Complexion:${client.complexion}
          \n \n \n Family Details\n 
          \n Belongs:${client.belongs}
          \n Family Status:${client.familystatus}
          \n Home Type:${client.hometype}
          \n Home Size:${client.homesize}
          \n Father:${client.father}
          \n Mother:${client.mother}
          \n Brothers:${client.brothers}
          \n Sisters:${client.sisters}
          \n \n \n Residential Details\n 
          \n Area:${client.area}
          \n Full Address:${client.fulladdress}
          \n Country:${client.country}
          \n Province:${client.province}
          \n City:${client.city}
          \n \n \n Requirement Details\n 
          \n Age From:${client.reqage}
          \n Age To:${client.reqageto}
          \n Cast:${client.reqcast}
          \n Maslak:${client.reqmaslak}
          \n Education:${client.reqeducation}
          \n Height:${client.reqheight}
          \n Marital Status:${client.reqmaritalstatus}
          \n Family Status:${client.reqfamilystatus}
          \n Country:${client.reqcountry}
          \n Province:${client.reqprovince}
          \n City:${client.reqcity}
          \n \n \n Other Details\n 
          \n Description:${client.description}`;

/**
 * Share profile image + open WhatsApp with text
 */
export const shareClientProfile = async (client) => {
  try {
    const imageUrl = `${API}uploads/${client.avatar}`;
    const localUri = `${FileSystem.cacheDirectory}${client.avatar}`;

    const download = await FileSystem.downloadAsync(imageUrl, localUri);

    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert("Sharing not available on this device");
      return;
    }

    // Share image
    await Sharing.shareAsync(download.uri, {
      dialogTitle: "Share Client Profile",
      mimeType: "image/jpeg",
    });

    // Open WhatsApp with message
    const message = buildWhatsAppMessage(client);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    await Linking.openURL(waUrl);
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Unable to share profile");
  }
};

/**
 * WhatsApp ONLY (no image)
 */
export const openWhatsApp = (client) => {
  const message = buildWhatsAppMessage(client);
  const phone = client?.ccode + client?.contact;

  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(() => {
    Alert.alert("WhatsApp is not installed on this device.");
  });
};
export const sendMessage = (item) => {
  const { setSelectedMessage, user } = useStore.getState(); // ✅ Correct usage
  (setSelectedMessage(null),
    setSelectedMessage({
      message_id: item?.matchmakerid + user?.userId,
      receiver_id: item?.matchmakerid,
      receiver_name: item?.matchmakername,
      receiver_photo: item?.matchmakerphoto,
    }));

  router.push("/(tabs)/messageview");
};

export default function share() {
  return null;
}
