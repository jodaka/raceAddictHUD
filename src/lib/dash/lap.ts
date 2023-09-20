export const renderLap = ({
  ctx,
  lap,
  width
}: {
  ctx: CanvasRenderingContext2D;
  lap: string | number;
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
