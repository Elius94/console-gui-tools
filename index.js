import { EventEmitter } from "events"
import readline from 'readline';
import { PageBuilder, Screen } from './Components/index.js';
import { DoubleLayout } from "./components/Layout/index.js";
import { InputPopup, OptionPopup } from "./components/Widgets/index.js";

/**
 * @class ConsoleManager
 * @extends EventEmitter
 * @description This class is used to manage the console GUI and all the widgets.
 * This is a singleton class, so you can use it like this: const CM = new ConsoleManager()
 * Emits the following events: 
 * - "keypressed" to propagate the key pressed event to the application
 * - "exit" when the user wants to exit the application
 * @param {object} options - The options of the ConsoleManager.
 * @example const CM = new ConsoleManager({ logPageSize: 10, layoutBorder: true, changeLayoutKey: 'ctrl+l', title: 'Console Application' })
 */
class ConsoleManager extends EventEmitter {
    constructor(options) {
        super()
        this.Terminal = process.stdout;
        this.Input = process.stdin;
        if (!ConsoleManager.instance) {
            ConsoleManager.instance = this
                /** @const {Screen} Screen - The screen instance */
            this.Screen = new Screen(this.Terminal)
            this.widgetsCollection = []
            this.eventListenersContainer = {}
                /** @const {PageBuilder} stdOut - The logs page */
            this.stdOut = new PageBuilder()
                /** @const {PageBuilder} homePage - The main application */
            this.homePage = new PageBuilder()
            this.layoutBorder = true

            /** @const {string} changeLayoutKey - The key or combination to switch the selected page */
            this.changeLayoutKey = "ctrl+l"
            this.applicationTitle = ""
            this.changeLayoutkeys = this.changeLayoutKey.split('+')
            this.logPageSize = 10

            if (options) {
                if (options.logPageSize) {
                    this.logPageSize = options.logPageSize
                }
                if (options.layoutBorder) {
                    this.layoutBorder = options.layoutBorder
                }
                if (options.changeLayoutKey) {
                    this.changeLayoutKey = options.changeLayoutKey
                }
                if (options.title) {
                    this.applicationTitle = options.title
                }
            }

            /** @const {DoubleLayout} layout - The layout instance */
            this.layout = new DoubleLayout(this.homePage, this.stdOut, this.layoutBorder, 0)
            this.layout.page2.setRowsPerPage(this.logPageSize)
            this.addGenericListeners()

            // I use readline to manage the keypress event
            readline.emitKeypressEvents(this.Input);
            this.Input.setRawMode(true); // With this I only get the key value
        }
        return ConsoleManager.instance
    }

    getLogPageSize() {
        return this.logPageSize
    }

    setLogPageSize(rows) {
        this.logPageSize = rows
    }

    /**
     * @function addGenericListeners()
     * @description This function is used to make the ConsoleManager handle the key events when no widgets are showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @memberof ConsoleManager
     */
    addGenericListeners() {
        this.Input.addListener('keypress', (str, key) => {
            let change = false
            if (this.changeLayoutkeys.length > 1) {
                if (this.changeLayoutkeys[0] == 'ctrl') {
                    if (key.ctrl && key.name === this.changeLayoutkeys[1])
                        change = true
                }
                if (this.changeLayoutkeys[0] == 'meta') {
                    if (key.alt && key.name === this.changeLayoutkeys[1])
                        change = true
                }
                if (this.changeLayoutkeys[0] == 'shift') {
                    if (key.shift && key.name === this.changeLayoutkeys[1])
                        change = true
                }
            } else {
                if (key.name === this.changeLayoutkeys[0])
                    change = true
            }

            if (change) {
                this.layout.changeLayout()
                this.refresh()
                return
            }

            if (key.ctrl && key.name === 'c') {
                this.emit('exit')
            } else {
                if (Object.keys(this.widgetsCollection).length === 0) {
                    if (this.layout.getSelected() === 1) {
                        if (key.name === 'down') {
                            this.layout.page2.decreaseScrollIndex()
                            this.refresh()
                            return
                        } else if (key.name === 'up') {
                            this.layout.page2.increaseScrollIndex()
                            this.refresh()
                            return
                        }
                    }
                    this.emit("keypressed", key)
                }
            }
        })
    }

    setKeyListener(id, manageFunction) {
        this.eventListenersContainer[id] = manageFunction
        this.Input.addListener('keypress', this.eventListenersContainer[id])
    }

    removeKeyListener(id) {
        this.Input.removeListener('keypress', this.eventListenersContainer[id])
        delete this.eventListenersContainer[id]
    }

    registerWiget(widget) {
        this.widgetsCollection[widget.id] = widget
    }

    unRegisterWidget(widget) {
        if (this.widgetsCollection[widget.id]) {
            delete this.widgetsCollection[widget.id]
        }
    }

    setHomePage(page) {
        this.homePage = page
        this.layout.setPage1(this.homePage)
        this.refresh()
    }

    // Draw the console on the screen
    refresh() {
        this.Screen.update()
        this.layout.draw()
        for (let widget in this.widgetsCollection) {
            if (this.widgetsCollection[widget].isVisible())
                this.widgetsCollection[widget].draw()
        }
        this.Screen.print()
    }

    // Add Log Functions to the console
    log(message) {
        this.stdOut.addRow({ text: message, color: 'white' })
        this.updateLogsConsole(true)
    }

    error(message) {
        this.stdOut.addRow({ text: message, color: 'red' })
        this.updateLogsConsole(true)
    }

    warn(message) {
        this.stdOut.addRow({ text: message, color: 'yellow' })
        this.updateLogsConsole(true)
    }

    info(message) {
        this.stdOut.addRow({ text: message, color: 'blue' })
        this.updateLogsConsole(true)
    }

    updateLogsConsole(resetCursor) {
        if (resetCursor) {
            this.layout.page2.setScrollIndex(0)
        }
        this.refresh()
    }

    truncate(str, n, useWordBoundary) {
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n - 1); // the original check
        return (useWordBoundary ?
            subString.substr(0, subString.lastIndexOf(" ")) :
            subString) + "…";
    }
}

export {
    PageBuilder,
    ConsoleManager,
    OptionPopup,
    InputPopup
}