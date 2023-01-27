import { ForegroundColorName } from "chalk"
import { ConsoleManager, PageBuilder } from "../../ConsoleGui.js"
import { boxChars, HEX, RGB, StyledElement, truncate } from "../Utils.js"

/**
 * @description The type containing all the possible options for the SingleLayout.
 * @typedef {Object} SingleLayoutOptions
 * @prop {boolean} [showTitle] - If the title should be shown.
 * @prop {boolean} [boxed] - If the layout should be boxed.
 * @prop {ForegroundColorName | HEX | RGB | ""} [boxColor] - The color of the box taken from the chalk library.
 * @prop {"bold"} [boxStyle] - If the border of the box should be bold.
 * @prop {string} [pageTitle] - The title of the first page.
 *
 * @export
 * @interface SingleLayoutOptions
 */
// @type definition
export interface SingleLayoutOptions {
    showTitle?: boolean;
    boxed?: boolean;
    boxColor?: ForegroundColorName | HEX | RGB | ""; // add color list from chalk
    boxStyle?: "bold";
    pageTitle?: string;
}

/**
 * @class SingleLayout
 * @description This class is a layout that has two pages.
 * 
 * ![single layout](https://user-images.githubusercontent.com/14907987/170997567-b1260996-cc7e-4c26-8389-39519313f3f6.png)
 * 
 * @param {PageBuilder} page The first page.
 * @param {boolean} options Layout options.
 * @example const layout = new SingleLayout(page1, page2, true, 0)
 */
export class SingleLayout {
    CM: ConsoleManager
    options: SingleLayoutOptions
    page: PageBuilder
    boxBold: boolean
    pageTitle: string
    isOdd: boolean | undefined

    public constructor(page: PageBuilder, options: SingleLayoutOptions) {
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()

        this.options = options
        this.page = page

        this.boxBold = this.options.boxStyle === "bold" ? true : false

        /** @const {string} pageTitle The application title. */
        this.pageTitle = this.options.pageTitle || this.CM.applicationTitle
    }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof SingleLayout
     */
    public setPage(page: PageBuilder): void { this.page = page }

    /**
     * @description This function is used to set the title of the layout.
     * @param {string} title the title to be set
     * @memberof SingleLayout
     * @returns {void}
     * @example layout.setTitle("My Title")
     */
    public setTitle(title: string): void { this.pageTitle = title }

    /**
     * @description This function is used to enable or disable the layout border.
     * @param {boolean} border enable or disable the border
     * @memberof SingleLayout
     */
    public setBorder(border: boolean): void { this.options.boxed = border }

    /**
     * @description This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.
     * @param {Array<StyledElement>} line the line to be drawn
     * @memberof SingleLayout
     * @returns {void}
     */
    private drawLine(line: Array<StyledElement>): void {
        const bsize = this.options.boxed ? 2 : 0
        let unformattedLine = ""
        let newLine = [...line]

        line.forEach((element: { text: string; }) => {
            unformattedLine += element.text
        })

        if (unformattedLine.length > this.CM.Screen.width - bsize) { // Need to truncate
            const offset = 2
            newLine = [...JSON.parse(JSON.stringify(line))] // Shallow copy because I just want to modify the values but not the original

            let diff = unformattedLine.length - this.CM.Screen.width + 1

            // remove truncated text
            for (let j = newLine.length - 1; j >= 0; j--) {
                if (newLine[j].text.length > diff + offset) {
                    newLine[j].text = truncate(newLine[j].text, (newLine[j].text.length - diff) - offset, true)
                    break
                } else {
                    diff -= newLine[j].text.length
                    newLine.splice(j, 1)
                }
            }
            // Update unformatted line
            unformattedLine = newLine.map((element: { text: string; }) => element.text).join("")
        }
        if (this.options.boxed) newLine.unshift({ text: boxChars["normal"].vertical, style: { color: this.options.boxColor, bold: this.boxBold } })
        if (unformattedLine.length <= this.CM.Screen.width - bsize) {
            newLine.push({ text: `${" ".repeat((this.CM.Screen.width - unformattedLine.length) - bsize)}`, style: { color: "" } })
        }
        if (this.options.boxed) newLine.push({ text: boxChars["normal"].vertical, style: { color: this.options.boxColor, bold: this.boxBold } })
        this.CM.Screen.write(...newLine)
    }

    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof SingleLayout
     * @returns {void}
     * @example layout.draw()
     */
    public draw(): void {
        this.isOdd = this.CM.Screen.width % 2 === 1
        const trimmedTitle = truncate(this.pageTitle, this.CM.Screen.width - 2, false)
        if (this.options.boxed) { // Draw pages with borders
            if (this.options.showTitle) {
                this.CM.Screen.write({ text: `${boxChars["normal"].topLeft}${boxChars["normal"].horizontal}${trimmedTitle}${boxChars["normal"].horizontal.repeat(this.CM.Screen.width - trimmedTitle.length - 3)}${boxChars["normal"].topRight}`, style: { color: this.options.boxColor, bold: this.boxBold } })
            } else {
                this.CM.Screen.write({ text: `${boxChars["normal"].topLeft}${boxChars["normal"].horizontal}${boxChars["normal"].horizontal.repeat(this.CM.Screen.width - 3)}${boxChars["normal"].topRight}`, style: { color: this.options.boxColor, bold: this.boxBold } })
            }
            this.page.getContent().forEach((line: StyledElement[]) => {
                this.drawLine(line)
            })
            this.CM.Screen.write({ text: `${boxChars["normal"].bottomLeft}${boxChars["normal"].horizontal.repeat(this.CM.Screen.width - 2)}${boxChars["normal"].bottomRight}`, style: { color: this.options.boxColor, bold: this.boxBold } })
        } else { // Draw pages without borders
            if (this.options.showTitle) {
                this.CM.Screen.write({ text: `${trimmedTitle}`, style: { color: this.options.boxColor, bold: this.boxBold } })
            }
            this.page.getContent().forEach((line: StyledElement[]) => {
                this.drawLine(line)
            })
        }
    }
}

export default SingleLayout