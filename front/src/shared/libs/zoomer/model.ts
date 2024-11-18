import {
  createEffect,
  createEvent,
  createStore,
  EventCallable,
  sample,
} from "effector";

import { spread } from "patronum";

interface Position {
  x: number;
  y: number;
}

interface ZoomerOptions {
  defaultZoom?: number;
  defaultPosition?: Position;
}

export interface ZoomerModel {
  "@@unitShape": () => {
    setup: EventCallable<{ image: string; ref: HTMLDivElement }>;
  };
}

export function createZoomerModel(options: ZoomerOptions = {}): ZoomerModel {
  const { defaultZoom = 0.8, defaultPosition = { x: 0, y: 0 } } = options;

  const $imageSrc = createStore<string | null>(null);
  const $container = createStore<HTMLDivElement | null>(null);

  const setup = createEvent<{ image: string; ref: HTMLDivElement }>();

  const setupFx = createEffect(
    (options: { image: string; ref: HTMLDivElement }) => {
      const settings = {
        zoom: defaultZoom,
        position: defaultPosition,
      };

      const { ref, image: src } = options;

      const img = ref.children[0] as HTMLDivElement;

      img.style.backgroundImage = `url('${src}')`;

      img.style.width = `${ref.clientWidth}px`;
      img.style.height = `${ref.clientHeight}px`;

      settings.position.x = 0;
      settings.position.y = 0;

      ref.appendChild(img);

      function apply() {
        const newX = settings.position.x.toFixed(2);
        const newY = settings.position.y.toFixed(2);
        const newZoom = settings.zoom.toFixed(2);

        const img = ref.children[0] as HTMLDivElement;

        img.style.transform = `translate(${newX}px, ${newY}px) scale(${newZoom})`;
        img.style.position = "relative";
      }

      apply();

      ref.addEventListener("wheel", (e) => {
        e.preventDefault();

        const delta = e.deltaY || e.deltaX;
        const zoomStep =
          Math.abs(delta) < 50
            ? 0.025 // touchpad pitch
            : 0.25; // mouse wheel

        const zoomDelta = delta < 0 ? zoomStep : -zoomStep;
        let nextZoom = settings.zoom + zoomDelta;

        if (nextZoom < 0.25) {
          nextZoom = 0.25;
        }

        if (nextZoom > 3) {
          nextZoom = 3;
        }

        settings.zoom = nextZoom;

        apply();
      });

      let anchorX: number;
      let anchorY: number;

      function move(e: MouseEvent) {
        settings.position.x += e.pageX - anchorX;
        settings.position.y += e.pageY - anchorY;

        anchorX = e.pageX;
        anchorY = e.pageY;

        apply();
      }

      ref.addEventListener("dragstart", (e) => e.preventDefault());

      ref.addEventListener("mousedown", (e) => {
        e.preventDefault();

        anchorX = e.pageX;
        anchorY = e.pageY;

        ref.addEventListener("mousemove", move);
      });

      ref.addEventListener("mouseup", () => {
        ref.removeEventListener("mousemove", move);
      });
    }
  );

  sample({
    clock: setup,
    target: [
      setupFx,
      spread({
        targets: {
          ref: $container,
          image: $imageSrc,
        },
      }),
    ],
  });

  return {
    "@@unitShape": () => ({
      setup,
    }),
  };
}
