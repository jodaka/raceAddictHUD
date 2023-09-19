import type { ICSVRecord } from '$lib/types';
import { writable } from 'svelte/store';

export function load() {
  const csv = writable<ICSVRecord[] | null>(null);
  const video = writable<File | null>(null);

  return {
    csv,
    video
  };
}
