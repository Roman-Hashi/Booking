export function fromUnix(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function toUnix(timestamp: Date) {
  return timestamp.getTime() / 1000;
}

export function now() {
  return Date.now() / 1000;
}
