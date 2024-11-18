import { Flex, Loader } from "@mantine/core";
import { createZoomerModel, Zoomer } from "@shared/libs/zoomer";
import { useGate, useUnit } from "effector-react";
import { $isLoading, $schema, HomeGate } from "./model.ts";
import { SeatInfo } from "./seat-info.tsx";

const model = createZoomerModel();

export const HomeScreen = () => {
  useGate(HomeGate);

  const { isLoading, schema } = useUnit({
    isLoading: $isLoading,
    schema: $schema,
  });

  if (isLoading || !schema) {
    return (
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Loader size="md" />
      </Flex>
    );
  }

  return (
    <Flex w="100vw" h="100vh">
      <Zoomer model={model} image={schema.imageUrl}>
        {schema.seats.map((seat) => (
          <SeatInfo seat={seat} key={seat.id} />
        ))}
      </Zoomer>
    </Flex>
  );
};
