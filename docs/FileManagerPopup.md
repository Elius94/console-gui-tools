## Classes

<dl>
<dt><a href="#FileManagerPopup">FileManagerPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

<a name="FileManagerPopup"></a>

## FileManagerPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [FileManagerPopup](#FileManagerPopup) ⇐ <code>EventEmitter</code>
    * [new FileManagerPopup(id, title, basePath, [limitToPath], [allowedExtensions], visible)](#new_FileManagerPopup_new)
    * [.listDir(path)](#FileManagerPopup+listDir) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.updateList(path)](#FileManagerPopup+updateList)
    * [.keyListner(str, key)](#FileManagerPopup+keyListner)
    * [.getSelected()](#FileManagerPopup+getSelected) ⇒ <code>string</code> \| <code>number</code>
    * [.setSelected(selected)](#FileManagerPopup+setSelected) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
    * [.show()](#FileManagerPopup+show) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
    * [.hide()](#FileManagerPopup+hide) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
    * [.isVisible()](#FileManagerPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#FileManagerPopup+manageInput) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
    * [.unManageInput()](#FileManagerPopup+unManageInput) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
    * [.draw()](#FileManagerPopup+draw) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)

<a name="new_FileManagerPopup_new"></a>

### new FileManagerPopup(id, title, basePath, [limitToPath], [allowedExtensions], visible)
This class is used to create a popup with a file input to select a file or a directory.It will run a promise with fs.readdir to get the list of files and directories.The user can select a file or a directory and the popup will be closed. ![FileManagerPopup](https://user-images.githubusercontent.com/14907987/165938464-c1426102-b598-42bb-8597-6337f0bcb009.gif)Emits the following events: - "confirm" when the user confirm the file or directory selection. The file or directory path is passed as parameter like this: {path: "path/to/file", name: "file.ext"}- "cancel" when the user cancel the file or directory selection.- "exit" when the user exit


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The id of the popup. |
| title | <code>string</code> |  | The title of the popup. |
| basePath | <code>string</code> |  | The main path of the popup. re case sensitive. |
| [limitToPath] | <code>boolean</code> | <code>false</code> | If true, the user * @param {boolean} [selectDirectory=false] - If true, the user can select a directory. Otherwise, only files are selectable. When true, to enter a directory, the user must press the space key instead of the enter key. |
| [allowedExtensions] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | The allowed extensions. If not set, all extensions are allowed. The extensions a can only select files in the path. If false, the user can select files in the path and parent directories. |
| visible | <code>boolean</code> |  | If the popup is visible. Default is false (make it appears using show()). |

**Example**  
```js
const popup = new FileManagerPopup("popup1", "Choose the file", "./examples").show().on("confirm", (selected) => { console.log(selected) }) // show the popup and wait for the user to confirm
```
<a name="FileManagerPopup+listDir"></a>

### fileManagerPopup.listDir(path) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
This function is used to load the list of files and directories in the current path.it return a promise with the list of files and directories. The list is an array of objects like this:[{text: "📄 file.ext", name: "file.ext", type: "file", path: "path/to/file.ext"}, {text: "📁 dir/", name: "dir", type: "dir", path: "path/to/dir"}]

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - The list of files and directories.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to load the list. |

<a name="FileManagerPopup+updateList"></a>

### fileManagerPopup.updateList(path)
This function calls the updateList function and store the result to this.options, it also refresh the list of files and directories.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to load the list. |

<a name="FileManagerPopup+keyListner"></a>

### fileManagerPopup.keyListner(str, key)
This function is used to make the ConsoleManager handle the key events when the popup is showed.Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string of the input. |
| key | <code>Object</code> | The key object. |

<a name="FileManagerPopup+getSelected"></a>

### fileManagerPopup.getSelected() ⇒ <code>string</code> \| <code>number</code>
This function is used to get the selected option.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: <code>string</code> \| <code>number</code> - The selected value of the popup.  
<a name="FileManagerPopup+setSelected"></a>

### fileManagerPopup.setSelected(selected) ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
This function is used to change the selection of the popup. It also refresh the ConsoleManager.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: [<code>FileManagerPopup</code>](#FileManagerPopup) - The instance of the FileManagerPopup.  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>string</code> \| <code>number</code> | The new value of the selection. |

<a name="FileManagerPopup+show"></a>

### fileManagerPopup.show() ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: [<code>FileManagerPopup</code>](#FileManagerPopup) - The instance of the FileManagerPopup.  
<a name="FileManagerPopup+hide"></a>

### fileManagerPopup.hide() ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: [<code>FileManagerPopup</code>](#FileManagerPopup) - The instance of the FileManagerPopup.  
<a name="FileManagerPopup+isVisible"></a>

### fileManagerPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: <code>boolean</code> - The visibility of the popup.  
<a name="FileManagerPopup+manageInput"></a>

### fileManagerPopup.manageInput() ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
This function is used to add the FileManagerPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: [<code>FileManagerPopup</code>](#FileManagerPopup) - The instance of the FileManagerPopup.  
<a name="FileManagerPopup+unManageInput"></a>

### fileManagerPopup.unManageInput() ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
This function is used to remove the FileManagerPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: [<code>FileManagerPopup</code>](#FileManagerPopup) - The instance of the FileManagerPopup.  
<a name="FileManagerPopup+draw"></a>

### fileManagerPopup.draw() ⇒ [<code>FileManagerPopup</code>](#FileManagerPopup)
This function is used to draw the FileManagerPopup to the screen in the middle.

**Kind**: instance method of [<code>FileManagerPopup</code>](#FileManagerPopup)  
**Returns**: [<code>FileManagerPopup</code>](#FileManagerPopup) - The instance of the FileManagerPopup.  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
