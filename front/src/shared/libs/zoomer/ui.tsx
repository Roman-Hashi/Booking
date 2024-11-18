import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { ZoomerModel } from "./model";
import { useUnit } from "effector-react";
import { Box } from "@mantine/core";

export const Zoomer: FC<
  PropsWithChildren<{ model: ZoomerModel; image: string }>
> = ({ children, model, image }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setup } = useUnit(model);

  useEffect(() => {
    if (ref.current) {
      setup({ ref: ref.current, image });
    }
  }, []);

  return (
    <Box
      ref={ref}
      w="100%"
      h="100%"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Box>{children}</Box>
    </Box>
  );
};
