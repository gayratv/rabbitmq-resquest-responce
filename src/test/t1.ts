export function delay(ms = 10_000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), ms);
  });
}

async function f1() {
  console.log('f1 s');
  await delay(1_000);
  console.log('f1 e');
  handler();
}

async function f2() {
  console.log('f2 s');
  await delay(5000);
  console.log('f2 e');
}

async function handler() {
  console.log('H s');
  await delay(500);
  console.log('H e');
}

async function main() {
  console.log('>f1');
  await f1();
  console.log('>f2');
  await f2();
  console.log('finish');
}

await main();
