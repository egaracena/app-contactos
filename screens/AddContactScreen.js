import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveContact, getAreas, addNewArea } from '../storage/FireBaseService';

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phones, setPhones] = useState(['']); // Lista de teléfonos
  const [emails, setEmails] = useState(['']); // Lista de correos
  const [position, setPosition] = useState('');
  const [area, setArea] = useState('');
  const [newArea, setNewArea] = useState('');
  const [areas, setAreas] = useState([]);

  const [showNewAreaInput, setShowNewAreaInput] = useState(false); // Controla la visibilidad del campo para nueva área
  const [showValidationModal, setShowValidationModal] = useState(false); // Controla la visibilidad del modal de validación
  const [validationMessage, setValidationMessage] = useState(''); // Mensaje a mostrar en el modal

  useEffect(() => {
    const loadAreas = async () => {
      const fetchedAreas = await getAreas();
      setAreas(fetchedAreas);
    };
    loadAreas();
  }, []);

  // Agregar un nuevo teléfono
  const addPhoneField = () => setPhones([...phones, '']);

  // Agregar un nuevo correo
  const addEmailField = () => setEmails([...emails, '']);

  // Guardar el contacto en Firestore
  const handleSaveContact = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    const newContact = {
      name,
      lastName,
      phones: phones.filter(p => p.trim() !== ''),
      emails: emails.filter(e => e.trim() !== ''),
      position,
      area: newArea || area
    };

    await saveContact(newContact);
    navigation.goBack();
  };

  const handleAddNewArea = async () => {
    if (!newArea.trim()) {
      Alert.alert('Error', 'Debe ingresar un nombre para la nueva área.');
      return;
    }

    if (areas.includes(newArea)) {
      Alert.alert('Error', 'Esta área ya existe.');
      return;
    }

    await addNewArea(newArea);
    setAreas([...areas, newArea]); // Actualiza la lista en el estado
    setNewArea('');
    setShowNewAreaInput(false); // Oculta el input y el botón de guardar
  };

  const handleSaveNewArea = async () => {
    if (!newArea.trim()) {
      setValidationMessage('Debe ingresar un nombre para la nueva área.');
      setShowValidationModal(true);
      return;
    }

    if (areas.includes(newArea)) {
      setValidationMessage('Esta área ya existe.');
      setShowValidationModal(true);
      return;
    }

    await addNewArea(newArea);
    setAreas([...areas, newArea]); // Actualiza la lista en el estado
    setNewArea('');
    setShowNewAreaInput(false); // Oculta el campo y botón después de guardar
  };


  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Datos Personales:</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre *"
          value={name}
          onChangeText={(text) => setName(text.toUpperCase())}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={lastName}
          onChangeText={(text) => setLastName(text.toUpperCase())}
        />
        <Text style={styles.label}>Teléfonos:</Text>
        {phones.map((phone, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Teléfono ${index + 1}`}
            value={phone}
            onChangeText={(text) => {
              const newPhones = [...phones];
              newPhones[index] = text;
              setPhones(newPhones);
            }}
          />
        ))}
        <Button style={styles.button} title="Agregar Otro Teléfono" onPress={addPhoneField} />

        <Text style={styles.label}>Correos:</Text>
        {emails.map((email, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Correo ${index + 1}`}
            value={email}
            onChangeText={(text) => {
              const newEmails = [...emails];
              newEmails[index] = text;
              setEmails(newEmails);
            }}
          />
        ))}
        <Button style={styles.button} title="Agregar Otro Correo" onPress={addEmailField} />
        <Text style={styles.label}>Cargo:</Text>

        <TextInput
          style={styles.input}
          placeholder="Cargo"
          value={position}
          onChangeText={(text) => setPosition(text.toUpperCase())}
        />
        <Text style={styles.label}>Área:</Text>
        <View style={{ marginVertical: 10 }}>        
          <Picker selectedValue={area} onValueChange={(value) => setArea(value)}>
          <Picker.Item label="Selecciona un área" value="" />
          {areas.map((a, index) => <Picker.Item key={index} label={a} value={a} />)}
        </Picker>
        </View>

        {!showNewAreaInput && (
          <Button style={styles.button} title="Agregar Nueva Área" onPress={() => setShowNewAreaInput(true)} />
        )}

        {showNewAreaInput && (
          <View style={{ marginVertical: 10 }}>
            <TextInput
              style={styles.input}
              placeholder="Nueva área"
              value={newArea}
              onChangeText={(text) => setNewArea(text.toUpperCase())}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Button style={styles.button} title="Guardar" onPress={handleSaveNewArea} />
              <Button style={styles.button} title="Cancelar" onPress={() => { setShowNewAreaInput(false); setNewArea(''); }} />
            </View>
          </View>
        )}
        {showValidationModal && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{validationMessage}</Text>
              <Button style={styles.button} title="OK" onPress={() => setShowValidationModal(false)} />
            </View>
          </View>
        )}
        <View style={{ marginVertical: 10 }}>
          <Button title="Guardar Contacto" onPress={handleSaveContact} />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    maxHeight: "100vh",

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    marginVertical: 10,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 10,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    overflowY: "auto",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50, // Espacio para que el último contacto no quede detrás del footer
  },
});


export default AddContactScreen;
