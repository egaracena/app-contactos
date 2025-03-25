import React, { useState, useEffect, useCallback } from "react";
import {
  BackHandler,
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native";
import * as Device from "expo-device";
import {
  subscribeToContacts,
  subscribeToContactsByArea,
  getAreas,
  addNewArea,
  initializeAreas,
} from "../storage/FireBaseService";
import { Ionicons } from '@expo/vector-icons';


const HomeScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [newArea, setNewArea] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]); // Lista filtrada para el buscador
  const isDesktop = Device.osName === "Windows" || Device.osName === "Mac OS";

  useFocusEffect(
    useCallback(() => {
      const fetchAreas = async () => {
        const fetchedAreas = await getAreas();
        setAreas(fetchedAreas);
      };
      fetchAreas();
    }, [])
  );

  useEffect(() => {
    const unsubscribe = selectedArea
      ? subscribeToContactsByArea(selectedArea, setContacts)
      : subscribeToContacts(setContacts);

    return () => unsubscribe();
  }, [selectedArea]);

  useEffect(() => {
    initializeAreas();
    const fetchAreas = async () => {
      const fetchedAreas = await getAreas();
      setAreas(fetchedAreas);
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android") {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleAddNewArea = async () => {
    if (!newArea.trim()) {
      Alert.alert("Error", "Debe ingresar un nombre para la nueva área.");
      return;
    }

    if (areas.includes(newArea)) {
      Alert.alert("Error", "Esta área ya existe.");
      return;
    }

    await addNewArea(newArea);
    setAreas([...areas, newArea]);
    setNewArea("");
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => {

        const fullName = `${contact.name} ${contact.lastName}`.toLowerCase();
        const searchTextLower = searchText.toLowerCase();
        const matchesName = fullName.includes(searchTextLower);
        const matchesNumber = contact.phones?.some(number =>
          number.includes(searchText)
        );
        const matchesPosition = contact.position?.toLowerCase().includes(searchTextLower);

        return matchesName || matchesNumber || matchesPosition;
      });

      setFilteredContacts(filtered);
    }
  }, [searchText, contacts]);


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER FIJO */}
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar contacto..."
            value={searchText}
            onChangeText={(text) => setSearchText(text.toUpperCase())} />
          <Picker
            selectedValue={selectedArea || ""}
            onValueChange={(value) => setSelectedArea(value)}
            style={styles.picker}
          >
            <Picker.Item label="TODOS" value="" />
            {areas.map((area, index) => (
              <Picker.Item key={index} label={area} value={area} />
            ))}
          </Picker>
        </View>

        {/* SCROLLVIEW FUNCIONAL */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {filteredContacts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.contactItem}
              onPress={() =>
                navigation.navigate("DetallesContacto", { contact: item })
              }
            >
              <Text style={styles.contactName}>
                {item.name} {item.lastName}
              </Text>
              <Text>{item.position}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FOOTER FIJO */}
        <View style={styles.footer}>
          {isDesktop && (
            <TouchableOpacity style={styles.iconButtonc} onPress={() => navigation.navigate("AgregarContacto")}>
              <Ionicons name="add-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Agregar Contacto</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxHeight: "100vh",
  },

  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
  },

  /** SCROLLVIEW QUE FUNCIONA **/
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    overflowY: "auto",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150, // Espacio para que el último contacto no quede detrás del footer
  },

  footer: {
    flexDirection: "row",
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
    zIndex: 1000,
    justifyContent: "flex-end",
  },

  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",

  },
  iconButtonc: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Color verde de WhatsApp, cámbialo si deseas para el botón de copiar
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,

  },
  
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },

});
