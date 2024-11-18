import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SeatEntity } from "./seat.entity";

interface CreateSchemaOptions {
  title: string;
  url: string;
  seats: SeatEntity[];
}

@Entity("schemas")
export class SchemaEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", length: 128 })
  title!: string;

  @Column({ type: "text", length: 2056 })
  url!: string;

  @OneToMany(() => SeatEntity, (seat) => seat.schema)
  seats!: SeatEntity[];

  constructor(options?: CreateSchemaOptions) {
    super();

    if (options) {
      this.title = options.title;
      this.seats = options.seats;
      this.url = options.url;
    }
  }
}
