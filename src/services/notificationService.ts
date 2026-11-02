import { Platform } from "react-native";

import * as Notifications from "expo-notifications";

import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFIED_ALERTS_KEY =
  "@petos:notified-alerts";

const CHANNEL_ID =
  "petos-alerts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      CHANNEL_ID,
      {
        name: "Alertas PetOS",

        importance:
          Notifications.AndroidImportance.HIGH,

        sound: "default",

        vibrationPattern: [
          0,
          250,
          250,
          250,
        ],
      }
    );
  }

  const permission =
    await Notifications.getPermissionsAsync();

  let finalStatus =
    permission.status;

  if (finalStatus !== "granted") {
    const request =
      await Notifications.requestPermissionsAsync();

    finalStatus =
      request.status;
  }

  return finalStatus === "granted";
}

type PetAlertNotification = {
  id: number;
  petId: number;
  petName: string;
  message: string;
};

export async function notifyPetAlert(
  alert: PetAlertNotification
) {
  const permissionGranted =
    await configureNotifications();

  if (!permissionGranted) {
    return false;
  }

  const saved =
    await AsyncStorage.getItem(
      NOTIFIED_ALERTS_KEY
    );

  const notifiedIds: number[] =
    saved
      ? JSON.parse(saved)
      : [];

  if (
    notifiedIds.includes(alert.id)
  ) {
    return false;
  }

  await Notifications.scheduleNotificationAsync(
    {
      content: {
        title: `Alerta de ${alert.petName}`,

        body: alert.message,

        sound: "default",

        data: {
          alertId: alert.id,
          petId: alert.petId,
        },
      },

      trigger: null,
    }
  );

  const updatedIds = [
    ...notifiedIds,
    alert.id,
  ].slice(-100);

  await AsyncStorage.setItem(
    NOTIFIED_ALERTS_KEY,
    JSON.stringify(updatedIds)
  );

  return true;
}

export async function clearNotifiedAlerts() {
  await AsyncStorage.removeItem(
    NOTIFIED_ALERTS_KEY
  );
}