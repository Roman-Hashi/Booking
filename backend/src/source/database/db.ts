import { DataSource } from "typeorm";
import {
  ReservationEntity,
  SchemaEntity,
  SeatEntity,
  UserEntity,
} from "./entities";

export async function setupDatabase() {
  const source = new DataSource({
    type: "sqlite",
    database: "booking.db",
    synchronize: import.meta.env.DEV,
    entities: [UserEntity, SchemaEntity, SeatEntity, ReservationEntity],
  });

  await source.initialize();
}
