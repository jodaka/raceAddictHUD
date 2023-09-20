import { formatTime } from '$lib/utils';

export const renderTime = ({
  ctx,
  raceTime,
  timestamp,
  width,
  lastLapTime,
  lapTimestamp
}: {
  ctx: CanvasRenderingContext2D;
  width: number;
  timestamp: number;
  raceTime: number;
  lastLapTime: number;
  lapTimestamp: number;
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
