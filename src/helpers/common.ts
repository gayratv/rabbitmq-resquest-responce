export function delay(ms = 10_000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), ms);
  });
}
