## Classes

<dl>
<dt><a href="#FileSelectorPopup">FileSelectorPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

<a name="FileSelectorPopup"></a>

## FileSelectorPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [FileSelectorPopup](#FileSelectorPopup) ⇐ <code>EventEmitter</code>
    * [new FileSelectorPopup(id, title, basePath, [limitToPath], [allowedExtensions], visible)](#new_FileSelectorPopup_new)
    * [.listDir(path)](#FileSelectorPopup+listDir) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.updateList(path)](#FileSelectorPopup+updateList)
    * [.keyListner(str, key)](#FileSelectorPopup+keyListner)
    * [.getSelected()](#FileSelectorPopup+getSelected) ⇒ <code>string</code> \| <code>number</code>
    * [.setSelected(selected)](#FileSelectorPopup+setSelected) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.show()](#FileSelectorPopup+show) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.hide()](#FileSelectorPopup+hide) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.isVisible()](#FileSelectorPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#FileSelectorPopup+manageInput) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.unManageInput()](#FileSelectorPopup+unManageInput) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.draw()](#FileSelectorPopup+draw) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)

<a name="new_FileSelectorPopup_new"></a>

### new FileSelectorPopup(id, title, basePath, [limitToPath], [allowedExtensions], visible)
This class is used to create a popup with a file input to select a file or a directory.It will run a promise with fs.readdir to get the list of files and directories.The user can select a file or a directory and the popup will be closed. ![FileSelectorPopup](https://user-images.githubusercontent.com/14907987/165938464-c1426102-b598-42bb-8597-6337f0bcb009.gif)Emits the following events: - "confirm" when the user confirm the file or directory selection. The file or directory path is passed as parameter like this: {path: "path/to/file", name: "file.ext"}- "cancel" when the user cancel the file or directory selection.- "exit" when the user exit


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The id of the popup. |
| title | <code>string</code> |  | The title of the popup. |
| basePath | <code>string</code> |  | The main path of the popup. re case sensitive. |
| [limitToPath] | <code>boolean</code> | <code>false</code> | If true, the user can select a directory. Otherwise, only files are selectable. When true, to enter a directory, the user must press the space key instead of the enter key. |
| [allowedExtensions] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | The allowed extensions. If not set, all extensions are allowed. The extensions a can only select files in the path. If false, the user can select files in the path and parent directories. |
| visible | <code>boolean</code> |  | If the popup is visible. Default is false (make it appears using show()). |

**Example**  
```js
const popup = new FileSelectorPopup("popup1", "Choose the file", "./examples").show().on("confirm", (selected) => { console.log(selected) }) // show the popup and wait for the user to confirm
```
<a name="FileSelectorPopup+listDir"></a>

### fileSelectorPopup.listDir(path) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
This function is used to load the list of files and directories in the current path.it return a promise with the list of files and directories. The list is an array of objects like this:[{text: "📄 file.ext", name: "file.ext", type: "file", path: "path/to/file.ext"}, {text: "📁 dir/", name: "dir", type: "dir", path: "path/to/dir"}]

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - The list of files and directories.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to load the list. |

<a name="FileSelectorPopup+updateList"></a>

### fileSelectorPopup.updateList(path)
This function calls the updateList function and store the result to this.options, it also refresh the list of files and directories.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to load the list. |

<a name="FileSelectorPopup+keyListner"></a>

### fileSelectorPopup.keyListner(str, key)
This function is used to make the ConsoleManager handle the key events when the popup is showed.Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string of the input. |
| key | <code>Object</code> | The key object. |

<a name="FileSelectorPopup+getSelected"></a>

### fileSelectorPopup.getSelected() ⇒ <code>string</code> \| <code>number</code>
This function is used to get the selected option.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: <code>string</code> \| <code>number</code> - The selected value of the popup.  
<a name="FileSelectorPopup+setSelected"></a>

### fileSelectorPopup.setSelected(selected) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
This function is used to change the selection of the popup. It also refresh the ConsoleManager.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - The instance of the FileSelectorPopup.  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>string</code> \| <code>number</code> | The new value of the selection. |

<a name="FileSelectorPopup+show"></a>

### fileSelectorPopup.show() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - The instance of the FileSelectorPopup.  
<a name="FileSelectorPopup+hide"></a>

### fileSelectorPopup.hide() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - The instance of the FileSelectorPopup.  
<a name="FileSelectorPopup+isVisible"></a>

### fileSelectorPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: <code>boolean</code> - The visibility of the popup.  
<a name="FileSelectorPopup+manageInput"></a>

### fileSelectorPopup.manageInput() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
This function is used to add the FileSelectorPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - The instance of the FileSelectorPopup.  
<a name="FileSelectorPopup+unManageInput"></a>

### fileSelectorPopup.unManageInput() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
This function is used to remove the FileSelectorPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - The instance of the FileSelectorPopup.  
<a name="FileSelectorPopup+draw"></a>

### fileSelectorPopup.draw() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
This function is used to draw the FileSelectorPopup to the screen in the middle.

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - The instance of the FileSelectorPopup.  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
