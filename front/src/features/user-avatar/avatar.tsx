import { Avatar } from "@mantine/core";
import { User } from "@shared/types";
import { FC } from "react";
import uniqolor from "uniqolor";

export const UserAvatar: FC<{ user: Omit<User, "username"> }> = ({ user }) => {
  const { color, isLight } = uniqolor(user.fullName);

  return (
    <Avatar bg={color} c={isLight ? "dark" : "white"} name={user.fullName} />
  );
};
