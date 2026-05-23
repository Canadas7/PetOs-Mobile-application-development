import BottomNavigation from "../components/BottomNavigation";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import colors from "../styles/colors";
import { savePet } from "../storage/petStorage";

export default function PetRegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [imageUri, setImageUri] = useState("");

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSavePet() {
    if (!name || !species || !breed || !age) {
      return;
    }

    const formattedAge = Number(age) === 1 ? "1 ano" : `${age} anos`;

    const newPet = {
      id: String(Date.now()),
      name,
      species,
      breed,
      age: formattedAge,
      image: imageUri,
    };

    await savePet(newPet);

    navigation.navigate("PetsList");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Pet</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do pet"
        placeholderTextColor={colors.gray}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Espécie"
        placeholderTextColor={colors.gray}
        value={species}
        onChangeText={setSpecies}
      />

      <TextInput
        style={styles.input}
        placeholder="Raça"
        placeholderTextColor={colors.gray}
        value={breed}
        onChangeText={setBreed}
      />

      <TextInput
        style={styles.input}
        placeholder="Idade"
        placeholderTextColor={colors.gray}
        value={age}
        onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>Escolher foto do pet</Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSavePet}>
        <Text style={styles.buttonText}>Salvar Pet</Text>
      </TouchableOpacity>

      <BottomNavigation navigation={navigation} current="PetRegister" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 28,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  imageButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },
  previewImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginBottom: 18,
  },
  button: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 16,
  },
});