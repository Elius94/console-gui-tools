import { ForegroundColor } from "chalk"
import { ConsoleManager } from "../../ConsoleGui.js"
import PageBuilder from "../PageBuilder.js"
import DoubleLayout, { DoubleLayoutOptions } from "./DoubleLayout.js"
import QuadLayout, { QuadLayoutOptions } from "./QuadLayout.js"
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
 * 
 * ![change ratio](https://user-images.githubusercontent.com/14907987/170999347-868eac7b-6bdf-4147-bcb0-b7465282ed5f.gif)
 * 
 * @param {PageBuilder[]} pages The pages that should be shown.
 * @param {boolean} options Layout options.
 * @example const layout = new LayoutManager([page1, page2], pageOptions);
 */
export class LayoutManager {
    private CM!: ConsoleManager
    private options!: LayoutOptions
    private optionsRelative!: SingleLayoutOptions | DoubleLayoutOptions | QuadLayoutOptions
    public pages: { [key: number]: PageBuilder } = {}
    private pageTitles: string[] = []
    public layout!: SingleLayout | DoubleLayout | QuadLayout
    private instance!: LayoutManager

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
                this.optionsRelative = {
                    showTitle: this.options.showTitle,
                    boxed: this.options.boxed,
                    boxColor: this.options.boxColor,
                    boxStyle: this.options.boxStyle,
                    changeFocusKey: this.options.changeFocusKey,
                    direction: this.options.direction,
                    page1Title: this.pageTitles ? this.pageTitles[0] : "",
                    page2Title: this.pageTitles ? this.pageTitles[1] : "",
                    page3Title: this.pageTitles ? this.pageTitles[2] : "",
                    page4Title: this.pageTitles ? this.pageTitles[3] : "",
                    pageRatio: this.options.pageRatio,
                } as QuadLayoutOptions
                this.layout = new QuadLayout(this.pages[0], this.pages[1], this.pages[2], this.pages[3], this.optionsRelative as QuadLayoutOptions)
                break
            default:
                break
            }
        }
    }

    /**
     * @description This function is used to check if the layout is a single layout by checking the type of the instance.
     * @param {unknown} x - The instance of the layout.
     * @returns {boolean} - If the layout is a single layout.
     * @memberof LayoutManager
     * @example const isSingleLayout = this.isSingleLayout(layout)
     */
    private isSingleLayout = (x: unknown): x is SingleLayout => {
        return x instanceof SingleLayout
    }

    /**
     * @description This function is used to update the layout pages.
     * @param {PageBuilder[]} pages The pages that should be shown.
     * @memberof LayoutManager
     * @example layout.updatePages([page1, page2])
     * @example layout.updatePages([page1, page2, page3])
     */
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
     * @param {number} index the index of the page
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

    /**
     * @description This function is used to update the page title.
     * @param {string} title The title of the page.
     * @param {number} index The index of the page.
     * @memberof LayoutManager
     * @example layout.setTitle("Page Title", 1)
     */
    public setTitle(title: string, index: number): void { 
        this.pageTitles[index] = title
        if (this.isSingleLayout(this.layout)) {
            this.layout.setTitle(title)
        } else {
            this.layout.setTitle(title, index)
        }
    }

    /**
     * @description This function is used to update the page titles.
     * @param {string[]} titles The titles of the pages.
     * @memberof LayoutManager
     * @example layout.setTitles(["Page Title 1", "Page Title 2"])
     */
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
     * @param {0 | 1 | 2 | 3} selected 0 for page1, 1 for page2
     * @memberof LayoutManager
     */
    public setSelected(selected: 0 | 1 | 2 | 3): void { 
        if (!this.isSingleLayout(this.layout)) {
            this.layout.setSelected(selected as 0 | 1) 
        }
    }

    /**
      * @description This function is used to get the selected page.
      * @returns {0 | 1 | 2 | 3} 0 for page1, 1 for page2, 2 for page3, 3 for page4
      * @memberof LayoutManager
      */
    public getSelected(): number {
        if (!this.isSingleLayout(this.layout)) {
            return this.layout.selected
        }
        return 0
    }

    /**
      * @description This function is used to get switch the selected page. If the layout is a single layout, it will do nothing.
      * @returns {void}
      * @memberof LayoutManager
      */
    public changeLayout(): void {
        if (!this.isSingleLayout(this.layout)) {
            this.layout.changeLayout()
        }
    }

    /**
     * @description This function is used to decrease the row ratio between the pages in the selected row. This is propagated to the layout instance.
     * @param {quantity} quantity The amount of aspect ratio to be decreased.
     * @memberof LayoutManager
     * @example layout.decreaseRowRatio(0.01)
     */
    public decreaseRatio(quantity: number) {
        if (!this.isSingleLayout(this.layout)) {
            this.layout.decreaseRatio(quantity)
        }
    }

    /**
     * @description This function is used to increase the row ratio between the pages in the selected row. This is propagated to the layout instance.
     * @param {quantity} quantity The amount of aspect ratio to be increased.
     * @memberof LayoutManager
     * @example layout.increaseRowRatio(0.01)
     */
    public increaseRatio(quantity: number) {
        if (!this.isSingleLayout(this.layout)) {
            this.layout.increaseRatio(quantity)
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