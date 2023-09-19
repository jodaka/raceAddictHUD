import type { ICSVRecord } from '$lib/types';
import { browser } from '$app/environment';

export function getStoredValue<R>(key: string, defaultValue: any = null): R {
  if (!browser) {
    return defaultValue;
  }

  if (window.sessionStorage) {
    const storedValue = window.sessionStorage.getItem(key);
    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue);
        return parsed;
      } catch (e) {
        console.error(e);
        return defaultValue;
      }
    }
  }

  return defaultValue;
}

export function setStoredValue(key: string, value: any = null): void {
  if (!browser) {
    return;
  }

  if (window.sessionStorage) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
}

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
