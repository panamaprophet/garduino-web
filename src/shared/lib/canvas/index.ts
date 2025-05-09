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

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

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
    options?: Partial<{ color: string; fontSize: number; bold: boolean; textAlign: 'center' | 'left' | 'right'; textBaseline: 'middle' }>
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


export const createSmoothLine = (context: CanvasRenderingContext2D, coordinates: [x: number, y: number][], color: string) => {
    if (!coordinates[0]) {
        return;
    }

    context.beginPath();
    context.moveTo(...coordinates[0]);

    for (let i = 0; i < coordinates.length - 1; i ++) {
        const item = coordinates[i];
        const nextItem = coordinates[i + 1];

        if (!item || !nextItem) {
            continue;
        }

        const midX = (item[0] + nextItem[0]) / 2;
        const midY = (item[1] + nextItem[1]) / 2;
        const controlPointX1 = (midX + item[0]) / 2;
        const controlPointX2 = (midX + nextItem[0]) / 2;

        context.quadraticCurveTo(
            controlPointX1,
            item[1],
            midX,
            midY,
        );

        context.quadraticCurveTo(
            controlPointX2,
            nextItem[1],
            nextItem[0],
            nextItem[1],
        );
    }

    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
};

export const createRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    options: { color: string; lineWidth?: number }
) => {
    ctx.fillStyle = options.color;
    ctx.fillRect(x, y, width, height);
    
    if (options.lineWidth) {
        ctx.strokeStyle = options.color;
        ctx.lineWidth = options.lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
};
