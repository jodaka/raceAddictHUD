export const renderAcceleration = ({
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
