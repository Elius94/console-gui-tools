import { EventEmitter } from "events";
import readline from "readline";
import DoubleLayout from "./components/layout/DoubleLayout.js";
import PageBuilder from "./components/PageBuilder.js";
import Screen from "./components/Screen.js";
import CustomPopup from "./components/widgets/CustomPopup.js";
import ButtonPopup from "./components/widgets/ButtonPopup.js";
import ConfirmPopup from "./components/widgets/ConfirmPopup.js";
import FileSelectorPopup from "./components/widgets/FileSelectorPopup.js";
import InputPopup from "./components/widgets/InputPopup.js";
import OptionPopup from "./components/widgets/OptionPopup.js";
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
    constructor(options = undefined) {
        super();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.widgetsCollection = [];
        this.eventListenersContainer = {};
        this.Terminal = process.stdout;
        this.Input = process.stdin;
        if (!ConsoleManager.instance) {
            ConsoleManager.instance = this;
            /** @const {Screen} Screen - The screen instance */
            this.Screen = new Screen(this.Terminal);
            this.Screen.on("error", (err) => {
                this.error(err);
            });
            this.widgetsCollection = [];
            this.eventListenersContainer = {};
            /** @const {number | 'popup'} logLocation - Choose where the logs are displayed: number (0,1) - to pot them on one of the two layouts, string ("popup") - to put them on a CustomPopup that can be displayed on the window. */
            this.logLocation = 1;
            this.logPageSize = 10;
            this.logPageTitle = "LOGS";
            /** @const {Array<PageBuilder>} homePage - The main application */
            this.pages = [new PageBuilder(), new PageBuilder()];
            this.layoutOptions = {
                showTitle: true,
                boxed: true,
                boxColor: "cyan",
                boxStyle: "bold",
                changeFocusKey: "ctrl+l",
                direction: "horizontal",
            };
            /** @const {string} changeLayoutKey - The key or combination to switch the selected page */
            this.changeLayoutKey = this.layoutOptions.changeFocusKey;
            this.changeLayoutkeys = this.changeLayoutKey.split("+");
            this.applicationTitle = "";
            if (options) {
                if (options.logLocation !== undefined) {
                    if (typeof options.logLocation === "number") {
                        this.logLocation = options.logLocation > 0 ? options.logLocation : 0;
                    }
                    else {
                        if (options.logLocation === "popup") {
                            this.logLocation = "popup";
                            this.showLogKey = options.showLogKey || "o";
                        }
                        else {
                            this.logLocation = 1;
                        }
                    }
                }
                if (options.logPageSize) {
                    this.logPageSize = options.logPageSize;
                }
                if (typeof options.layoutOptions !== "undefined") {
                    this.layoutOptions = options.layoutOptions;
                    if (options.layoutOptions.changeFocusKey) {
                        this.changeLayoutKey = options.layoutOptions.changeFocusKey;
                    }
                }
                if (options.title) {
                    this.applicationTitle = options.title;
                }
            }
            /** @const {PageBuilder} stdOut - The logs page */
            this.stdOut = new PageBuilder();
            this.stdOut.setRowsPerPage(this.logPageSize);
            /** @const {DoubleLayout} layout - The layout instance */
            if (this.logLocation === "popup") {
                this.layout = new DoubleLayout(this.pages[0], this.pages[1], this.layoutOptions);
            }
            else if (typeof this.logLocation === "number") {
                if (this.logLocation === 0) {
                    this.layout = new DoubleLayout(this.stdOut, this.pages[0], this.layoutOptions);
                    this.layout.page1Title = this.logPageTitle;
                    this.layout.page2Title = this.applicationTitle;
                }
                else {
                    this.layout = new DoubleLayout(this.pages[0], this.stdOut, this.layoutOptions);
                    this.layout.page1Title = this.applicationTitle;
                    this.layout.page2Title = this.logPageTitle;
                }
            }
            else {
                this.layout = new DoubleLayout(this.pages[0], this.stdOut, this.layoutOptions);
                this.layout.page1Title = this.applicationTitle;
                this.layout.page2Title = this.logPageTitle;
            }
            this.addGenericListeners();
            // I use readline to manage the keypress event
            readline.emitKeypressEvents(this.Input);
            this.Input.setRawMode(true); // With this I only get the key value
        }
        return ConsoleManager.instance;
    }
    getLogPageSize() {
        return this.logPageSize;
    }
    setLogPageSize(rows) {
        this.logPageSize = rows;
    }
    /**
     * @description This function is used to make the ConsoleManager handle the key events when no widgets are showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @memberof ConsoleManager
     */
    addGenericListeners() {
        this.Input.addListener("keypress", (_str, key) => {
            let change = false;
            if (this.changeLayoutkeys.length > 1) {
                if (this.changeLayoutkeys[0] == "ctrl") {
                    if (key.ctrl && key.name === this.changeLayoutkeys[1])
                        change = true;
                }
                if (this.changeLayoutkeys[0] == "meta") {
                    if (key.alt && key.name === this.changeLayoutkeys[1])
                        change = true;
                }
                if (this.changeLayoutkeys[0] == "shift") {
                    if (key.shift && key.name === this.changeLayoutkeys[1])
                        change = true;
                }
            }
            else {
                if (key.name === this.changeLayoutkeys[0])
                    change = true;
            }
            if (this.showLogKey && key.name === this.showLogKey) {
                this.showLogPopup();
            }
            if (change) {
                this.layout.changeLayout();
                this.refresh();
                return;
            }
            if (key.ctrl && key.name === "c") {
                this.emit("exit");
            }
            else {
                if (Object.keys(this.widgetsCollection).length === 0) {
                    if (key.name === "down") {
                        if (this.layout.getSelected() === 0) {
                            this.layout.page1.decreaseScrollIndex();
                        }
                        else {
                            this.layout.page2.decreaseScrollIndex();
                        }
                        this.refresh();
                        return;
                    }
                    else if (key.name === "up") {
                        if (this.layout.getSelected() === 0) {
                            this.layout.page1.increaseScrollIndex();
                        }
                        else {
                            this.layout.page2.increaseScrollIndex();
                        }
                        this.refresh();
                        return;
                    }
                    this.emit("keypressed", key);
                }
            }
        });
    }
    /**
     * @description This function is used to set a key listener for a specific widget. The event listener is stored in the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @param {function} manageFunction - The function to call when the key is pressed.
     * @memberof ConsoleManager
     * @example CM.setKeyListener('inputPopup', popup.keyListener)
     */
    setKeyListener(id, manageFunction) {
        this.eventListenersContainer[id] = manageFunction;
        this.Input.addListener("keypress", this.eventListenersContainer[id]);
    }
    /**
     * @description This function is used to remove a key listener for a specific widget. The event listener is removed from the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     * @example CM.removeKeyListener('inputPopup')
     */
    removeKeyListener(id) {
        this.Input.removeListener("keypress", this.eventListenersContainer[id]);
        delete this.eventListenersContainer[id];
    }
    /**
     * @description This function is used to register a widget. The widget is stored in the widgetsCollection object. That is called by the widgets in show().
     * @param {Widget} widget - The widget to register.
     * @memberof ConsoleManager
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerWiget(widget) {
        this.widgetsCollection[widget.id] = widget;
    }
    /**
     * @description This function is used to unregister a widget. The widget is removed from the widgetsCollection object. That is called by the widgets in hide().
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unRegisterWidget(widget) {
        if (this.widgetsCollection[widget.id]) {
            delete this.widgetsCollection[widget.id];
        }
    }
    /**
     * @description This function is used to set the home page. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @memberof ConsoleManager
     * @example CM.setHomePage(p)
     * @deprecated since version 1.1.12 - Use setPage or setPages instead
     */
    setHomePage(page) {
        this.pages[0] = page;
        if (this.logLocation === "popup") {
            this.layout.setPage1(page);
        }
        else if (typeof this.logLocation === "number") {
            if (this.logLocation === 0) {
                this.layout.setPage2(page);
            }
            else {
                this.layout.setPage1(page);
            }
        }
        else {
            this.layout.setPage1(page);
        }
        this.refresh();
    }
    /**
     * @description This function is used to set a page of layout. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @param {number} [pageNumber] - The page number to set. 0 is the first page, 1 is the second page.
     * @param {string} [title] - The title of the page to overwrite the default title. Default is null.
     * @memberof ConsoleManager
     * @example CM.setPage(p, 0)
     */
    setPage(page, pageNumber = 0, title = null) {
        this.pages[pageNumber] = page;
        if (this.logLocation === "popup") {
            if (pageNumber === 0) {
                this.layout.setPage1(this.pages[pageNumber]);
                if (title)
                    this.layout.page1Title = title;
            }
            else {
                this.layout.setPage2(this.pages[pageNumber]);
                if (title)
                    this.layout.page2Title = title;
            }
        }
        else if (typeof this.logLocation === "number") {
            if (this.logLocation === 0) {
                this.layout.setPage2(this.pages[pageNumber]);
                if (title)
                    this.layout.page2Title = title;
            }
            else {
                this.layout.setPage1(this.pages[pageNumber]);
                if (title)
                    this.layout.page1Title = title;
            }
        }
        else {
            if (pageNumber === 0) {
                this.layout.setPage1(this.pages[pageNumber]);
                if (title)
                    this.layout.page1Title = title;
            }
            else {
                this.layout.setPage2(this.pages[pageNumber]);
                if (title)
                    this.layout.page2Title = title;
            }
        }
        this.refresh();
    }
    /**
     * @description This function is used to set both pages of layout. It also refresh the screen.
     * @param {Array<PageBuilder>} pages - The page to set as home page.
     * @memberof ConsoleManager
     * @example CM.setPages([p1, p2], 0)
     */
    setPages(pages) {
        this.pages = pages;
        if (this.logLocation === "popup") {
            this.layout.setPage1(this.pages[0]);
            this.layout.setPage2(this.pages[1]);
        }
        else if (typeof this.logLocation === "number") {
            if (this.logLocation === 0) {
                this.layout.setPage2(this.pages[0]);
            }
            else {
                this.layout.setPage1(this.pages[0]);
            }
        }
        else {
            this.layout.setPage1(this.pages[0]);
            this.layout.setPage2(this.pages[1]);
        }
        this.refresh();
    }
    /**
     * @description This function is used to refresh the screen. It do the following sequence: Clear the screen, draw layout, draw widgets and finally print the screen to the stdOut.
     * @memberof ConsoleManager
     * @example CM.refresh()
     */
    refresh() {
        this.Screen.update();
        this.layout.draw();
        for (const widget in this.widgetsCollection) {
            if (this.widgetsCollection[widget].isVisible())
                this.widgetsCollection[widget].draw();
        }
        this.Screen.print();
    }
    /**
     * @description This function is used to show a popup containing all the stdOut of the console.
     * @memberof ConsoleManager
     * @returns the instance of the generated popup.
     * @example CM.showLogPopup()
     */
    showLogPopup() {
        return new CustomPopup("logPopup", "Application Logs", this.stdOut, this.Screen.width - 12).show();
    }
    /**
     * @description This function is used to log a message. It is used to log messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.log("Hello world")
     */
    log(message) {
        this.stdOut.addRow({ text: message, color: "white" });
        this.updateLogsConsole(true);
    }
    /**
     * @description This function is used to log an error message. It is used to log red messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.error("Anomaly detected")
     */
    error(message) {
        this.stdOut.addRow({ text: message, color: "red" });
        this.updateLogsConsole(true);
    }
    /**
     * @description This function is used to log a warning message. It is used to log yellow messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.warn("Anomaly detected")
     */
    warn(message) {
        this.stdOut.addRow({ text: message, color: "yellow" });
        this.updateLogsConsole(true);
    }
    /**
     * @description This function is used to log an info message. It is used to log blue messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.info("Anomaly detected")
     */
    info(message) {
        this.stdOut.addRow({ text: message, color: "blue" });
        this.updateLogsConsole(true);
    }
    /**
     * @description This function is used to update the logs console. It is called by the log functions.
     * @param {boolean} resetCursor - If true, the log scroll index is resetted.
     * @memberof ConsoleManager
     */
    updateLogsConsole(resetCursor) {
        if (resetCursor) {
            this.stdOut.setScrollIndex(0);
        }
        this.refresh();
    }
    // TODO: move to utils
    /**
     * @description This function is used to truncate a string adding ... at the end.
     * @param {string} str - The string to truncate.
     * @param {number} n - The number of characters to keep.
     * @param {boolean} useWordBoundary - If true, the truncation will be done at the end of the word.
     * @memberof ConsoleManager
     * @example CM.truncate("Hello world", 5, true) // "Hello..."
     */
    truncate(str, n, useWordBoundary) {
        if (str.length <= n) {
            return str;
        }
        const subString = str.substring(0, n - 1); // the original check
        return (useWordBoundary ?
            subString.substring(0, subString.lastIndexOf(" ")) :
            subString) + "…";
    }
}
export { PageBuilder, ConsoleManager, OptionPopup, InputPopup, ConfirmPopup, ButtonPopup, CustomPopup, FileSelectorPopup };
//# sourceMappingURL=ConsoleGui.js.map