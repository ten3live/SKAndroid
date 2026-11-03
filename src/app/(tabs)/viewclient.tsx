import moment from "moment";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useStore } from "../store";
import { API } from "../theme";

const ViewClient = () => {
  const { selectedClient,mode,user } = useStore();

  if (!selectedClient) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No client selected.</Text>
      </View>
    );
  }

  const sc = selectedClient; // shortcut

  return (
    <ScrollView style={{ padding: 12 }} showsVerticalScrollIndicator={false}>
      
      {/* ---------- Images Row ---------- */}
      {user?.role=="guest"?null:<View style={styles.imageRow}>
        {[sc.avatar, sc.photo1, sc.photo2].map((img, i) => (
          <TouchableOpacity key={i}>
            <Image
              source={{ uri: `${API}uploads/${img || "default.jpg"}` }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        ))}
      </View>}

      {/* ---------- CARD ---------- */}
      <View style={styles.card}>
        
        <Text style={styles.name}>{sc?.name?.toUpperCase()}</Text>

        {/* ---------- SECTIONS ---------- */}

        <Section title="Proposal Details">
          <Row label="Type" value={sc.proptype} />
          <Row label="Share Type" value={sc.shareamount} />
          <Row label="Share Amount" value={sc.amount} />
          <Row label="Origin" value={sc.propfor} />
          <Row label="Priority" value={sc.propprio} />
        </Section>

        <Section title="Profile Details">
          <Row label="Client ID" value={sc.clientid?.toUpperCase()} />
          <Row label="Profile By" value={sc?.role==="matchmaker"?"MM":"Candidate"} />
          <Row label="Matchmaker Name" value={sc.matchmakername?.toUpperCase()} />
          <Row label="Client Name" value={sc.name?.toUpperCase()} />
          <Row label="Age" value={sc.age} />
          <Row label="Gender" value={sc.gender} />
          <Row label="Height" value={sc.height} />
          <Row label="Cast" value={sc.cast} />
          <Row label="Maslak" value={sc.maslak} />
          <Row label="Marital Status" value={sc.maritalstatus} />
          <Row label="Divorce Reason" value={sc.divorcereason} />
          <Row label="Children" value={sc.children} />
          <Row label="Education" value={sc.education} />
          <Row label="Education Details" value={sc.educationbrief} />
          <Row label="Language" value={sc.language} />
          <Row label="Complexion" value={sc.complexion} />
          <Row label="Job" value={sc.job} />
          <Row label="Business" value={sc.business} />
          <Row label="Income" value={sc.income} />
        </Section>

        <Section title="Residence Details">
          <Row label="Belongs" value={sc.belongs} />
          <Row label="City" value={sc.city} />
          <Row label="Province" value={sc.province} />
          <Row label="Country" value={sc.country} />
          <Row label="Area" value={sc.area} />
          <Row label="Full Address" value={sc.fulladdress} />
          <Row label="Family Status" value={sc.familystatus} />
          <Row label="Home Type" value={sc.hometype} />
          <Row label="Home Size" value={sc.homesize} />
          <Row label="Father" value={sc.father} />
          <Row label="Mother" value={sc.mother} />
          <Row label="Brothers" value={sc.brothers} />
          <Row label="Sisters" value={sc.sisters} />
        </Section>

        <Section title="Requirement Details">
          <Row label="Age" value={sc.reqage} />
          <Row label="Age To" value={sc.reqageto} />
          <Row label="Height" value={sc.reqheight} />
          <Row label="Marital Status" value={sc.reqmaritalstatus} />
          <Row label="Maslak" value={sc.reqmaslak} />
          <Row label="Education" value={sc.reqeducation} />
          <Row label="Cast" value={sc.reqcast} />
          <Row label="Family Status" value={sc.reqfamilystatus} />
          <Row label="City" value={sc.reqcity} />
          <Row label="Province" value={sc.reqprovince} />
          <Row label="Country" value={sc.reqcountry} />
        </Section>

        <Section title="Description">
          <Text style={styles.tag}>{sc.description || "No Description"}</Text>
        </Section>

        <Section title="Profile Created On">
          <Text style={styles.tag}>
            {sc?.cdate
              ? moment.utc(sc.cdate).utcOffset(300).format("YYYY-MM-DD h:mm A")
              : ""}
          </Text>
        </Section>

      </View>
    </ScrollView>
  );
};

/* -------------------- SMALL UI COMPONENTS -------------------- */

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "—"}</Text>
  </View>
);

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 10,
  },

  avatar: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: "#555",
    width: "45%",
  },

  value: {
    fontSize: 14,
    color: "#222",
    width: "50%",
    textAlign: "right",
    fontWeight: "600",
  },

  tag: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    fontSize: 14,
    color: "#444",
  },
});

export default ViewClient;