import { FC, useEffect, useMemo, useState } from "react";
import { getReservationsFx, Reservation, reserveFx, Seat } from "./api";
import { Avatar, Button, Flex, Modal, Text, Title } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useUnit } from "effector-react";
import { UserAvatar } from "@features/user-avatar";
import { getFreeTimes } from "./lib";

function stringifyDate(date: Date) {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export const SeatInfo: FC<{ seat: Seat }> = ({ seat }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const [getReservations, reserve] = useUnit([getReservationsFx, reserveFx]);

  useEffect(() => {
    if (from && to) {
      setIsLoading(true);
      setIsError(false);
      getReservations({ seatId: seat.id, from, to })
        .then((result) => {
          setReservations(result);
          setIsLoading(false);
        })
        .catch(() => {
          setIsError(true);
        });
    }
  }, [from, getReservations, seat.id, to]);

  const reservationsInfo = useMemo(() => {
    if (reservations.length === 0) {
      return null;
    }

    if (reservations.length === 1) {
      const reservation = reservations[0];

      return (
        <Flex direction="column" gap={8} mb={12}>
          <Flex justify="flex-start" align="center" gap={8}>
            <Text>Reserved by</Text>
            <Flex gap={8} justify="center" align="center">
              <UserAvatar user={reservation.user} />
              <Text>{reservation.user.fullName}</Text>
            </Flex>
          </Flex>

          <Text>
            <b>from</b> {stringifyDate(new Date(reservation.from * 1000))}
          </Text>
          <Text>
            <b>to</b> {stringifyDate(new Date(reservation.to * 1000))}
          </Text>
        </Flex>
      );
    }

    if (reservations.length > 1) {
      return (
        <Flex direction="column" gap={8} mb={12}>
          <Avatar.Group>
            {reservations.map((reservation) => (
              <UserAvatar user={reservation.user} />
            ))}
          </Avatar.Group>

          <Text>Reserved by {reservations[0].user.fullName} & More</Text>
          <Text>Nearest free time: </Text>
          <Text>
            <b>from</b>{" "}
            {stringifyDate(new Date(getFreeTimes(reservations)[0].from * 1000))}
          </Text>
          <Text>
            <b>to</b>{" "}
            {stringifyDate(new Date(getFreeTimes(reservations)[0].to * 1000))}
          </Text>
        </Flex>
      );
    }
  }, [reservations]);

  return (
    <>
      <Flex
        onClick={() => setIsOpened(true)}
        key={seat.id}
        id={seat.id.toString()}
        bg="blue"
        style={{
          position: "absolute",
          opacity: 0.8,
          zIndex: 1000,
          borderRadius: 20,
          width: seat.position.w,
          height: seat.position.h,
          left: seat.position.x,
          top: seat.position.y,
        }}
      />

      <Modal
        title={<Title order={3}>Seat №{seat.id}</Title>}
        opened={isOpened}
        radius="lg"
        onClose={() => setIsOpened(false)}
      >
        <Flex gap={12} direction="column">
          <DateTimePicker
            value={from}
            onChange={setFrom}
            minDate={new Date()}
            label="Book from"
          />

          <DateTimePicker
            value={to}
            onChange={setTo}
            minDate={from ?? new Date()}
            label="Book to"
          />

          <Flex direction="column" gap={8} mt={12} pb={12}>
            {reservationsInfo}

            <Button
              onClick={() => {
                setIsLoading(true);
                reserve({ seatId: seat.id, from: from!, to: to! })
                  .then(() => {
                    setIsOpened(false);
                    setFrom(null);
                    setTo(null);
                    setIsError(false);
                    setIsLoading(false);
                  })
                  .catch(() => setIsLoading(false));
              }}
              disabled={!from || !to || reservations.length > 0 || isError}
              loading={isLoading}
            >
              Reserve
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
