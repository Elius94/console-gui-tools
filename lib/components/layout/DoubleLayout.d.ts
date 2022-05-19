/**
 * @class DoubleLayout
 * @description This class is a layout that has two pages.
 * @param {PageBuilder} page1 The first page.
 * @param {PageBuilder} page2 The second page.
 * @param {boolean} options Layout options.
 * @param {number} selected The selected page.
 * @example const layout = new DoubleLayout(page1, page2, true, 0)
 */
export class DoubleLayout {
    constructor(page1: any, page2: any, options?: {}, selected?: number);
    /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
    CM: ConsoleManager;
    options: {};
    selected: number;
    page1: any;
    page2: any;
    boxBold: boolean;
    proportions: any;
    /** @const {string} page2Title The title of page2. */
    page2Title: any;
    /** @const {string} page1Title The application title. */
    page1Title: any;
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
    setSelected(selected: number): void;
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
    drawLine(line: Array<object>, index?: number): void;
    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof DoubleLayout
     * @returns {void}
     * @example layout.draw()
     */
    draw(): void;
    isOdd: boolean | undefined;
    realWidth: number[] | undefined;
}
export default DoubleLayout;
import { ConsoleManager } from "../../ConsoleGui.js";
