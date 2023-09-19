import type { ICSVRecord } from '$lib/types';
import { writable } from 'svelte/store';
import { getStoredValue } from '$lib/utils';
import { STORAGE_KEYS } from '$lib/const';

export function load() {
  const csv = writable<ICSVRecord[] | null>();
  const video = writable<File | null>();

  $: csv.set(getStoredValue<ICSVRecord[]>(STORAGE_KEYS.CSV, null));
  $: video.set(getStoredValue<File>(STORAGE_KEYS.VIDEO, null));

  return {
    csv,
    video
  };
}
