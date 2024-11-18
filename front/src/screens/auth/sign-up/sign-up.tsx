import { useForm } from "@effector-reform/react";
import { signUpForm } from "./model";
import { Button, Flex, PasswordInput, TextInput, Title } from "@mantine/core";
import { Link } from "atomic-router-react";
import { routes } from "@shared/routing";

export const SignUpScreen = () => {
  const { fields, onSubmit } = useForm(signUpForm);

  return (
    <Flex
      align="center"
      justify="center"
      w="100%"
      h="100vh"
      direction="column"
      gap={32}
    >
      <Title>Sign up</Title>

      <form onSubmit={onSubmit}>
        <Flex w={320} direction="column" gap={16}>
          <TextInput
            size="md"
            label="Username"
            description="Length from 4 to 32 characters, must be unique"
            placeholder="username"
            value={fields.username.value}
            error={fields.username.error}
            onChange={(e) => fields.username.onChange(e.currentTarget.value)}
          />

          <TextInput
            size="md"
            label="Full name"
            placeholder="full name"
            description="Length from 4 to 64 characters"
            value={fields.fullName.value}
            error={fields.fullName.error}
            onChange={(e) => fields.fullName.onChange(e.currentTarget.value)}
          />

          <PasswordInput
            size="md"
            label="Password"
            placeholder="password"
            description="Length from 8 to 64 characters, should be strong"
            value={fields.password.value}
            error={fields.password.error}
            onChange={(e) => fields.password.onChange(e.currentTarget.value)}
          />

          <Button size="md" type="submit">
            Sign up
          </Button>
        </Flex>
      </form>

      <Link to={routes.signIn}>Already have an account?</Link>
    </Flex>
  );
};
