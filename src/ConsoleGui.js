import { EventEmitter } from "events"
import readline from 'readline';
import { PageBuilder, Screen } from './components/index.js';
import { DoubleLayout } from "./components/layout/index.js";
import { InputPopup, OptionPopup, ButtonPopup, ConfirmPopup, CustomPopup, FileManagerPopup } from "./components/widgets/index.js";

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
            ConsoleManager.instance = this;

            /** @const {Screen} Screen - The screen instance */
            this.Screen = new Screen(this.Terminal);
            this.Screen.on("error", (err) => {
                this.error(err)
            })

            this.widgetsCollection = [];
            this.eventListenersContainer = {};

            /** @const {PageBuilder} stdOut - The logs page */
            this.stdOut = new PageBuilder();

            /** @const {PageBuilder} homePage - The main application */
            this.homePage = new PageBuilder()

            this.layoutBorder = true;

            /** @const {string} changeLayoutKey - The key or combination to switch the selected page */
            this.changeLayoutKey = "ctrl+l";
            this.applicationTitle = "";
            this.changeLayoutkeys = this.changeLayoutKey.split('+');
            this.logPageSize = 10;

            if (options) {
                if (options.logPageSize) {
                    this.logPageSize = options.logPageSize;
                }
                if (options.layoutBorder) {
                    this.layoutBorder = options.layoutBorder;
                }
                if (options.changeLayoutKey) {
                    this.changeLayoutKey = options.changeLayoutKey;
                }
                if (options.title) {
                    this.applicationTitle = options.title;
                }
            }

            /** @const {DoubleLayout} layout - The layout instance */
            this.layout = new DoubleLayout(this.homePage, this.stdOut, this.layoutBorder, 0);
            this.layout.page2.setRowsPerPage(this.logPageSize);
            this.addGenericListeners();

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

    /**
     * @description This function is used to set a key listener for a specific widget. The event listener is stored in the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @param {function} manageFunction - The function to call when the key is pressed.
     * @memberof ConsoleManager
     * @example CM.setKeyListener('inputPopup', popup.keyListener)
     */
    setKeyListener(id, manageFunction) {
        this.eventListenersContainer[id] = manageFunction
        this.Input.addListener('keypress', this.eventListenersContainer[id])
    }

    /**
     * @description This function is used to remove a key listener for a specific widget. The event listener is removed from the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     * @example CM.removeKeyListener('inputPopup')
     */
    removeKeyListener(id) {
        this.Input.removeListener('keypress', this.eventListenersContainer[id])
        delete this.eventListenersContainer[id]
    }

    /**
     * @description This function is used to register a widget. The widget is stored in the widgetsCollection object. That is called by the widgets in show().
     * @param {Widget} widget - The widget to register.
     * @memberof ConsoleManager
     */
    registerWiget(widget) {
        this.widgetsCollection[widget.id] = widget
    }

    /**
     * @description This function is used to unregister a widget. The widget is removed from the widgetsCollection object. That is called by the widgets in hide().
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     */
    unRegisterWidget(widget) {
        if (this.widgetsCollection[widget.id]) {
            delete this.widgetsCollection[widget.id]
        }
    }

    /**
     * @description This function is used to set the home page. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @memberof ConsoleManager
     * @example CM.setHomePage(p)
     */
    setHomePage(page) {
        this.homePage = page
        this.layout.setPage1(this.homePage)
        this.refresh()
    }

    /**
     * @description This function is used to refresh the screen. It do the following sequence: Clear the screen, draw layout, draw widgets and finally print the screen to the stdOut.
     * @memberof ConsoleManager
     * @example CM.refresh()
     */
    refresh() {
        this.Screen.update()
        this.layout.draw()
        for (let widget in this.widgetsCollection) {
            if (this.widgetsCollection[widget].isVisible())
                this.widgetsCollection[widget].draw()
        }
        this.Screen.print()
    }

    /**
     * @description This function is used to log a message. It is used to log messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.log("Hello world")
     */
    log(message) {
        this.stdOut.addRow({ text: message, color: 'white' })
        this.updateLogsConsole(true)
    }

    /** 
     * @description This function is used to log an error message. It is used to log red messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.error("Anomaly detected")
     */
    error(message) {
        this.stdOut.addRow({ text: message, color: 'red' })
        this.updateLogsConsole(true)
    }

    /**
     * @description This function is used to log a warning message. It is used to log yellow messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.warn("Anomaly detected")
     */
    warn(message) {
        this.stdOut.addRow({ text: message, color: 'yellow' })
        this.updateLogsConsole(true)
    }

    /**
     * @description This function is used to log an info message. It is used to log blue messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.info("Anomaly detected")
     */
    info(message) {
        this.stdOut.addRow({ text: message, color: 'blue' })
        this.updateLogsConsole(true)
    }

    /**
     * @description This function is used to update the logs console. It is called by the log functions.
     * @param {boolean} reset - If true, the log scroll index is resetted.
     * @memberof ConsoleManager
     */
    updateLogsConsole(resetCursor) {
        if (resetCursor) {
            this.layout.page2.setScrollIndex(0)
        }
        this.refresh()
    }

    // TODO: move to utils.js
    /**
     * @description This function is used to truncate a string adding ... at the end.
     * @param {string} str - The string to truncate.
     * @param {number} n - The number of characters to keep.
     * @param {boolean} useWordBoundary - If true, the truncation will be done at the end of the word.
     * @memberof ConsoleManager
     * @example CM.truncate("Hello world", 5, true) // "Hello..."
     */
    truncate(str, n, useWordBoundary) {
        if (str.length <= n) { return str; }
        const subString = str.substring(0, n - 1); // the original check
        return (useWordBoundary ?
            subString.substring(0, subString.lastIndexOf(" ")) :
            subString) + "…";
    }
}

export {
    PageBuilder,
    ConsoleManager,
    OptionPopup,
    InputPopup,
    ConfirmPopup,
    ButtonPopup,
    CustomPopup,
    FileManagerPopup
}