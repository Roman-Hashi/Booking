import { UserAvatar } from "@features/user-avatar";
import { Flex, Menu, Text } from "@mantine/core";
import { api } from "@shared/api";
import { routes } from "@shared/routing";
import { $user } from "@shared/user";
import { Link } from "atomic-router-react";
import { useUnit } from "effector-react";
import { FC, ReactNode } from "react";

export const MainLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  const { user, onLogout } = useUnit({ user: $user, onLogout: api.logout });

  return (
    <>
      <header style={{ width: "100%" }}>
        <Flex
          p={24}
          direction="row"
          w="100%"
          h="100%"
          align="center"
          justify="space-between"
        >
          <Link to={routes.home} style={{ textDecoration: "none" }}>
            <Text size="lg">Home</Text>
          </Link>

          <Menu>
            <Menu.Target>
              <Flex
                style={{ cursor: "pointer" }}
                gap={16}
                direction="row"
                align="center"
                justify="center"
              >
                <UserAvatar user={user} />
                <Text size="lg">{user.fullName}</Text>
              </Flex>
            </Menu.Target>

            <Menu.Dropdown w={200}>
              <Menu.Item onClick={onLogout}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </header>

      {children}
    </>
  );
};
