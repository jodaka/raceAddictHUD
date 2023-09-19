<script lang="ts">
  import type { ICSVRecord } from '$lib/types';

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

  const renderSpeed = ({ ctx, speed }: { ctx: CanvasRenderingContext2D; speed: string | number }) => {
    ctx.fillStyle = '#33333380';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00c6ff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(75, 25);
    ctx.lineTo(0, 25);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`${speed} km/h`, 10, 18);
  };

  const renderLap = ({ ctx, lap, width }: { ctx: CanvasRenderingContext2D; lap: string | number; width: number }) => {
    ctx.fillStyle = '#33333380';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00c6ff';
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width - 100, 0);
    ctx.lineTo(width - 75, 25);
    ctx.lineTo(width, 25);
    ctx.lineTo(width, 0);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Lap ${lap}`, width - 60, 18);
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
    ctx.clearRect(0, 0, width, height);
    renderSpeed({ ctx, speed });
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

  $: if (canvasDiv && video) {
    const canvasContext: CanvasRenderingContext2D = (canvasDiv as HTMLCanvasElement).getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    canvasContext.scale(1, 1);
    const canvasDimensions = video.getBoundingClientRect();

    canvasDiv.width = canvasDimensions.width;
    canvasDiv.height = canvasDimensions.height;

    const processFrame: VideoFrameRequestCallback = (
      now: DOMHighResTimeStamp,
      metadata: VideoFrameCallbackMetadata
    ) => {
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
      video.requestVideoFrameCallback(processFrame);
    };

    video.requestVideoFrameCallback(processFrame);
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
