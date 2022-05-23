import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs } from "../../ConsoleGui.js"
import fs from "fs"
import path from "path"

/**
 * @description The file descriptions for the file selector popup.
 * @typedef {Object} FileItemObject
 * @prop {string} name - The name of the file.
 * @prop {string} path - The path to the file.
 * @prop {"dir" | "file"} type - The type of the file.
 * @prop {string} text - The display text of the file.
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
export class FileSelectorPopup extends EventEmitter {
    CM: ConsoleManager
    id: string
    title: string
    basePath: string
    currentPath: string
    selectDirectory: boolean
    allowedExtensions: string[]
    limitToPath: boolean
    visible: boolean
    marginTop: number
    startIndex: number
    selected: FileItemObject
    options: FileItemObject[]

    public constructor(id: string, title: string, basePath: string, selectDirectory = false, allowedExtensions = [], limitToPath = false, visible = false) {
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.basePath = basePath
        this.currentPath = basePath
        this.selectDirectory = selectDirectory
        this.allowedExtensions = allowedExtensions
        this.limitToPath = limitToPath
        this.visible = visible
        this.marginTop = 4
        this.startIndex = 0
        this.selected = { text: "../", name: "../", type: "dir", path: path.join(basePath, "../") }
        if (this.CM.widgetsCollection[this.id]) {
            this.CM.unRegisterWidget(this)
            const message = `FileSelectorPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerWiget(this)
        this.options = [{ text: "../", name: "../", type: "dir", path: path.join(basePath, "../") }]
        this.updateList(this.basePath)
    }

    /**
     * @description This function is used to load the list of files and directories in the current path.
    it return a promise with the list of files and directories. The list is an array of objects like this:
    [{text: "📄 file.ext", name: "file.ext", type: "file", path: "path/to/file.ext"}, {text: "📁 dir/", name: "dir", type: "dir", path: "path/to/dir"}]
     * @param {string} dir - The path to load the list.
     * @returns {Promise<Array<object>>} The list of files and directories.
     * @memberof FileSelectorPopup
     */
    private listDir(dir: string): Promise<Array<FileItemObject>> {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files.map(file => {
                        const filePath = path.join(dir, file)
                        const stats = fs.statSync(filePath)
                        const isDirectory = stats.isDirectory()
                        //const isFile = stats.isFile()
                        if (isDirectory) {
                            return { text: `📁 ${file}/`, name: file, type: "dir", path: filePath }
                        } else {
                            return { text: `📄 ${file}`, name: file, type: "file", path: filePath }
                        }
                    }).filter(file => {
                        const isAllowed = this.allowedExtensions.length === 0 || this.allowedExtensions.includes(path.extname(file.name))
                        if (this.selectDirectory && file.type === "file") {
                            return false
                        }
                        return isAllowed || file.type === "dir"
                    }) as Array<FileItemObject>)
                }
            })
        })
    }

    /**
     * @description This function calls the updateList function and store the result to this.options, it also refresh the list of files and directories.
     * @param {string} _path - The path to load the list.
     * @memberof FileSelectorPopup
     */
    private updateList(_path: string) {
        if (this.limitToPath) {
            if (!path.resolve(_path).includes(path.resolve(this.basePath))) {
                return
            }
        }
        this.currentPath = _path
        this.listDir(this.currentPath).then((files) => {
            this.options = [{ text: "../", name: "../", type: "dir", path: path.join(this.currentPath, "../")} as FileItemObject].concat(files)
            this.setSelected(this.options[0])
            this.CM.refresh()
        })
    }

    private adaptOptions() {
        return this.options.slice(this.startIndex, this.startIndex + this.CM.Screen.height - this.marginTop - 6)
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof FileSelectorPopup
     */
    public keyListner(_str: string, key: KeyListenerArgs) {
        const ind = this.options.indexOf(this.selected)
        switch (key.name) {
        case "down":
            this.setSelected(this.options[(ind + 1) % this.options.length])
            if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                if (this.selected === this.options[this.adaptOptions().length + this.startIndex]) {
                    this.startIndex++
                }
            } else {
                this.startIndex = 0
            }
            break
        case "up":
            this.setSelected(this.options[(ind - 1 + this.options.length) % this.options.length])
            if (this.startIndex > 0 && this.selected === this.adaptOptions()[0]) {
                this.startIndex--
            }
            break
        case "pagedown":
            if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                this.setSelected(this.options[(ind + this.adaptOptions().length) % this.options.length])
                if (this.startIndex + this.adaptOptions().length < this.options.length) {
                    this.startIndex += this.adaptOptions().length
                } else {
                    this.startIndex = 0
                }
            } else {
                return
            }
            break
        case "pageup":
            if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                this.setSelected(this.options[(ind - this.adaptOptions().length + this.options.length) % this.options.length])
                if (this.startIndex > this.adaptOptions().length) {
                    this.startIndex -= this.adaptOptions().length
                } else {
                    this.startIndex = 0
                }
            } else {
                return
            }
            break
        case "return":
            {
                if (this.selectDirectory) {
                    if (this.selected.type === "dir") {
                        this.emit("confirm", { path: this.selected.path, name: this.selected.name })
                        this.CM.unRegisterWidget(this)
                        this.hide()
                        //delete this
                    }
                } else {
                    if (this.selected.type === "dir") {
                        this.updateList(this.selected.path)
                    } else {
                        this.emit("confirm", { path: this.selected.path, name: this.selected.name })
                        this.CM.unRegisterWidget(this)
                        this.hide()
                        //delete this
                    }
                }
            }
            break
        case "space":
            if (this.selected.type === "dir") {
                this.updateList(this.selected.path)
            }
            break
        case "escape":
            {
                this.emit("cancel")
                this.CM.unRegisterWidget(this)
                this.hide()
                //delete this
            }
            break
        case "q":
            {
                this.CM.emit("exit")
                this.CM.unRegisterWidget(this)
                this.hide()
                //delete this
            }
            break
        default:
            break
        }
        this.CM.refresh()
    }

    /**
     * @description This function is used to get the selected option.
     * @returns {FileItemObject} The selected value of the popup.
     * @memberof FileSelectorPopup
     */
    public getSelected(): FileItemObject {
        return this.selected
    }

    /**
     * @description This function is used to change the selection of the popup. It also refresh the ConsoleManager.
     * @param {FileItemObject} selected - The new value of the selection.
     * @memberof FileSelectorPopup
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     */
    private setSelected(selected : FileItemObject): FileSelectorPopup {
        this.selected = selected
        this.CM.refresh()
        return this
    }

    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    public show(): FileSelectorPopup {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    public hide(): FileSelectorPopup {
        if (this.visible) {
            this.unManageInput()
            this.visible = false
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof FileSelectorPopup
     */
    public isVisible(): boolean {
        return this.visible
    }

    /**
     * @description This function is used to add the FileSelectorPopup key listener callback to te ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    private manageInput(): FileSelectorPopup {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListner.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the FileSelectorPopup key listener callback to te ConsoleManager.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    private unManageInput(): FileSelectorPopup {
        // Add a command input listener to change mode
        this.CM.removeKeyListener(this.id)
        return this
    }

    /**
     * @description This function is used to draw the FileSelectorPopup to the screen in the middle.
     * @returns {FileSelectorPopup} The instance of the FileSelectorPopup.
     * @memberof FileSelectorPopup
     */
    public draw(): FileSelectorPopup {
        // Change start index if selected is not in the adaptOptions return array
        const ind = this.adaptOptions().indexOf(this.selected)
        const ind1 = this.options.indexOf(this.selected)
        if (ind === -1) {
            this.startIndex = ind1 - this.adaptOptions().length + 1 > 0 ? ind1 - this.adaptOptions().length + 1 : 0
        }
        const offset = 2
        const maxOptionsLength = this.options.map((o) => o.text).reduce((max, option) => Math.max(max, option.length), 0)
        const windowWidth = maxOptionsLength > this.title.length ? maxOptionsLength + (2 * offset) : this.title.length + (2 * offset)
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)

        let header = "┌"
        for (let i = 0; i < windowWidth; i++) {
            header += "─"
        }
        header += "┐\n"
        header += `│${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}│\n`
        header += "├" + "─".repeat(windowWidth) + "┤\n"

        let footer = "└"
        for (let i = 0; i < windowWidth; i++) {
            footer += "─"
        }
        footer += "┘\n"

        let content = ""
        this.adaptOptions().forEach((option) => {
            content += `│${option.name === this.selected.name ? "<" : " "} ${option.text}${option.name === this.selected.name ? " >" : "  "}${" ".repeat(windowWidth - option.text.toString().length - 4)}│\n`
        })

        const windowDesign = `${header}${content}${footer}`
        windowDesign.split("\n").forEach((line, index) => {
            this.CM.Screen.cursorTo(Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)), this.marginTop + index)
            this.CM.Screen.write({ text: line, style: { color: "white" } })
        })
        return this
    }
}

export default FileSelectorPopup