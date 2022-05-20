import { ForegroundColor } from "chalk";
import { ConsoleManager, PageBuilder } from "../../ConsoleGui.js";
/**
 * @description The type containing all the possible options for the DoubleLayout.
 * @typedef {Object} DoubleLayoutOptions
 * @property {boolean} [showTitle] - If the title should be shown.
 * @property {boolean} [boxed] - If the layout should be boxed.
 * @property {ForegroundColor | ""} [boxColor] - The color of the box taken from the chalk library.
 * @property {"bold"} [boxStyle] - If the border of the box should be bold.
 * @property {string} [changeFocusKey] - The key that should be pressed to change the focus.
 * @property {"horizontal" | "vertical"} [direction] - The direction of the layout.
 * @property {string} [page1Title] - The title of the first page.
 * @property {string} [page2Title] - The title of the second page.
 * @property {[number, number]} [pageRatio] - The ratio of the pages. (in horizontal direction)
 *
 * @export
 * @interface DoubleLayoutOptions
 */
export interface DoubleLayoutOptions {
    showTitle?: boolean;
    boxed?: boolean;
    boxColor?: ForegroundColor | "";
    boxStyle?: "bold";
    changeFocusKey: string;
    direction?: "horizontal" | "vertical";
    page1Title?: string;
    page2Title?: string;
    pageRatio?: [number, number];
}
/**
 * @class DoubleLayout
 * @description This class is a layout that has two pages.
 * @param {PageBuilder} page1 The first page.
 * @param {PageBuilder} page2 The second page.
 * @param {boolean} options Layout options.
 * @param {number} selected The selected page.
 * @example const layout = new DoubleLayout(page1, page2, true, 0)
 */
export declare class DoubleLayout {
    CM: ConsoleManager;
    options: DoubleLayoutOptions;
    selected: 0 | 1;
    page1: PageBuilder;
    page2: PageBuilder;
    boxBold: boolean;
    proportions: [number, number];
    page2Title: string;
    page1Title: string;
    realWidth: number | [number, number];
    isOdd: boolean | undefined;
    constructor(page1: PageBuilder, page2: PageBuilder, options: DoubleLayoutOptions, selected?: 0 | 1);
    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof DoubleLayout
     */
    setPage1(page: PageBuilder): void;
    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof DoubleLayout
     */
    setPage2(page: PageBuilder): void;
    /**
     * @description This function is used to enable or disable the layout border.
     * @param {boolean} border enable or disable the border
     * @memberof DoubleLayout
     */
    setBorder(border: boolean): void;
    /**
     * @description This function is used to choose the page to be highlighted.
     * @param {number} selected 0 for page1, 1 for page2
     * @memberof DoubleLayout
     */
    setSelected(selected: 0 | 1): void;
    /**
     * @description This function is used to get the selected page.
     * @returns {number} 0 for page1, 1 for page2
     * @memberof DoubleLayout
     */
    getSelected(): number;
    /**
     * @description This function is used to get switch the selected page.
     * @returns {void}
     * @memberof DoubleLayout
     */
    changeLayout(): void;
    /**
     * @description This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.
     * @param {Array<object>} line the line to be drawn
     * @param {number} lineIndex the index of the selected line
     * @memberof DoubleLayout
     * @returns {void}
     */
    private drawLine;
    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof DoubleLayout
     * @returns {void}
     * @example layout.draw()
     */
    draw(): void;
}
export default DoubleLayout;
