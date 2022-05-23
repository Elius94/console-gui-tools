import { ForegroundColor } from "chalk"
import { ConsoleManager, PageBuilder } from "../../ConsoleGui.js"
import { StyledElement } from "../PageBuilder.js"

/**
 * @description The type containing all the possible options for the DoubleLayout.
 * @typedef {Object} DoubleLayoutOptions
 * @prop {boolean} [showTitle] - If the title should be shown.
 * @prop {boolean} [boxed] - If the layout should be boxed.
 * @prop {ForegroundColor | ""} [boxColor] - The color of the box taken from the chalk library.
 * @prop {"bold"} [boxStyle] - If the border of the box should be bold.
 * @prop {string} [changeFocusKey] - The key that should be pressed to change the focus.
 * @prop {"horizontal" | "vertical"} [direction] - The direction of the layout.
 * @prop {string} [page1Title] - The title of the first page.
 * @prop {string} [page2Title] - The title of the second page.
 * @prop {[number, number]} [pageRatio] - The ratio of the pages. (in horizontal direction)
 *
 * @export
 * @interface DoubleLayoutOptions
 */
export interface DoubleLayoutOptions {
    showTitle?: boolean;
    boxed?: boolean;
    boxColor?: ForegroundColor | ""; // add color list from chalk
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
export class DoubleLayout {
    CM: ConsoleManager
    options: DoubleLayoutOptions
    selected: 0 | 1
    page1: PageBuilder
    page2: PageBuilder
    boxBold: boolean
    proportions: [number, number]
    page2Title: string
    page1Title: string
    realWidth: number | [number, number] = 0
    isOdd: boolean | undefined

    public constructor(page1 : PageBuilder, page2: PageBuilder, options: DoubleLayoutOptions, selected: 0 | 1 = 0) {
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()

        this.options = options
        this.selected = selected
        this.page1 = page1
        this.page2 = page2

        this.boxBold = this.options.boxStyle === "bold" ? true : false
        this.proportions = this.options.pageRatio || [0.7, 0.3]

        /** @const {string} page2Title The title of page2. */
        this.page2Title = this.options.page2Title || this.CM.logPageTitle

        /** @const {string} page1Title The application title. */
        this.page1Title = this.options.page1Title || this.CM.applicationTitle
    }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof DoubleLayout
     */
    public setPage1(page: PageBuilder): void { this.page1 = page }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof DoubleLayout
     */
    public setPage2(page: PageBuilder): void { this.page2 = page }

    /**
     * @description This function is used to enable or disable the layout border.
     * @param {boolean} border enable or disable the border
     * @memberof DoubleLayout
     */
    public setBorder(border: boolean): void { this.options.boxed = border }

    /**
     * @description This function is used to choose the page to be highlighted.
     * @param {number} selected 0 for page1, 1 for page2
     * @memberof DoubleLayout
     */
    public setSelected(selected: 0 | 1): void { this.selected = selected }

    /**
     * @description This function is used to get the selected page.
     * @returns {number} 0 for page1, 1 for page2
     * @memberof DoubleLayout
     */
    public getSelected(): number {
        return this.selected
    }

    /**
     * @description This function is used to get switch the selected page.
     * @returns {void}
     * @memberof DoubleLayout
     */
    public changeLayout(): void {
        if (this.selected == 0) {
            this.selected = 1
        } else {
            this.selected = 0
        }
    }

    /**
     * @description This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.
     * @param {Array<object>} line the line to be drawn
     * @param {number} lineIndex the index of the selected line
     * @memberof DoubleLayout
     * @returns {void}
     */
    private drawLine(line :  Array<StyledElement>, secondLine? : Array<StyledElement>, index = 0): void {
        const dir = !this.options.direction || this.options.direction === "vertical" ? "vertical" : "horizontal"
        const bsize = this.options.boxed ? dir === "vertical" ? 2 : 3 : 0
        let unformattedLine = [""]
        let newLine = [
            [...line]
        ]
        if (dir === "vertical") {
            line.forEach(element => {
                unformattedLine[0] += element.text
            })
        } else {
            newLine = [
                [...line],
                [...secondLine? secondLine : line]
            ]
            unformattedLine.push("")
            line.forEach((element : StyledElement) => {
                unformattedLine[0] += element.text
            })
            secondLine?.forEach((element : StyledElement) => {
                unformattedLine[1] += element.text
            })
        }
        if (unformattedLine.filter((e, i) => e.length > this.realWidth[i] - bsize).length > 0) {
            unformattedLine = unformattedLine.map((e, i) => {
                if (e.length > this.realWidth[i] - bsize) { // Need to truncate
                    const offset = 2
                    if (dir === "vertical") {
                        newLine[i] = [...JSON.parse(JSON.stringify(line))] // Shallow copy because I just want to modify the values but not the original
                    } else {
                        newLine[i] = JSON.parse(JSON.stringify(secondLine))
                    }
                    let diff = e.length - this.realWidth[i] + 1

                    // remove truncated text
                    for (let j = newLine[i].length - 1; j >= 0; j--) {
                        if (newLine[i][j].text.length > diff + offset) {
                            newLine[i][j].text = this.CM.truncate(newLine[i][j].text, (newLine[i][j].text.length - diff) - offset, true)
                            break
                        } else {
                            diff -= newLine[i][j].text.length
                            newLine[i].splice(j, 1)
                        }
                    }
                    // Update unformatted line
                    return newLine[i].map(element => element.text).join("")
                }
                return e
            })
        }
        if (dir === "vertical") {
            if (this.options.boxed) newLine[0].unshift({ text: "│", style: { color: this.selected === index ? this.options.boxColor : "white", bold: this.boxBold } })
            if (unformattedLine[0].length <= this.CM.Screen.width - bsize) {
                newLine[0].push({ text: `${" ".repeat((this.CM.Screen.width - unformattedLine[0].length) - bsize)}`, style: { color: "" } })
            }
            if (this.options.boxed) newLine[0].push({ text: "│", style: { color: this.selected === index ? this.options.boxColor : "white", bold: this.boxBold } })
            this.CM.Screen.write(...newLine[0])
        } else {
            const ret: StyledElement[] = []
            if (this.options.boxed) ret.push({ text: "│", style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } })
            ret.push(...newLine[0])
            if (unformattedLine[0].length <= this.realWidth[0] - bsize) {
                ret.push({ text: `${" ".repeat((this.realWidth[0] - unformattedLine[0].length) - (bsize > 0 ? 2 : 0))}`, style: { color: "" } })
            }
            if (this.options.boxed) ret.push({ text: "│", style: { color: this.options.boxColor, bold: this.boxBold } })
            ret.push(...newLine[1])
            if (unformattedLine[1].length <= this.realWidth[1] - bsize) {
                ret.push({ text: `${" ".repeat((this.realWidth[1] - unformattedLine[1].length) - (bsize > 0 ? 1 : 0))}`, style: { color: "" } })
            }
            if (this.options.boxed) ret.push({ text: "│", style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
            this.CM.Screen.write(...ret)
        }
    }

    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof DoubleLayout
     * @returns {void}
     * @example layout.draw()
     */
    public draw(): void {
        this.isOdd = this.CM.Screen.width % 2 === 1
        if (!this.options.direction || this.options.direction === "vertical") {
            this.realWidth = [Math.round(this.CM.Screen.width * 1), Math.round(this.CM.Screen.width * 1)]
            const trimmedTitle = [this.CM.truncate(this.page1Title, this.realWidth[0] - 4, false), this.CM.truncate(this.page2Title, this.realWidth[1] - 4, false)]
            if (this.options.boxed) { // Draw pages with borders
                if (this.options.showTitle) {
                    this.CM.Screen.write({ text: `┌─${trimmedTitle[0]}${"─".repeat(this.CM.Screen.width - trimmedTitle[0].length - 3)}┐`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } })
                } else {
                    this.CM.Screen.write({ text: `┌─${"─".repeat(this.CM.Screen.width - 3)}┐`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } })
                }
                this.page1.getContent().forEach((line: StyledElement[]) => {
                    this.drawLine(line, undefined, 0)
                })
                if (this.options.showTitle) {
                    this.CM.Screen.write({ text: `├─${trimmedTitle[1]}${"─".repeat(this.CM.Screen.width - trimmedTitle[1].length - 3)}┤`, style: { color: this.options.boxColor, bold: this.boxBold } })
                } else {
                    this.CM.Screen.write({ text: `├${"─".repeat(this.CM.Screen.width - 2)}┤`, style: { color: this.options.boxColor, bold: this.boxBold } })
                }
                this.page2.getContent().forEach((line: StyledElement[]) => {
                    this.drawLine(line, undefined, 1)
                })
                this.CM.Screen.write({ text: `└${"─".repeat(this.CM.Screen.width - 2)}┘`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
            } else { // Draw pages without borders
                if (this.options.showTitle) {
                    this.CM.Screen.write({ text: `${trimmedTitle[0]}`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } })
                }
                this.page1.getContent().forEach((line: StyledElement[]) => {
                    this.drawLine(line, undefined, 0)
                })
                if (this.options.showTitle) {
                    this.CM.Screen.write({ text: `${trimmedTitle[1]}`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
                }
                this.page2.getContent().forEach((line: StyledElement[]) => {
                    this.drawLine(line, undefined, 1)
                })
            }
        } else { // Draw horizontally  
            this.realWidth = [Math.round(this.CM.Screen.width * this.proportions[0]), Math.round(this.CM.Screen.width * this.proportions[1])]
            const trimmedTitle = [this.CM.truncate(this.page1Title, this.realWidth[0] - 4, false), this.CM.truncate(this.page2Title, this.realWidth[1] - 3, false)]
            const maxPageHeight = Math.max(this.page1.getViewedPageHeight(), this.page2.getViewedPageHeight())
            const p1 = this.page1.getContent()
            const p2 = this.page2.getContent()
            if (this.options.boxed) { // Draw pages with borders
                if (this.options.showTitle) {
                    this.CM.Screen.write({ text: `┌─${trimmedTitle[0]}${"─".repeat(this.realWidth[0] - trimmedTitle[0].length - 3)}┬`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } }, { text: `─${trimmedTitle[1]}${"─".repeat(this.realWidth[1] - trimmedTitle[1].length - 2)}┐`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
                } else {
                    this.CM.Screen.write({ text: `┌─${"─".repeat(this.realWidth[0] - 3)}┬`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } }, { text: `─${"─".repeat(this.realWidth[1] - 2)}┐`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
                }
                for (let i = 0; i < maxPageHeight; i++) {
                    this.drawLine(p1[i] || [{ text: "", style: { color: "" } }], p2[i] || [{ text: "", style: { color: "" } }])
                }
                // Draw the bottom border
                this.CM.Screen.write({ text: `└${"─".repeat(this.realWidth[0] - 2)}┴`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } }, { text: `${"─".repeat(this.realWidth[1] - 1)}┘`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
            } else { // Draw pages without borders
                if (this.options.showTitle) {
                    this.CM.Screen.write({ text: `${trimmedTitle[0]}${" ".repeat(this.realWidth[0] - trimmedTitle[0].length)}${trimmedTitle[1]}`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } })
                }
                for (let i = 0; i < maxPageHeight; i++) {
                    this.drawLine(p1[i] || [{ text: "", style: { color: "" } }], p2[i] || [{ text: "", style: { color: "" } }])
                }
            }
        }
    }
}

export default DoubleLayout