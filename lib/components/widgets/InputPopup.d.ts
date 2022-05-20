/// <reference types="node" />
import { EventEmitter } from "events";
import { ConsoleManager, KeyListenerArgs } from "../../ConsoleGui.js";
/**
 * @class InputPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a text or numeric input.
 *
 * ![InputPopup](https://user-images.githubusercontent.com/14907987/165752281-e836b862-a54a-48d5-b4e7-954374d6509f.gif)
 *
 * Emits the following events:
 * - "confirm" when the user confirm the input
 * - "cancel" when the user cancel the input
 * - "exit" when the user exit the input
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {string | number} value - The value of the input.
 * @param {boolean} numeric - If the input is numeric.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 *
 * @example const popup = new InputPopup("popup1", "Choose the number", selectedNumber, true).show().on("confirm", (value) => { console.log(value) }) // show the popup and wait for the user to confirm
 */
export declare class InputPopup extends EventEmitter {
    CM: ConsoleManager;
    id: string;
    title: string;
    value: string | number;
    numeric: boolean;
    visible: boolean;
    marginTop: number;
    constructor(id: string, title: string, value: string | number, numeric: boolean, visible?: boolean);
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the input is numeric and it is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof InputPopup
     */
    keyListnerNumeric(_str: string, key: KeyListenerArgs): void;
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof InputPopup
     */
    keyListnerText(_str: string, key: KeyListenerArgs): void;
    /**
     * @description This function is used to get the value of the input.
     * @returns {string | number} The value of the input.
     * @memberof InputPopup
     */
    getValue(): string | number;
    /**
     * @description This function is used to change the value of the input. It also refresh the ConsoleManager.
     * @param {string | number} newValue - The new value of the input.
     * @memberof InputPopup
     * @returns {InputPopup} The instance of the InputPopup.
     */
    setValue(newValue: string | number): this;
    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    show(): InputPopup;
    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    hide(): InputPopup;
    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof InputPopup
     */
    isVisible(): boolean;
    /**
     * @description This function is used to add the InputPopup key listener callback to te ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    private manageInput;
    /**
     * @description This function is used to remove the InputPopup key listener callback to te ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    private unManageInput;
    /**
     * @description This function is used to draw the InputPopup to the screen in the middle.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    draw(): InputPopup;
}
export default InputPopup;
