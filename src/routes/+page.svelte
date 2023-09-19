<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  import Setup from '$lib/setup/setup.svelte';
  import type { ICSVRecord } from '$lib/types.js';

  export let data;

  const storedCsv = data.csv;
  const storedVideo = data.video;

  const handleSave = (csv: ICSVRecord[], video: File) => {
    // save to store
    storedCsv.set(csv);
    storedVideo.set(video);

    // redirect to hud
    if (browser) {
      goto('/hud');
    }
  };
</script>

<Setup
  onSubmit={handleSave}
  csv={$storedCsv}
/>
