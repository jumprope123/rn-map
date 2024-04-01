import { Alert, Image, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/color";
import {
  PermissionStatus,
  getCurrentPositionAsync,
  useForegroundPermissions,
} from "expo-location";
import { useEffect, useState } from "react";
import { getAddress, getMapPreview } from "../../.expo/util/location";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

function LocationPicker({ onPickLocation }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [locationPerMissionInformation, requestPermission] =
    useForegroundPermissions();

  const [pickedLocation, setPickedLocation] = useState("");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };

      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(pickedLocation);
        onPickLocation({ ...pickedLocation, address: address });
      }
    }
    handleLocation();
  }, [onPickLocation, pickedLocation]);

  async function verifyPermissions() {
    if (
      locationPerMissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPerMissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient permissions!",
        "You need to give permission to access your location. Please go to settings and give permission"
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }
  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text>No location picked yet</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.mapPreviewImage}
        source={{ uri: getMapPreview(pickedLocation) }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>

      <View style={styles.actions}>
        <View style={styles.buttonWrapper}>
          <OutlinedButton icon={"location"} onPress={getLocationHandler}>
            Locate User
          </OutlinedButton>
        </View>
        <View style={styles.buttonWrapper}>
          <OutlinedButton icon={"map"} onPress={pickOnMapHandler}>
            Pick on Map
          </OutlinedButton>
        </View>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary200,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  mapPreviewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
