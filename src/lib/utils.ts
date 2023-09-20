import type { ICSVRecord } from '$lib/types';

export function parseCSV(rawCSV: string): ICSVRecord[] {
  return rawCSV.split('\n').map((line, index) => {
    const rawValues = line.split(',').map(parseFloat);
    return {
      index,
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

export function debounce(func: Function, delay: number): EventListenerOrEventListenerObject {
  let timer: number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export function getCSVRecordByNumber(num: number, arr: ICSVRecord[]): ICSVRecord {
  let mid;
  let lo = 0;
  let hi = arr.length - 1;
  while (hi - lo > 1) {
    mid = Math.floor((lo + hi) / 2);
    if (arr[mid].time < num) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  if (num - arr[lo].time <= arr[hi].time - num) {
    return arr[lo];
  }
  return arr[hi];
}

export function formatTime(timeInMs: number): string {
  const rounded: string = timeInMs.toFixed(1);
  const roundedFloat = parseFloat(rounded);
  const minutes: number = Math.floor(roundedFloat / 60);
  const seconds: string = String(Math.floor(roundedFloat - minutes * 60));
  return `${minutes}:${seconds.padStart(2, '0')}.${rounded[rounded.length - 1]}`;
}

export function downloadBlob(blob: Blob, name?: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${name || new Date().toISOString()}.webm`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
