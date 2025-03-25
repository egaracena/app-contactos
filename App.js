import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddContactScreen from './screens/AddContactScreen';
import ContactDetailScreen from './screens/ContactDetailScreen';
import EditContactScreen from './screens/EditContactScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: {
            fontSize: 30, // 🔥 Aumenta el tamaño del título
            fontWeight: 'bold', // 🔥 Hace que el título sea más grueso
            color: '#333', // 🎨 Color del título (opcional)
          },
          //headerStyle: {
            //backgroundColor: '#f8f8f8', // 🎨 Color de fondo del encabezado (opcional)
          //},
        }}
      >
        <Stack.Screen name="Contactos" component={HomeScreen} options={{ headerLeft: () => null }} />
        <Stack.Screen name="AgregarContacto" component={AddContactScreen} />
        <Stack.Screen name="DetallesContacto" component={ContactDetailScreen} />
        <Stack.Screen name="EditarContacto" component={EditContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

