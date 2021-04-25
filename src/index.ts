import { getElementById } from "./getElementById.js";
import { onReady } from "./onReady.js";

type Rect = [number, number, number, number];

const fit = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);

const renderGraph = (ctx: CanvasRenderingContext2D, data: number[], rect: Rect) => {
    const min = Math.min(...data);
    const max = Math.max(...data);

    ctx.clearRect(...rect);
    ctx.strokeStyle = "black";
    ctx.strokeRect(...rect);
    const getX = (value: number) => fit(value, 0, data.length, rect[0], rect[0] + rect[2]);
    const getY = (value: number) => fit(value, min, max, rect[1] + rect[3], rect[1]);
    const getPoint = (index: number, value: number) => [getX(index), getY(value)] as [number, number];
    ctx.beginPath();
    ctx.moveTo(...getPoint(0, data[0]));
    data.forEach((value, i) => ctx.lineTo(...getPoint(i, value)));
    ctx.stroke();
};

onReady(() => {
    const iframe = getElementById<HTMLIFrameElement>("iframe");
    const reload = getElementById<HTMLButtonElement>("reload");
    reload.onclick = () => {
        if (iframe.contentWindow !== null) {
            iframe.contentWindow.location.reload();
        }
    };
    const remove = getElementById<HTMLButtonElement>("remove");
    remove.onclick = () => {
        document.body.removeChild(iframe);
    };

    const totalJSHeapSizeHistory = [] as number[];
    const usedJSHeapSizeHistory = [] as number[];

    const usageEl = getElementById<HTMLCanvasElement>("usage");
    usageEl.width = 800;
    usageEl.height = 400;
    const usageCtx = usageEl.getContext("2d");
    if (usageCtx === null) {
        throw new Error("couldn't get canvas context");
    }

    const loop = () => {
        requestAnimationFrame(loop);
        const memory = window.performance.memory;

        totalJSHeapSizeHistory.push(memory.totalJSHeapSize);
        usedJSHeapSizeHistory.push(memory.usedJSHeapSize);

        const halfW = (usageEl.width * 0.5) | 0;

        renderGraph(usageCtx, usedJSHeapSizeHistory, [0, 0, halfW, usageEl.height]);
        renderGraph(usageCtx, totalJSHeapSizeHistory, [halfW, 0, halfW, usageEl.height]);
    };

    requestAnimationFrame(loop);
});
