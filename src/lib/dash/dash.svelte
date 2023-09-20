<script lang="ts">
  import type { ICSVRecord } from '$lib/types';
  import { onMount } from 'svelte';
  import { debounce, getCSVRecordByNumber } from '$lib/utils';
  import { renderSpeed } from './speed';
  import { renderLap } from './lap';
  import { renderTime } from './time';
  import { renderAcceleration } from './acceleration';

  export let video: HTMLVideoElement;
  export let csv: ICSVRecord[] | null;

  let canvasDiv: HTMLCanvasElement;
  let currentLap = 0;
  let lapTimestamp = 0;
  let lastLapTime = 0;

  const renderDataOverlay = ({
    ctx,
    width,
    height,
    speed,
    lap,
    timestamp,
    raceTime,
    acceleration,
    lastLapTime
  }: {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    speed: number;
    lap: number;
    timestamp: number;
    raceTime: number;
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
    lastLapTime: number;
  }) => {
    renderSpeed({ ctx, speed, width });
    renderLap({ ctx, lap, width });
    renderTime({
      ctx,
      raceTime,
      timestamp,
      width,
      lastLapTime,
      lapTimestamp
    });
    renderAcceleration({ ctx, width, height, acceleration });
  };

  const changeCanvasDimensions = () => {
    let canvasDimensions = video.getBoundingClientRect();
    canvasDiv.width = canvasDimensions.width;
    canvasDiv.height = canvasDimensions.height;
    return canvasDimensions;
  };

  const debouncedSetWindowWidth = debounce(changeCanvasDimensions, 300);

  onMount(() => {
    window.addEventListener('resize', debouncedSetWindowWidth);

    return () => {
      window.removeEventListener('resize', debouncedSetWindowWidth);
    };
  });

  $: if (canvasDiv && video) {
    const canvasContext: CanvasRenderingContext2D = (canvasDiv as HTMLCanvasElement).getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    canvasContext.scale(1, 1);

    let canvasDimensions = changeCanvasDimensions();

    let animationHandle: any;

    video.addEventListener('play', () => {
      processFrame();
    });

    function processFrame(now?: DOMHighResTimeStamp, metadata?: VideoFrameCallbackMetadata) {
      // update the canvas when a video proceeds to next frame
      canvasContext.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      canvasContext.drawImage(video, 0, 0, canvasDimensions.width, canvasDimensions.height);

      if (metadata) {
        const item = getCSVRecordByNumber(metadata.mediaTime, csv as ICSVRecord[]);

        const speed = Math.floor(item.speed);
        const raceTime = item.time;
        const lap = item.lap;
        const timestamp = item.utcTime;

        if (lap !== currentLap) {
          lastLapTime = raceTime - lastLapTime;
          currentLap = lap;
          lapTimestamp = timestamp;
          setTimeout(() => (lastLapTime = 0), 3000);
        }

        renderDataOverlay({
          ctx: canvasContext,
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          speed,
          lap,
          timestamp,
          raceTime,
          acceleration: {
            x: item.accelerationY, // Note X and Y are swapped here
            y: item.accelerationX, // Note X and Y are swapped here
            z: item.accelerationZ
          },
          lastLapTime
        });
        console.log(333, 'hud rendered', item.index, metadata.mediaTime);
      }
      animationHandle = video.requestVideoFrameCallback(processFrame);
    }
  }
</script>

<div class="dash">
  <canvas
    class="dash__canvas"
    bind:this={canvasDiv}
  />
</div>

<style>
  .dash {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
  }

  .dash__canvas {
    position: absolute;
  }
</style>
