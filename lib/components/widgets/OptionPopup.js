import { EventEmitter } from "events";
import { ConsoleManager } from "../../ConsoleGui.js";
/**
 * @class OptionPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a list of selectable options.
 *
 * ![OptionPopup](https://user-images.githubusercontent.com/14907987/165752387-2eac4936-1b5d-462e-9353-562d04f1b4fe.gif)
 *
 * Emits the following events:
 * - "confirm" when the user confirm the option
 * - "cancel" when the user cancel the option
 * - "exit" when the user exit the option
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {Array<string | number>} options - The options of the popup.
 * @param {string | number} selected - The selected option.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 *
 * @example const popup = new OptionPopup("popup1", "Choose the option", options, selectedOption).show().on("confirm", (option) => { console.log(option) }) // show the popup and wait for the user to confirm
 */
export class OptionPopup extends EventEmitter {
    constructor(id, title, options, selected, visible = false) {
        super();
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager();
        this.id = id;
        this.title = title;
        this.options = options;
        this.selected = selected;
        this.visible = visible;
        this.marginTop = 4;
        this.startIndex = 0;
        if (this.CM.widgetsCollection[this.id]) {
            this.CM.unRegisterWidget(this);
            const message = `OptionPopup ${this.id} already exists.`;
            this.CM.error(message);
            throw new Error(message);
        }
        this.CM.registerWiget(this);
    }
    adaptOptions() {
        return this.options.slice(this.startIndex, this.startIndex + this.CM.Screen.height - this.marginTop - 6);
    }
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof OptionPopup
     */
    keyListner(_str, key) {
        switch (key.name) {
            case "down":
                this.setSelected(this.options[(this.options.indexOf(this.selected) + 1) % this.options.length]);
                if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                    if (this.selected === this.options[this.adaptOptions().length + this.startIndex]) {
                        this.startIndex++;
                    }
                }
                else {
                    this.startIndex = 0;
                }
                break;
            case "up":
                this.setSelected(this.options[(this.options.indexOf(this.selected) - 1 + this.options.length) % this.options.length]);
                if (this.startIndex > 0 && this.selected === this.adaptOptions()[0]) {
                    this.startIndex--;
                }
                break;
            case "pagedown":
                if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                    this.setSelected(this.options[(this.options.indexOf(this.selected) + this.adaptOptions().length) % this.options.length]);
                    if (this.startIndex + this.adaptOptions().length < this.options.length) {
                        this.startIndex += this.adaptOptions().length;
                    }
                    else {
                        this.startIndex = 0;
                    }
                }
                else {
                    return;
                }
                break;
            case "pageup":
                if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                    this.setSelected(this.options[(this.options.indexOf(this.selected) - this.adaptOptions().length + this.options.length) % this.options.length]);
                    if (this.startIndex > this.adaptOptions().length) {
                        this.startIndex -= this.adaptOptions().length;
                    }
                    else {
                        this.startIndex = 0;
                    }
                }
                else {
                    return;
                }
                break;
            case "return":
                {
                    this.emit("confirm", this.selected);
                    this.CM.unRegisterWidget(this);
                    this.hide();
                    //delete this
                }
                break;
            case "escape":
                {
                    this.emit("cancel");
                    this.CM.unRegisterWidget(this);
                    this.hide();
                    //delete this
                }
                break;
            case "q":
                {
                    this.CM.emit("exit");
                    this.CM.unRegisterWidget(this);
                    this.hide();
                    //delete this
                }
                break;
            default:
                break;
        }
        this.CM.refresh();
    }
    /**
     * @description This function is used to get the selected option.
     * @returns {string | number} The selected value of the popup.
     * @memberof OptionPopup
     */
    getSelected() {
        return this.selected;
    }
    /**
     * @description This function is used to change the selection of the popup. It also refresh the ConsoleManager.
     * @param {string | number} selected - The new value of the selection.
     * @memberof OptionPopup
     * @returns {OptionPopup} The instance of the OptionPopup.
     */
    setSelected(selected) {
        this.selected = selected;
        this.CM.refresh();
        return this;
    }
    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    show() {
        if (!this.visible) {
            this.manageInput();
            this.visible = true;
            this.CM.refresh();
        }
        return this;
    }
    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    hide() {
        if (this.visible) {
            this.unManageInput();
            this.visible = false;
            this.CM.refresh();
        }
        return this;
    }
    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof OptionPopup
     */
    isVisible() {
        return this.visible;
    }
    /**
     * @description This function is used to add the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    manageInput() {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListner.bind(this));
        return this;
    }
    /**
     * @description This function is used to remove the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    unManageInput() {
        // Add a command input listener to change mode
        this.CM.removeKeyListener(this.id);
        return this;
    }
    /**
     * @description This function is used to draw the OptionPopup to the screen in the middle.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    draw() {
        // Change start index if selected is not in the adaptOptions return array
        if (this.adaptOptions().indexOf(this.selected) === -1) {
            this.startIndex = this.options.indexOf(this.selected) - this.adaptOptions().length + 1 > 0 ? this.options.indexOf(this.selected) - this.adaptOptions().length + 1 : 0;
        }
        const offset = 2;
        const maxOptionsLength = this.options.map((o) => o.toString()).reduce((max, option) => Math.max(max, option.length), 0);
        const windowWidth = maxOptionsLength > this.title.length ? maxOptionsLength + (2 * offset) : this.title.length + (2 * offset);
        const halfWidth = Math.round((windowWidth - this.title.length) / 2);
        let header = "┌";
        for (let i = 0; i < windowWidth; i++) {
            header += "─";
        }
        header += "┐\n";
        header += `│${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}│\n`;
        header += "├" + "─".repeat(windowWidth) + "┤\n";
        let footer = "└";
        for (let i = 0; i < windowWidth; i++) {
            footer += "─";
        }
        footer += "┘\n";
        let content = "";
        this.adaptOptions().forEach((option) => {
            content += `│${option === this.selected ? "<" : " "} ${option}${option === this.selected ? " >" : "  "}${" ".repeat(windowWidth - option.toString().length - 4)}│\n`;
        });
        const windowDesign = `${header}${content}${footer}`;
        windowDesign.split("\n").forEach((line, index) => {
            this.CM.Screen.cursorTo(Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)), this.marginTop + index);
            this.CM.Screen.write({ text: line, style: { color: "white" } });
        });
        return this;
    }
}
export default OptionPopup;
//# sourceMappingURL=OptionPopup.js.map