import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, getDoc, getDocs, query, where, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";

// 🔹 Obtener contactos filtrados por área
export const subscribeToContactsByArea = (area, callback) => {
  const q = query(collection(db, "contacts"), where("area", "==", area));
  return onSnapshot(q, (snapshot) => {
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(contacts);
  });
};
// 🔹 Obtener contactos sin filtro
export const subscribeToContacts = (callback) => {
  return onSnapshot(collection(db, "contacts"), (snapshot) => {
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(contacts);
  });
};

export const getContactById = async (contactId) => {
  try {
    const contactRef = doc(db, "contacts", contactId);
    const docSnap = await getDoc(contactRef);

    if (docSnap.exists()) {
      return { id: contactId, ...docSnap.data() };
    } else {
      console.error("El contacto no existe en Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo el contacto:", error);
    return null;
  }
};

// 🔹 Obtener áreas almacenadas en Firebase
export const getAreas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "areas"));
    /*if (querySnapshot.empty) {
      return ['Económica', 'Política', 'Seguridad', 'Universidad', 'Laboral', 'Televisión Universitaria'];
    }*/
    return querySnapshot.docs.map(doc => doc.data().name);
  } catch (error) {
    console.error("Error obteniendo áreas:", error);
    return [];
  }
};

// 🔹 Agregar una nueva área en Firestore
export const addNewArea = async (newArea) => {
  try {
    await setDoc(doc(db, "areas", newArea), { name: newArea });
  } catch (error) {
    console.error("Error agregando nueva área:", error);
  } 
};

// 🔹 Guardar un nuevo contacto en Firestore
export const saveContact = async (contact) => {
  try {
    await addDoc(collection(db, "contacts"), contact);
  } catch (error) {
    console.error("Error guardando contacto en Firestore:", error);
  }
};

export const updateContact = async (contactId, updatedData) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await updateDoc(contactRef, updatedData);
    console.log("Contacto actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el contacto: ", error);
    throw error; // Lanza el error para manejarlo en otro lugar si es necesario
  }
};

// 🔹 Eliminar un contacto
export const deleteContact = async (contactId) => {
  try {
    if (!contactId) throw new Error("ID de contacto inválido");

    await deleteDoc(doc(db, "contacts", contactId));
    console.log("Contacto eliminado con éxito");
  } catch (error) {
    console.error("Error eliminando contacto en Firestore:", error);
    throw error;
  }
};


// 🔹 Cargar áreas predefinidas si no existen en Firestore
export const initializeAreas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "areas"));

    if (querySnapshot.empty) {
      console.log("No hay áreas en la base de datos. Cargando áreas predefinidas...");
      const defaultAreas = ["Económica", "Política", "Seguridad", "Universidad", "Laboral", "Televisión Universitaria"];

      defaultAreas.forEach(async (area) => {
        await setDoc(doc(db, "areas", area), { name: area });
      });

      console.log("Áreas predefinidas agregadas.");
    }
  } catch (error) {
    console.error("Error inicializando áreas:", error);
  }
};

