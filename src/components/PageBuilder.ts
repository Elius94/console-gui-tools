import { SimplifiedStyledElement, StyledElement, simplifiedStyledToStyled } from "./Utils.js"

/**
 * @class PageBuilder
 * @description Defines a new page:
 * It's a sort of collection of styled rows.
 * @param {number} rowsPerPage - The number of rows per page. Default is 100. Useful for scrolling.
 *
 * @export
 * @class PageBuilder
 */
export class PageBuilder {
    rowsPerPage: number
    scrollIndex: number
    content: StyledElement[][]

    public constructor(rowsPerPage = 100) {
        this.rowsPerPage = rowsPerPage

        /**
         * @const {number} scrollIndex - The index of the scroll bar.
         * @memberOf PageBuilder 
         */
        this.scrollIndex = 0

        /**
         * @const {Array<Array<object>>} content The content of the page.
         * @memberOf PageBuilder
         */
        this.content = []
    }

    /**
     * @description Add a new styled row to the page.
     * @param {parameters<object>} row - The styled row to add.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example
     * page.addRow({ text: 'Hello World', color: 'white' })
     * page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
     */
    public addRow(...args: SimplifiedStyledElement[]): PageBuilder {
        // each argument is an object like {text: string, color: string}
        const _row: StyledElement[] = args.map((arg) => simplifiedStyledToStyled(arg)) // convert to StyledElement
        this.content.push(_row)
        return this
    }

    /**
     * @description Add an empty row to the page. (like <br /> in HTML)
     * @param {number} [count=1] - The number of empty rows to add.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example page.addEmptyRow()
     * page.addEmptyRow(2)
     */
    public addSpacer(height = 1): PageBuilder {
        if (height > 0) {
            for (let i = 0; i < height; i++) {
                this.addRow({ text: "", color: "" })
            }
        }
        return this
    }

    /**
     * @description Returns the content of the page.
     * @returns {Array<Array<object>>}
     * @memberOf PageBuilder
     * @example page.getContent()
     */
    public getContent(): StyledElement[][] {
        if (this.getPageHeight() > this.rowsPerPage) {
            return this.content.slice(this.getPageHeight() - this.scrollIndex - this.rowsPerPage, this.getPageHeight() - this.scrollIndex)
        } else {
            return this.content
        }
    }

    /**
     * @description Returns the height of the page.
     * @returns {number}
     * @memberOf PageBuilder
     * @example page.getPageHeight()
     */
    public getPageHeight(): number {
        return this.content.length
    }

    /**
     * @description Returns the height of the viewed page. It excludes the rows that are not visible.
     * @returns {number}
     * @memberOf PageBuilder
     * @example page.getViewedPageHeight() // returns the height of the page that is visible
     */
    public getViewedPageHeight(): number {
        return this.getContent().length
    }

    /**
     * @description Changes the index of the scroll bar.
     * @param {number} index - The index of the scroll bar.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example page.setScrollIndex(10)
     */
    public setScrollIndex(index: number): PageBuilder {
        this.scrollIndex = index
        return this
    }

    /**
     * @description Changes the number of rows per page.
     * @param {number} rowsPerPage - The number of rows per page.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example page.setRowsPerPage(10)
     */
    public setRowsPerPage(rpp: number): PageBuilder {
        this.rowsPerPage = rpp
        return this
    }

    /**
     * @description Increases the index of the scroll bar.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example page.increaseScrollIndex()
     */
    public increaseScrollIndex(): PageBuilder {
        if (this.scrollIndex < this.getPageHeight() - this.rowsPerPage) {
            this.scrollIndex++
        }
        return this
    }

    /**
     * @description Decreases the index of the scroll bar.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example page.increaseScrollIndex()
     */
    public decreaseScrollIndex(): PageBuilder {
        if (this.scrollIndex > 0) {
            this.scrollIndex--
        }
        return this
    }

    /**
     * @description Clears the page.
     * @returns {PageBuilder}
     * @memberOf PageBuilder
     * @example page.clear()
     * @since 1.2.0
     */
    public clear(): PageBuilder {
        this.content = []
        return this
    }
}

export default PageBuilder