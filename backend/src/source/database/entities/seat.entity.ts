import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Position } from "./types";
import { ReservationEntity } from "./reservation.entity";
import { SchemaEntity } from "./schema.entity";

interface CreateSeatOptions {
  position: Position;
  schema: SchemaEntity;
}

@Entity("seats")
export class SeatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "simple-json" })
  position!: Position;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.seat)
  reservations!: ReservationEntity[];

  @ManyToOne(() => SchemaEntity, (schema) => schema.seats)
  schema!: SchemaEntity;

  constructor(options?: CreateSeatOptions) {
    super();

    if (options) {
      this.position = options.position;
      this.schema = options.schema;
    }
  }
}
