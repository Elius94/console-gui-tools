/// <reference types="node" />
import { EventEmitter } from "events";
import { ConsoleManager, KeyListenerArgs } from "../../ConsoleGui.js";
/**
 * @description The file descriptions for the file selector popup.
 * @typedef {Object} FileItemObject
 * @property {string} name - The name of the file.
 * @property {string} path - The path to the file.
 * @property {"dir" | "file"} type - The type of the file.
 * @property {string} text - The display text of the file.
 *
 * @interface FileItemObject
 */
interface FileItemObject {
    text: string;
    name: string;
    type: "dir" | "file";
    path: string;
}
/**
 * @class FileSelectorPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a file input to select a file or a directory.
 * It will run a promise with fs.readdir to get the list of files and directories.
 * The user can select a file or a directory and the popup will be closed.
 *
 * ![FileSelectorPopup](https://user-images.githubusercontent.com/14907987/165938464-c1426102-b598-42bb-8597-6337f0bcb009.gif)
 *
 * Emits the following events:
 * - "confirm" when the user confirm the file or directory selection. The file or directory path is passed as parameter like this: {path: "path/to/file", name: "file.ext"}
 * - "cancel" when the user cancel the file or directory selection.
 * - "exit" when the user exit
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {string} basePath - The main path of the popup.
re case sensitive.
 * @param {boolean} [limitToPath=false] - If true, the user can select a directory. Otherwise, only files are selectable. When true, to enter a directory, the user must press the space key instead of the enter key.
 * @param {Array<string>} [allowedExtensions=[]] - The allowed extensions. If not set, all extensions are allowed. The extensions a can only select files in the path. If false, the user can select files in the path and parent directories.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 *
 * @example const popup = new FileSelectorPopup("popup1", "Choose the file", "./examples").show().on("confirm", (selected) => { console.log(selected) }) // show the popup and wait for the user to confirm
 */
export declare class FileSelectorPopup extends EventEmitter {
    CM: ConsoleManager;
    id: string;
    title: string;
    basePath: string;
    currentPath: string;
    selectDirectory: boolean;
    allowedExtensions: string[];
    limitToPath: boolean;
    visible: boolean;
    marginTop: number;
    startIndex: number;
    selected: FileItemObject;
    options: FileItemObject[];
    constructor(id: string, title: string, basePath: string, selectDirectory?: boolean, allowedExtensions?: never[], limitToPath?: boolean, visible?: boolean);
    /**
     * @description This function is used to load the list of files and directories in the current path.
    it return a promise with the list of files and directories. The list is an array of objects like this:
    [{text: "📄 file.ext", name: "file.ext", type: "file", path: "path/to/file.ext"}, {text: "📁 dir/", name: "dir", type: "dir", path: "path/to/dir"}]
     * @param {string} dir - The path to load the list.
     * @returns {Promise<Array<object>>} The list of files and directories.
     * @memberof FileSelectorPopup
     */
    private listDir;
    /**
     * @description This function calls the updateList function and store the result to this.options, it also refresh the list of files and directories.
     * @param {string} _path - The path to load the list.
     * @memberof FileSelectorPopup
     */
    private updateList;
    private adaptOptions;
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof FileSelectorPopup
     */
    keyListner(_str: string, key: KeyListenerArgs): void;
    /**
     * @description This function is used to get the selected option.
     * @returns {FileItemObject} The selected value of the popup.
     * @memberof FileSelectorPopup
     */
    getSelected(): FileItemObject;
    /**
     * @description This function is used to change the selection of the popup. It also refresh the ConsoleManager.
     * @param {FileItemObject} selected - The new value of the selection.
     * @memberof FileSelectorPopup
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     */
    private setSelected;
    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    show(): FileSelectorPopup;
    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    hide(): FileSelectorPopup;
    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof FileSelectorPopup
     */
    isVisible(): boolean;
    /**
     * @description This function is used to add the FileSelectorPopup key listener callback to te ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    private manageInput;
    /**
     * @description This function is used to remove the FileSelectorPopup key listener callback to te ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    private unManageInput;
    /**
     * @description This function is used to draw the FileSelectorPopup to the screen in the middle.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    draw(): FileSelectorPopup;
}
export default FileSelectorPopup;
