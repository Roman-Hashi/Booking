import { createEffect, createEvent, sample } from "effector";
import { notifications as mantineNotifications } from "@mantine/notifications";
import { rem } from "@mantine/core";

import { IconX, IconCheck, IconInfoCircle } from "@tabler/icons-react";

type NotificationPayload = { title: string; message: string };

function factory(type: "success" | "error" | "loading" | "info") {
  let specifiedPayload;

  switch (type) {
    case "success": {
      specifiedPayload = {
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
      };

      break;
    }
    case "error": {
      specifiedPayload = {
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
      };

      break;
    }
    case "loading": {
      specifiedPayload = {
        autoClose: false,
        loading: true,
        withCloseButton: false,
      };

      break;
    }
    case "info": {
      specifiedPayload = {
        icon: <IconInfoCircle style={{ width: rem(18), height: rem(18) }} />,
      };

      break;
    }
  }

  return (payload: NotificationPayload) => {
    mantineNotifications.clean();
    mantineNotifications.show({
      position: "bottom-center",
      autoClose: 5000,

      ...payload,
      ...specifiedPayload,
    });
  };
}

const successFx = createEffect(factory("success"));
const errorFx = createEffect(factory("error"));
const infoFx = createEffect(factory("info"));
const loadingFx = createEffect(factory("loading"));

const success = createEvent<NotificationPayload>();
const error = createEvent<NotificationPayload>();
const info = createEvent<NotificationPayload>();
const loading = createEvent<NotificationPayload>();

sample({
  clock: success,
  target: successFx,
});

sample({
  clock: error,
  target: errorFx,
});

sample({
  clock: info,
  target: infoFx,
});

sample({
  clock: loading,
  target: loadingFx,
});

export const notifications = {
  success,
  error,
  info,
  loading,
};
