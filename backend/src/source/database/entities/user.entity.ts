import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReservationEntity } from "./reservation.entity";
import { createHash } from "crypto";

interface CreateUserOptions {
  username: string;
  fullName: string;
  password: string;
}

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", length: 64 })
  fullName!: string;

  @Column({ type: "text", length: 32 })
  username!: string;

  @Column({ type: "text", length: 64 })
  password!: string;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservations!: ReservationEntity[];

  constructor(options?: CreateUserOptions) {
    super();

    if (options) {
      this.fullName = options.fullName;
      this.username = options.username;
      this.password = createHash("sha256")
        .update(options.password)
        .digest("hex");
    }
  }
}
