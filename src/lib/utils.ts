import type { ICSVRecord } from '$lib/types';

export function parseCSV(rawCSV: string): ICSVRecord[] {
  return rawCSV.split('\n').map((line) => {
    const rawValues = line.split(',').map(parseFloat);
    return {
      time: rawValues[0],
      utcTime: rawValues[1],
      lap: rawValues[2],
      latitude: rawValues[7],
      longitude: rawValues[8],
      altitude: rawValues[9],
      speed: rawValues[11],
      heading: rawValues[12],
      accuracy: rawValues[13],
      accelerationX: rawValues[14],
      accelerationY: rawValues[15],
      accelerationZ: rawValues[16]
    };
  });
}

export function debounce(func: Function, delay: number) {
  let timer: number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
