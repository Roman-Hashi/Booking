import { createRoot } from "react-dom/client";
import { allSettled, fork } from "effector";

import { Provider } from "effector-react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { RoutesView } from "./screens";
import { LoadingScreen } from "@screens/loading";
import { appStarted } from "@shared/effector";
import { RouterProvider } from "atomic-router-react";
import { router } from "@shared/routing";
import { createBrowserHistory } from "history";

const root = createRoot(document.getElementById("root")!);

async function bootstrap() {
  const scope = fork();

  await allSettled(appStarted, { scope });

  await allSettled(router.setHistory, {
    scope,
    params: createBrowserHistory(),
  });

  root.render(
    <Provider value={scope}>
      <MantineProvider defaultColorScheme="dark">
        <Notifications limit={3} />

        <RouterProvider router={router}>
          <RoutesView />
        </RouterProvider>
      </MantineProvider>
    </Provider>
  );
}

root.render(
  <MantineProvider defaultColorScheme="dark">
    <LoadingScreen />
  </MantineProvider>
);

void bootstrap();
