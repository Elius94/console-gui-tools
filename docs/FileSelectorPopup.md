## Classes

<dl>
<dt><a href="#FileSelectorPopup">FileSelectorPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#x">x</a> : <code>number</code></dt>
<dd><p>The x offset of the popup to be drown. If 0 it will be placed on the center</p></dd>
<dt><a href="#y">y</a> : <code>number</code></dt>
<dd><p>The y offset of the popup to be drown. If 0 it will be placed on the center</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#FileSelectorPopupConfig">FileSelectorPopupConfig</a> : <code>Object</code></dt>
<dd><p>The configuration for the FileSelectorPopup class.</p></dd>
</dl>

<a name="FileSelectorPopupConfig"></a>

## FileSelectorPopupConfig : <code>Object</code>
<p>The configuration for the FileSelectorPopup class.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the file selector popup.</p> |
| title | <code>string</code> | <p>The title of the file selector popup.</p> |
| basePath | <code>string</code> | <p>The base path of the file selector popup.</p> |
| [selectDirectory] | <code>boolean</code> | <p>If the file selector popup can select directories.</p> |
| [allowedExtensions] | <code>Array.&lt;string&gt;</code> | <p>The allowed extensions. If not set, all extensions are allowed.</p> |
| [limitToPath] | <code>boolean</code> | <p>If true, the user can select a directory. Otherwise, only files are selectable. When true, to enter a directory, the user must press the space key instead of the enter key.</p> |
| [visible] | <code>boolean</code> | <p>If the file selector popup is visible.</p> |

<a name="FileSelectorPopup"></a>

## FileSelectorPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [FileSelectorPopup](#FileSelectorPopup) ⇐ <code>EventEmitter</code>
    * [new FileSelectorPopup(config)](#new_FileSelectorPopup_new)
    * [.listDir(dir)](#FileSelectorPopup+listDir) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.updateList(_path)](#FileSelectorPopup+updateList)
    * [.keyListener(str, key)](#FileSelectorPopup+keyListener)
    * [.getSelected()](#FileSelectorPopup+getSelected) ⇒ <code>FileItemObject</code>
    * [.setSelected(selected)](#FileSelectorPopup+setSelected) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.show()](#FileSelectorPopup+show) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.hide()](#FileSelectorPopup+hide) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.isVisible()](#FileSelectorPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#FileSelectorPopup+manageInput) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.unManageInput()](#FileSelectorPopup+unManageInput) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
    * [.draw()](#FileSelectorPopup+draw) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)

<a name="new_FileSelectorPopup_new"></a>

### new FileSelectorPopup(config)
<p>This class is used to create a popup with a file input to select a file or a directory.
It will run a promise with fs.readdir to get the list of files and directories.
The user can select a file or a directory and the popup will be closed.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/165938464-c1426102-b598-42bb-8597-6337f0bcb009.gif" alt="FileSelectorPopup"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;confirm&quot; when the user confirm the file or directory selection. The file or directory path is passed as parameter like this: {path: &quot;path/to/file&quot;, name: &quot;file.ext&quot;}</li>
<li>&quot;cancel&quot; when the user cancel the file or directory selection.</li>
<li>&quot;exit&quot; when the user exit</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>FileSelectorPopupConfig</code>](#FileSelectorPopupConfig) | <p>The configuration for the FileSelectorPopup class.</p> |

**Example**  
```ts
const popup = new FileSelectorPopup({
 id: "popup1",
 title: "Choose the file",
 basePath: "./examples"
}).show().on("confirm", (selected) => {
 console.log(selected)
}) // show the popup and wait for the user to confirm
<a name="FileSelectorPopup+listDir"></a>

### fileSelectorPopup.listDir(dir) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
<p>This function is used to load the list of files and directories in the current path.
it return a promise with the list of files and directories. The list is an array of objects like this:
[{text: &quot;📄 file.ext&quot;, name: &quot;file.ext&quot;, type: &quot;file&quot;, path: &quot;path/to/file.ext&quot;}, {text: &quot;📁 dir/&quot;, name: &quot;dir&quot;, type: &quot;dir&quot;, path: &quot;path/to/dir&quot;}]</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>The list of files and directories.</p>  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | <p>The path to load the list.</p> |

<a name="FileSelectorPopup+updateList"></a>

### fileSelectorPopup.updateList(_path)
<p>This function calls the updateList function and store the result to this.options, it also refresh the list of files and directories.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  

| Param | Type | Description |
| --- | --- | --- |
| _path | <code>string</code> | <p>The path to load the list.</p> |

<a name="FileSelectorPopup+keyListener"></a>

### fileSelectorPopup.keyListener(str, key)
<p>This function is used to make the ConsoleManager handle the key events when the popup is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>Object</code> | <p>The key object.</p> |

<a name="FileSelectorPopup+getSelected"></a>

### fileSelectorPopup.getSelected() ⇒ <code>FileItemObject</code>
<p>This function is used to get the selected option.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: <code>FileItemObject</code> - <p>The selected value of the popup.</p>  
<a name="FileSelectorPopup+setSelected"></a>

### fileSelectorPopup.setSelected(selected) ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
<p>This function is used to change the selection of the popup. It also refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - <p>The instance of the FileSelectorPopup.</p>  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>FileItemObject</code> | <p>The new value of the selection.</p> |

<a name="FileSelectorPopup+show"></a>

### fileSelectorPopup.show() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
<p>This function is used to show the popup. It also register the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - <p>The instance of the FileSelectorPopup.</p>  
<a name="FileSelectorPopup+hide"></a>

### fileSelectorPopup.hide() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
<p>This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - <p>The instance of the FileSelectorPopup.</p>  
<a name="FileSelectorPopup+isVisible"></a>

### fileSelectorPopup.isVisible() ⇒ <code>boolean</code>
<p>This function is used to get the visibility of the popup.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: <code>boolean</code> - <p>The visibility of the popup.</p>  
<a name="FileSelectorPopup+manageInput"></a>

### fileSelectorPopup.manageInput() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
<p>This function is used to add the FileSelectorPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - <p>The instance of the FileSelectorPopup.</p>  
<a name="FileSelectorPopup+unManageInput"></a>

### fileSelectorPopup.unManageInput() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
<p>This function is used to remove the FileSelectorPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - <p>The instance of the FileSelectorPopup.</p>  
<a name="FileSelectorPopup+draw"></a>

### fileSelectorPopup.draw() ⇒ [<code>FileSelectorPopup</code>](#FileSelectorPopup)
<p>This function is used to draw the FileSelectorPopup to the screen in the middle.</p>

**Kind**: instance method of [<code>FileSelectorPopup</code>](#FileSelectorPopup)  
**Returns**: [<code>FileSelectorPopup</code>](#FileSelectorPopup) - <p>The instance of the FileSelectorPopup.</p>  
<a name="x"></a>

## x : <code>number</code>
<p>The x offset of the popup to be drown. If 0 it will be placed on the center</p>

**Kind**: global variable  
<a name="y"></a>

## y : <code>number</code>
<p>The y offset of the popup to be drown. If 0 it will be placed on the center</p>

**Kind**: global variable  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
