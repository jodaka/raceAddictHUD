export const renderSpeed = ({
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
