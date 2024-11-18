import { Reservation } from "../api";

export function getFreeTimes(reservations: Reservation[]) {
  const sorted = reservations.sort((a, b) => a.from - b.from);
  const freeTimes: { from: number; to: number }[] = [];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].from - sorted[i - 1].to > 0) {
      freeTimes.push({ from: sorted[i - 1].to, to: sorted[i].from });
    }
  }

  return freeTimes;
}
