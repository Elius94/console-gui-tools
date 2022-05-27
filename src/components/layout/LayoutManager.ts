import { ForegroundColor } from "chalk"
import { ConsoleManager } from "../../ConsoleGui.js"
import PageBuilder from "../PageBuilder.js"
import DoubleLayout, { DoubleLayoutOptions } from "./DoubleLayout.js"
import SingleLayout, { SingleLayoutOptions } from "./SingleLayout.js"

/**
 * @description The type containing all the possible options for the layout.
 * @typedef {Object} LayoutOptions
 * @prop {boolean} [showTitle] - If the title should be shown.
 * @prop {boolean} [boxed] - If the layout should be boxed.
 * @prop {ForegroundColor | ""} [boxColor] - The color of the box taken from the chalk library.
 * @prop {"bold"} [boxStyle] - If the border of the box should be bold.
 * @prop {"single" | "double" | "triple" | "quad"} [type] - The type of the layout.
 * @prop {string} [changeFocusKey] - The key that should be pressed to change the focus.
 * @prop {"horizontal" | "vertical"} [direction] - The direction of the layout.
 * @prop {string[]} [pageTitles] - The title of the first page.
 * @prop {[number, number] | [[number, number]]} [pageRatio] - The ratio of the pages. (in horizontal direction)
 *
 * @export
 * @interface LayoutOptions
 */
export interface LayoutOptions {
    showTitle?: boolean;
    boxed?: boolean;
    boxColor?: ForegroundColor | ""; // add color list from chalk
    boxStyle?: "bold";
    changeFocusKey: string;
    type: "single" | "double" | "triple" | "quad";
    direction?: "horizontal" | "vertical";
    pageTitles?: string[];
    pageRatio?: [number, number] | [[number, number]];
}

/**
 * @class LayoutManager
 * @description This class is a layout that has two pages.
 * @param {PageBuilder} page The first page.
 * @param {boolean} options Layout options.
 * @example const layout = new LayoutManager(page1, page2, true, 0)
 */
export class LayoutManager {
    CM!: ConsoleManager
    options!: LayoutOptions
    optionsRelative!: SingleLayoutOptions | DoubleLayoutOptions
    pages: { [key: number]: PageBuilder } = {}
    pageTitles: string[] = []
    public layout!: DoubleLayout | SingleLayout
    instance!: LayoutManager

    public constructor(pages: PageBuilder[], options: LayoutOptions) {
        if (this.instance) {
            return this.instance
        } else {
            this.instance = this
            /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
            this.CM = new ConsoleManager()


            this.options = options
            pages.forEach((page, index) => {
                this.pages[index] = page
            })

            /** @const {string} pageTitle The application title. */
            this.pageTitles = this.options.pageTitles || [this.CM.applicationTitle]

            switch (this.options.type) {
            case "single":
                this.optionsRelative = {
                    showTitle: this.options.showTitle,
                    boxed: this.options.boxed,
                    boxColor: this.options.boxColor,
                    boxStyle: this.options.boxStyle,
                    pageTitle: this.pageTitles ? this.pageTitles[0] : "",
                } as SingleLayoutOptions
                this.layout = new SingleLayout(this.pages[0], this.optionsRelative)
                break
            case "double":
                this.optionsRelative = {
                    showTitle: this.options.showTitle,
                    boxed: this.options.boxed,
                    boxColor: this.options.boxColor,
                    boxStyle: this.options.boxStyle,
                    changeFocusKey: this.options.changeFocusKey,
                    direction: this.options.direction,
                    page1Title: this.pageTitles ? this.pageTitles[0] : "",
                    page2Title: this.pageTitles ? this.pageTitles[1] : "",
                    pageRatio: this.options.pageRatio,
                } as DoubleLayoutOptions
                this.layout = new DoubleLayout(this.pages[0], this.pages[1], this.optionsRelative as DoubleLayoutOptions)
                break
            case "triple":

                break
            case "quad":

                break
            default:
                break
            }
        }
    }

    private isSingleLayout = (x: unknown): x is SingleLayout => {
        return x instanceof SingleLayout
    }

    public setPages(pages: PageBuilder[]): void {
        pages.forEach((page, index) => {
            this.pages[index] = page
            if (this.isSingleLayout(this.layout)) {
                this.layout.setPage(page)
            } else {
                this.layout.setPage(page, index)
            }
        })
    }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof LayoutManager
     */
    public setPage(page: PageBuilder, index: number): void { 
        this.pages[index] = page
        if (this.isSingleLayout(this.layout)) {
            this.layout.setPage(page)
        } else {
            this.layout.setPage(page, index)
        }
    }

    public setTitle(title: string, index: number): void { 
        this.pageTitles[index] = title
        if (this.isSingleLayout(this.layout)) {
            this.layout.setTitle(title)
        } else {
            this.layout.setTitle(title, index)
        }
    }

    public setTitles(titles: string[]): void {
        this.pageTitles = titles
        if (this.isSingleLayout(this.layout)) {
            this.layout.setTitle(titles[0])
        } else {
            this.layout.setTitles(titles)
        }
    }

    /**
     * @description This function is used to enable or disable the layout border.
     * @param {boolean} border enable or disable the border
     * @memberof LayoutManager
     */
    public setBorder(border: boolean): void { this.options.boxed = border }

    /**
     * @description This function is used to choose the page to be highlighted.
     * @param {number} selected 0 for page1, 1 for page2
     * @memberof LayoutManager
     */
    public setSelected(selected: 0 | 1 | 2 | 3): void { 
        if (!this.isSingleLayout(this.layout)) {
            this.layout.setSelected(selected as 0 | 1) 
        }
    }

    /**
      * @description This function is used to get the selected page.
      * @returns {number} 0 for page1, 1 for page2
      * @memberof LayoutManager
      */
    public getSelected(): number {
        if (!this.isSingleLayout(this.layout)) {
            return this.layout.selected
        }
        return 0
    }

    /**
      * @description This function is used to get switch the selected page.
      * @returns {void}
      * @memberof LayoutManager
      */
    public changeLayout(): void {
        if (!this.isSingleLayout(this.layout)) {
            this.layout.changeLayout()
        }
    }

    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof LayoutManager
     * @returns {void}
     * @example layout.draw()
     */
    public draw(): void {
        this.layout.draw()
    }
}

export default LayoutManager