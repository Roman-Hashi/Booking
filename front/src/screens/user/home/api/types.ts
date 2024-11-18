export interface Reservation {
  id: number;
  from: number;
  to: number;
  user: {
    id: number;
    fullName: string;
  };
}

export interface Seat {
  id: number;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface Schema {
  imageUrl: string;
  title: string;
  seats: Seat[];
}
