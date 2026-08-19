export declare function clamp(v: number): number;
interface IElements {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    style: HTMLSelectElement | null;
    quote: HTMLInputElement | null;
    handle: HTMLInputElement | null;
    font: HTMLSelectElement | null;
    italicFirst: HTMLInputElement | null;
    align: HTMLSelectElement | null;
}
export declare class Elements implements IElements {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    style: HTMLSelectElement | null;
    quote: HTMLInputElement | null;
    handle: HTMLInputElement | null;
    font: HTMLSelectElement | null;
    italicFirst: HTMLInputElement | null;
    align: HTMLSelectElement | null;
    constructor();
    setElements(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, style: HTMLSelectElement, quote: HTMLInputElement, handle: HTMLInputElement, font: HTMLSelectElement, italicFirst: HTMLInputElement, align: HTMLSelectElement): void;
    get values(): {
        style: string;
        quote: string;
        handle: string;
        font: string;
        italicFirst: boolean;
        align: string;
    };
    addInputListener(callback: (e: Event) => void): void;
}
export {};
//# sourceMappingURL=utils.d.ts.map