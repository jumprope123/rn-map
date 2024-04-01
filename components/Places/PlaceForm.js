import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/color";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";
import { Place } from "../../models/place";

function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [pickedLocation, setPickedLocation] = useState();
  const [selectedImage, setSelectedImage] = useState();

  function changeTitle(enteredText) {
    setEnteredTitle(enteredText);
  }

  function savePlaceHandler() {
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);

    onCreatePlace(placeData);
  }

  function onTakeImage(imageUri) {
    setSelectedImage(imageUri);
  }
  const onPickLocation = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitle}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={onTakeImage} />
      <LocationPicker onPickLocation={onPickLocation} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});