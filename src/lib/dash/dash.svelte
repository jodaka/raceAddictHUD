<script lang="ts">
  import type { ICSVRecord } from '$lib/types';
  import { onMount } from 'svelte';
  import { debounce } from '$lib/utils';

  export let video: HTMLVideoElement;
  export let csv: ICSVRecord[] | null;

  function closest(num: number, arr: ICSVRecord[]) {
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

  let canvasDiv: HTMLCanvasElement;
  let currentLap = 0;
  let lapTimestamp = 0;
  let lastLapTime = 0;

  const formatTime = (timeInMs: number): string => {
    const rounded: string = timeInMs.toFixed(1);
    const roundedFloat = parseFloat(rounded);
    const minutes: number = Math.floor(roundedFloat / 60);
    const seconds: string = String(Math.floor(roundedFloat - minutes * 60));
    return `${minutes}:${seconds.padStart(2, '0')}.${rounded[rounded.length - 1]}`;
  };

  const renderSpeed = ({
    ctx,
    speed,
    width
  }: {
    ctx: CanvasRenderingContext2D;
    speed: string | number;
    width: number;
  }) => {
    const base = Math.floor(width / 10);
    const shapeWidth = base;
    const shapeSkew = Math.floor(base * 0.8);
    const shapeHeight = Math.floor(base / 5);
    const fontSize = Math.floor(width / 70);

    ctx.fillStyle = '#33333380';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00c6ff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shapeWidth, 0);
    ctx.lineTo(shapeSkew, shapeHeight);
    ctx.lineTo(0, shapeHeight);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(`${speed} km/h`, shapeWidth - shapeSkew, fontSize);
  };

  const renderLap = ({ ctx, lap, width }: { ctx: CanvasRenderingContext2D; lap: string | number; width: number }) => {
    const base = Math.floor(width / 10);
    const shapeWidth = base;
    const shapeSkew = Math.floor(base * 0.8);
    const shapeHeight = Math.floor(base / 5);
    const fontSize = Math.floor(width / 70);

    ctx.fillStyle = '#33333380';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00c6ff';
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width - shapeWidth, 0);
    ctx.lineTo(width - shapeSkew, shapeHeight);
    ctx.lineTo(width, shapeHeight);
    ctx.lineTo(width, 0);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = `${fontSize} Arial`;
    ctx.fillText(`Lap ${lap}`, width - shapeSkew / 1.3, fontSize);
  };

  const renderTime = ({
    ctx,
    raceTime,
    timestamp,
    width,
    lastLapTime
  }: {
    ctx: CanvasRenderingContext2D;
    width: number;
    timestamp: number;
    raceTime: number;
    lastLapTime: number;
  }) => {
    const formattedTime = formatTime(raceTime);

    ctx.fillStyle = '#33333340';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#b1c0f5';

    ctx.beginPath();
    ctx.arc(Math.floor(width / 2) + 5, -20, 65, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowBlur = 5;
    ctx.shadowColor = '#b1c0f5';
    ctx.fillStyle = '#ECECEC';
    ctx.font = '20px Hack';

    if (lapTimestamp !== 0) {
      // console.log(timestamp, lapTimestamp, timestamp - lapTimestamp);
      const lapTime = formatTime(timestamp - lapTimestamp);
      ctx.fillText(lapTime, Math.floor(width / 2) - 30, 22);
      ctx.font = '10px Hack';
      ctx.fillText(formattedTime, Math.floor(width / 2) - 15, 33);
    } else {
      ctx.fillText(formattedTime, Math.floor(width / 2) - 30, 22);
    }

    if (lastLapTime) {
      ctx.fillStyle = '#ECECEC';
      ctx.font = '12px Hack';
      ctx.fillText(`Last lap: ${formatTime(lastLapTime)}`, Math.floor(width / 4), 15);
    }
  };

  const renderAcceleration = ({
    ctx,
    width,
    height,
    acceleration,
    radius = 25
  }: {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    radius?: number;
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
  }) => {
    const center = {
      x: width - Math.floor(radius * 1.6),
      y: 65
    };

    ctx.strokeStyle = '#ffffff30';
    ctx.beginPath();
    ctx.moveTo(center.x, center.y - radius);
    ctx.lineTo(center.x, center.y + radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center.x - radius, center.y);
    ctx.lineTo(center.x + radius, center.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(center.x, center.y, radius, center.x, center.y, 2);
    gradient.addColorStop(0, '#ffffff00');
    gradient.addColorStop(0.5, '#ffffff50');
    gradient.addColorStop(0.9, '#ffffff80');
    gradient.addColorStop(1, '#fff');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff60';
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius / 2, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    const x = ((radius / 1.5) * acceleration.x) / 1;
    const y = ((radius / 1.5) * acceleration.y) / 1;
    ctx.fillStyle = 'red';
    ctx.arc(center.x + x, center.y - y, 2, 0, 2 * Math.PI);
    ctx.fill();
  };

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
      lastLapTime
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
    // const canvas = document.querySelector("canvas");
    // const ctx = canvas.getContext("2d");
    // const video = document.querySelector("video");
    video.addEventListener('loadeddata', handleVideoLoaded, false);

    video.addEventListener('play', () => {
      console.log(111, 'video play hit');
      processFrame();
    });

    function handleVideoLoaded() {
      console.log(222, 'video loadeddata hit');
      video.cancelVideoFrameCallback(animationHandle);
      processFrame();
    }

    function processFrame(now?: DOMHighResTimeStamp, metadata?: VideoFrameCallbackMetadata) {
      // update the canvas when a video proceeds to next frame
      canvasContext.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      canvasContext.drawImage(video, 0, 0, canvasDimensions.width, canvasDimensions.height);

      console.log(111, 'processFrame', now, metadata);
      if (metadata) {
        const item = closest(metadata.mediaTime, csv as ICSVRecord[]);

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
        console.log(333, 'hud rendered', canvasDimensions.width, canvasDimensions.height);
      }
      animationHandle = video.requestVideoFrameCallback(processFrame);
    }

    // const processFrame: VideoFrameRequestCallback = (
    //   now: DOMHighResTimeStamp,
    //   metadata: VideoFrameCallbackMetadata
    // ) => {
    //   const item = closest(metadata.mediaTime, csv as ICSVRecord[]);

    //   const speed = Math.floor(item.speed);
    //   const raceTime = item.time;
    //   const lap = item.lap;
    //   const timestamp = item.utcTime;

    //   if (lap !== currentLap) {
    //     lastLapTime = raceTime - lastLapTime;
    //     currentLap = lap;
    //     lapTimestamp = timestamp;
    //     setTimeout(() => (lastLapTime = 0), 3000);
    //   }

    //   renderDataOverlay({
    //     ctx: canvasContext,
    //     width: canvasDimensions.width,
    //     height: canvasDimensions.height,
    //     speed,
    //     lap,
    //     timestamp,
    //     raceTime,
    //     acceleration: {
    //       x: item.accelerationY, // Note X and Y are swapped here
    //       y: item.accelerationX, // Note X and Y are swapped here
    //       z: item.accelerationZ
    //     },
    //     lastLapTime
    //   });
    //   video.requestVideoFrameCallback(processFrame);
    // };

    // video.requestVideoFrameCallback(processFrame);
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
