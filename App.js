import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddContactScreen from './screens/AddContactScreen';
import ContactDetailScreen from './screens/ContactDetailScreen';
import EditContactScreen from './screens/EditContactScreen';
import { Image, View } from 'react-native'; // Importa Image y View


const Stack = createStackNavigator();
const LogoTitle = () => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Image
        style={{ width: 150, height: 50, resizeMode: 'contain' }} // Ajusta el tamaño según tus necesidades
        source={require('./assets/logo tvu.png')} // Reemplaza con la ruta de tu imagen
      />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <LogoTitle />,
          headerTitleAlign: 'center', 
          //headerStyle: {
            //backgroundColor: '#f8f8f8', // 🎨 Color de fondo del encabezado (opcional)
          //},
        }}
      >
        <Stack.Screen name="Agenda de Contactos TVU" component={HomeScreen} options={{ headerLeft: () => null }} />
        <Stack.Screen name="AgregarContacto" component={AddContactScreen} />
        <Stack.Screen name="DetallesContacto" component={ContactDetailScreen} />
        <Stack.Screen name="EditarContacto" component={EditContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

