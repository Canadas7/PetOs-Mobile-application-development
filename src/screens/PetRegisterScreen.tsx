import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import colors from "../styles/colors";
import { savePet } from "../storage/petStorage";

export default function PetRegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  async function handleSavePet() {
    if (!name || !species || !breed || !age) {
      return;
    }

    const formattedAge =
      Number(age) === 1 ? "1 ano" : `${age} anos`;

    const newPet = {
      id: String(Date.now()),
      name,
      species,
      breed,
      age: formattedAge,
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
        onChangeText={(text) =>
          setAge(text.replace(/[^0-9]/g, ""))
        }
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSavePet}>
        <Text style={styles.buttonText}>Salvar Pet</Text>
      </TouchableOpacity>
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