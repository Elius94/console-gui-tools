import { ConsoleManager } from "../../ConsoleGui.js"

/**
 * @class DoubleLayout
 * @description This class is a layout that has two pages.
 * @param {PageBuilder} page1 The first page.
 * @param {PageBuilder} page2 The second page.
 * @param {boolean} border If the layout has a border.
 * @param {number} selected The selected page.
 * @example const layout = new DoubleLayout(page1, page2, true, 0)
 */
export class DoubleLayout {
    constructor(page1, page2, border = true, selected = 0) {
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()

        this.border = border
        this.selected = selected
        this.page1 = page1
        this.page2 = page2

        /** @const {string} page2Title The title of page2. */
        this.page2Title = "─LOGS"

        /** @const {string} applicationTitle The application title. */
        this.applicationTitle = this.CM.applicationTitle
    }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof DoubleLayout
     */
    setPage1(page) { this.page1 = page }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof DoubleLayout
     */
    setPage2(page) { this.page2 = page }

    /**
     * @description This function is used to enable or disable the layout border.
     * @param {boolean} border enable or disable the border
     * @memberof DoubleLayout
     */
    setBorder(border) { this.border = border }

    /**
     * @description This function is used to choose the page to be highlighted.
     * @param {number} selected 0 for page1, 1 for page2
     * @memberof DoubleLayout
     */
    setSelected(selected) { this.selected = selected }

    /**
     * @description This function is used to get the selected page.
     * @returns {number} 0 for page1, 1 for page2
     * @memberof DoubleLayout
     */
    getSelected() {
        return this.selected
    }

    /**
     * @description This function is used to get switch the selected page.
     * @returns {void}
     * @memberof DoubleLayout
     */
    changeLayout() {
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
    drawLine(line, index) {
        let unformattedLine = ""
        let newLine = [...line]
        line.forEach(element => {
            unformattedLine += element.text
        })
        if (unformattedLine.length > this.CM.Screen.width - 2) { // Need to truncate
            const offset = 2
            newLine = JSON.parse(JSON.stringify(line)) // Shallow copy because I don't want to modify the values but not the original
            let diff = unformattedLine.length - this.CM.Screen.width
                // remove truncated text
            for (let i = newLine.length - 1; i >= 0; i--) {
                if (newLine[i].text.length > diff + offset) {
                    newLine[i].text = this.CM.truncate(newLine[i].text, (newLine[i].text.length - diff) - offset, true)
                    break
                } else {
                    diff -= newLine[i].text.length
                    newLine.splice(i, 1)
                }
            }
            // Update unformatted line
            unformattedLine = ""
            newLine.forEach(element => {
                unformattedLine += element.text
            })
        }
        newLine.unshift({ text: "│", style: { color: this.selected === index ? "cyan" : "white" } })
        if (unformattedLine.length <= this.CM.Screen.width - 2) {
            newLine.push({ text: `${" ".repeat((this.CM.Screen.width - unformattedLine.length) - 2)}`, style: { color: "" } })
        }
        newLine.push({ text: "│", style: { color: this.selected === index ? "cyan" : "white" } })
        this.CM.Screen.write(...newLine)
    }

    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof DoubleLayout
     * @returns {void}
     * @example layout.draw()
     */
    draw() { //TODO: Trim also the application title
        if (this.border) { // Draw pages with borders
            this.CM.Screen.write(this.selected === 0 ? { text: `┌─${this.applicationTitle}${"─".repeat(this.CM.Screen.width - this.applicationTitle.length - 3)}┐`, style: { color: 'cyan' } } : { text: `┌─${this.applicationTitle}${"─".repeat(this.CM.Screen.width - this.applicationTitle.length - 3)}┐`, style: { color: 'white' } })
            this.page1.getContent().forEach(line => {
                this.drawLine(line, 0)
            })
            this.CM.Screen.write({ text: `├${this.page2Title}${"─".repeat(this.CM.Screen.width - this.page2Title.length - 2)}┤`, style: { color: 'cyan' } })
            this.page2.getContent().forEach(line => {
                this.drawLine(line, 1)
            })
            this.CM.Screen.write(this.selected === 1 ? { text: `└${"─".repeat(this.CM.Screen.width - 2)}┘`, style: { color: 'cyan' } } : { text: `└${"─".repeat(this.CM.Screen.width - 2)}┘`, style: { color: 'white' } })
        } else { // Draw pages without borders
            this.page1.getContent().forEach(line => {
                this.CM.Screen.write({ text: `${line}`, style: { color: 'white' } })
            })
            this.page2.getContent().forEach(line => {
                this.CM.Screen.write({ text: `${line}`, style: { color: 'white' } })
            })
        }
    }
}

export default DoubleLayout