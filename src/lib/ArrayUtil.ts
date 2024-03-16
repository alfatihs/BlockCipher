export function flattenUint8Array(array: Uint8Array[]): Uint8Array {
  const size = array.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(size);

  let offset = 0;
  for (const arr of array) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}
