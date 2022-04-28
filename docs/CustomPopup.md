## Classes

<dl>
<dt><a href="#CustomPopup">CustomPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

<a name="CustomPopup"></a>

## CustomPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [CustomPopup](#CustomPopup) ⇐ <code>EventEmitter</code>
    * [new CustomPopup(id, title, content, width, visible)](#new_CustomPopup_new)
    * [.keyListner(str, key)](#CustomPopup+keyListner)
    * [.getContent()](#CustomPopup+getContent) ⇒ <code>PageBuilder</code>
    * [.setContent(newContent)](#CustomPopup+setContent) ⇒ [<code>CustomPopup</code>](#CustomPopup)
    * [.setWidth(newWidth)](#CustomPopup+setWidth) ⇒ [<code>CustomPopup</code>](#CustomPopup)
    * [.show()](#CustomPopup+show) ⇒ [<code>CustomPopup</code>](#CustomPopup)
    * [.hide()](#CustomPopup+hide) ⇒ [<code>CustomPopup</code>](#CustomPopup)
    * [.isVisible()](#CustomPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#CustomPopup+manageInput) ⇒ [<code>CustomPopup</code>](#CustomPopup)
    * [.unManageInput()](#CustomPopup+unManageInput) ⇒ [<code>CustomPopup</code>](#CustomPopup)
    * [.drawLine(line)](#CustomPopup+drawLine) ⇒ <code>void</code>
    * [.draw()](#CustomPopup+draw) ⇒ [<code>CustomPopup</code>](#CustomPopup)

<a name="new_CustomPopup_new"></a>

### new CustomPopup(id, title, content, width, visible)
This class is used to create a popup with a free content built with PageBuilder class. ![Animation](https://user-images.githubusercontent.com/14907987/165736767-d60f857f-3945-4b95-aa4f-292b6a41f789.gif)Emits the following events: - "confirm" when the user confirm- "cancel" when the user cancel- "exit" when the user exit- "data" when the user send custom event - the data is an object with the data and the event name


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the popup. |
| title | <code>string</code> | The title of the popup. |
| content | <code>PageBuilder</code> | The content of the popup. |
| width | <code>number</code> | The width of the popup. |
| visible | <code>boolean</code> | If the popup is visible. Default is false (make it appears using show()). |

**Example**  
```js
const popup = new CustomPopup("popup1", "See that values", new PageBuilder()).show()
```
<a name="CustomPopup+keyListner"></a>

### customPopup.keyListner(str, key)
This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string of the input. |
| key | <code>Object</code> | The key object. |

<a name="CustomPopup+getContent"></a>

### customPopup.getContent() ⇒ <code>PageBuilder</code>
This function is used to get the content of the popup.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: <code>PageBuilder</code> - The content of the popup.  
<a name="CustomPopup+setContent"></a>

### customPopup.setContent(newContent) ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to change the content of the popup. It also refresh the ConsoleManager.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  

| Param | Type | Description |
| --- | --- | --- |
| newContent | <code>PageBuilder</code> | The new content of the popup. |

<a name="CustomPopup+setWidth"></a>

### customPopup.setWidth(newWidth) ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to change the popup width. It also refresh the ConsoleManager.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  

| Param | Type | Description |
| --- | --- | --- |
| newWidth | <code>number</code> | The new width of the popup. |

<a name="CustomPopup+show"></a>

### customPopup.show() ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  
<a name="CustomPopup+hide"></a>

### customPopup.hide() ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  
<a name="CustomPopup+isVisible"></a>

### customPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: <code>boolean</code> - The visibility of the popup.  
<a name="CustomPopup+manageInput"></a>

### customPopup.manageInput() ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to add the CustomPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  
<a name="CustomPopup+unManageInput"></a>

### customPopup.unManageInput() ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to remove the CustomPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  
<a name="CustomPopup+drawLine"></a>

### customPopup.drawLine(line) ⇒ <code>void</code>
This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Array.&lt;object&gt;</code> | the line to be drawn |

<a name="CustomPopup+draw"></a>

### customPopup.draw() ⇒ [<code>CustomPopup</code>](#CustomPopup)
This function is used to draw the CustomPopup to the screen in the middle.

**Kind**: instance method of [<code>CustomPopup</code>](#CustomPopup)  
**Returns**: [<code>CustomPopup</code>](#CustomPopup) - The instance of the CustomPopup.  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
