<script lang="ts">
  import Dash from '$lib/dash/dash.svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  export let data;

  let videoElement: HTMLVideoElement;
  const storedCsv = data.csv;
  const storedVideo = data.video;
  let selectedVideoUrl: any;

  // redirect to hud
  if (browser && !$storedVideo) {
    goto('/');
  }

  $: if ($storedVideo && videoElement) {
    const url = URL.createObjectURL($storedVideo);
    videoElement.setAttribute('src', url);
  }
</script>

<div class="container">
  <video
    controls={true}
    width="100%"
    bind:this={videoElement}
  >
    <source
      src={selectedVideoUrl}
      type="video/mp4"
    />
  </video>
  <Dash
    video={videoElement}
    csv={$storedCsv}
  />
</div>

<style>
  .container {
    position: relative;
    width: 95%;
  }
</style>
