import { Button, Flex, PasswordInput, TextInput, Title } from "@mantine/core";
import { useForm } from "@effector-reform/react";
import { signInForm } from "./model";
import { Link } from "atomic-router-react";
import { routes } from "@shared/routing";

export const SignInScreen = () => {
  const { fields, onSubmit } = useForm(signInForm);

  return (
    <Flex
      align="center"
      justify="center"
      w="100%"
      h="100vh"
      direction="column"
      gap={32}
    >
      <Title>Sign in</Title>

      <form onSubmit={onSubmit}>
        <Flex w={320} direction="column" gap={16}>
          <TextInput
            withAsterisk
            size="md"
            label="Username"
            placeholder="username"
            value={fields.username.value}
            error={fields.username.error}
            onChange={(e) => fields.username.onChange(e.currentTarget.value)}
          />

          <PasswordInput
            withAsterisk
            size="md"
            label="Password"
            placeholder="password"
            value={fields.password.value}
            error={fields.password.error}
            onChange={(e) => fields.password.onChange(e.currentTarget.value)}
          />

          <Button size="md" type="submit">
            Sign in
          </Button>
        </Flex>
      </form>

      <Link to={routes.signUp}>Don't have an account?</Link>
    </Flex>
  );
};
