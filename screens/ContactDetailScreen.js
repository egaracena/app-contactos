import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getContactById, deleteContact } from '../storage/FireBaseService';
import * as Device from 'expo-device';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const ContactDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { contact } = route.params;
  const [currentContact, setCurrentContact] = useState(contact); // 🔹 Estado para el contacto actualizado
  const isDesktop = Device.osName === "Windows" || Device.osName === "Mac OS"; // Detecta si es PC

  // 🔹 Función para recargar los datos del contacto al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      const fetchContact = async () => {
        try {
          const updatedContact = await getContactById(contact.id); // ✅ Obtiene el contacto actualizado de Firestore

          if (updatedContact) {
            setCurrentContact(updatedContact);
          } //else {
          // ❗ Si el contacto no existe, regresa a la pantalla principal
          //Alert.alert("Contacto eliminado", "Este contacto ya no está disponible.", [
          //{ text: "OK", onPress: () => navigation.navigate("Contactos") }
          //]);
          //}
        } catch (error) {
          console.error("Error al obtener contacto actualizado:", error);
        }
      };
      fetchContact();
    }, [contact.id])
  );

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copiado", "Texto copiado al portapapeles.");
  };

  const sendWhatsAppMessage = (phone) => {
    const message = "Hola, me gustaría contactarte.";
    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phone}`;

    Linking.openURL(url).catch(err => {
      Alert.alert("Error", "No se pudo abrir WhatsApp. Asegúrate de que está instalado.");
    });
  };

  const handleDeleteContact = () => {
    console.log("Botón eliminar presionado"); // ✅ Verifica que se ejecuta

    if (isDesktop) {
      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
      if (confirmDelete) {
        handleConfirmDelete(); // ✅ Si el usuario confirma, se elimina el contacto
      }
    } else {
      Alert.alert(
        "Eliminar Contacto",
        "¿Estás seguro de que quieres eliminar este contacto?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => handleConfirmDelete(),
          },
        ]
      );
    }
  };

  // ✅ Función separada para la eliminación
  const handleConfirmDelete = async () => {
    try {
      if (!currentContact.id) {
        Alert.alert("Error", "No se puede eliminar este contacto.");
        return;
      }

      console.log("Eliminando contacto con ID:", currentContact.id);

      await deleteContact(currentContact.id);

      console.log("Contacto eliminado con éxito.");

      if (isDesktop) {
        window.alert("El contacto ha sido eliminado.");
      } else {
        Alert.alert("Eliminado", "El contacto ha sido eliminado.");
      }

      // ✅ Regresar a la pantalla anterior y actualizar la lista
      navigation.navigate("Contactos");
    } catch (error) {
      console.error("Error eliminando contacto:", error);

      if (isDesktop) {
        window.alert("Error: No se pudo eliminar el contacto.");
      } else {
        Alert.alert("Error", "No se pudo eliminar el contacto.");
      }
    }
  };



  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Detalles del Contacto</Text>

        {/* Nombre y Apellidos */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.info}>{currentContact.name} {currentContact.lastName || ''}</Text>
        </View>

        {/* Números de Teléfono */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Teléfonos:</Text>
          {currentContact.phones && currentContact.phones.length > 0 ? (
            currentContact.phones.map((phone, index) => (
              <View key={index} style={styles.phoneContainer}>
                <Text style={styles.info}>{phone}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.iconButtonc} onPress={() => copyToClipboard(phone)}>
                    <AntDesign name="copy1" size={20} color="white" />
                    {isDesktop &&<Text style={styles.buttonText}>Copiar</Text>}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconButtonwp} onPress={() => sendWhatsAppMessage(phone)}>
                    <FontAwesome name="whatsapp" size={20} color="white" />
                    {isDesktop &&<Text style={styles.buttonText}>WhatsApp</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.info}>No disponible</Text>
          )}
        </View>

        {/* Correos */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Correos:</Text>
          {currentContact.emails && currentContact.emails.length > 0 ? (
            currentContact.emails.map((email, index) => (
              <View key={index} style={styles.phoneContainer}>
                <Text style={styles.info}>{email}</Text>
                <TouchableOpacity style={styles.iconButtonc} onPress={() => copyToClipboard(email)}>
                  <AntDesign name="copy1" size={20} color="white" />
                  {isDesktop &&<Text style={styles.buttonText}>Copiar</Text>}
                </TouchableOpacity>              </View>
            ))
          ) : (
            <Text style={styles.info}>No disponible</Text>
          )}
        </View>

        {/* Cargo */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Cargo:</Text>
          <Text style={styles.info}>{currentContact.position || "No disponible"}</Text>
        </View>

        {/* Área */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Área:</Text>
          <Text style={styles.info}>{currentContact.area || "No especificada"}</Text>
        </View>

        {/* Botón para editar el contacto */}
        <View style={{ marginVertical: 10,marginBottom:10, }}>
        {isDesktop && <View style={{ marginVertical: 10,marginBottom:10, }}>  <Button style={styles.button} title="Editar Contacto" onPress={() => navigation.navigate("EditarContacto", { contact: currentContact })} /></View>}
        {isDesktop && <View style={{ marginVertical: 10,marginBottom:10, }}> <Button style={styles.button} title="Eliminar Contacto" onPress={handleDeleteContact} color="red" /> </View>}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', maxHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoContainer: { marginBottom: 15 },
  label: { fontSize: 18, fontWeight: 'bold' },
  info: { fontSize: 16, marginBottom: 5 },
  phoneContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: '40%', marginVertical: 10, },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    overflowY: "auto",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50, // Espacio para que el último contacto no quede detrás del footer
  }, iconButtonwp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366', // Color verde de WhatsApp, cámbialo si deseas para el botón de copiar
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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
  button: {
    marginVertical: 10,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 10,
  },
});


export default ContactDetailScreen;
