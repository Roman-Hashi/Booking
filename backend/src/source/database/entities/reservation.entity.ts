import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { SeatEntity } from "./seat.entity";

interface CreateReservationOptions {
  fromTime: number;
  toTime: number;

  user: UserEntity;
  seat: SeatEntity;
}

@Entity("reservations")
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer" })
  fromTime!: number;

  @Column({ type: "integer" })
  toTime!: number;

  @ManyToOne(() => UserEntity, (user) => user.reservations)
  user!: UserEntity;

  @ManyToOne(() => SeatEntity, (seat) => seat.reservations)
  seat!: SeatEntity;

  constructor(options?: CreateReservationOptions) {
    super();

    if (options) {
      this.fromTime = options.fromTime;
      this.toTime = options.toTime;

      this.user = options.user;
      this.seat = options.seat;
    }
  }
}
