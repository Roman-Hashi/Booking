import { Flex, Loader } from "@mantine/core";

export const LoadingScreen = () => {
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Loader size="md" />
    </Flex>
  );
};
