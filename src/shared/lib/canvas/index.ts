export const upscaleCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) => {
    const dpr = window.devicePixelRatio || 1;

    ctx.canvas.width = width * dpr;
    ctx.canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
};

export const clearCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) => {
    ctx.clearRect(0, 0, width, height);
};

export const createCircle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    options: { color?: string; strokeColor?: string; strokeWidth?: number }
) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = options.color ?? "white";
    ctx.fill();
    
    if (options.strokeColor && options.strokeWidth) {
        ctx.strokeStyle = options.strokeColor;
        ctx.lineWidth = options.strokeWidth;
        ctx.stroke();
    }
};

export const createText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    options?: Partial<{ color: string; fontSize: number; bold: boolean; textAlign: 'center'; textBaseline: 'middle' }>
) => {
    ctx.fillStyle = options?.color ?? 'black';
    ctx.font = `${options?.bold ? "bold " : ""}${options?.fontSize}px sans-serif`;
    ctx.textAlign = options?.textAlign ?? 'center';
    ctx.textBaseline = options?.textBaseline ?? 'middle';
    ctx.fillText(text, x, y);
};

export const createArc = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    options: { color: string; lineWidth: number }
) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineWidth = options.lineWidth;
    ctx.strokeStyle = options.color;
    ctx.stroke();
};

export const createLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: { color: string; lineWidth: number }
) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.lineWidth;
    ctx.stroke();
};
