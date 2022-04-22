## Classes

<dl>
<dt><a href="#InputPopup">InputPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#InputPopup.keyListnerNumeric(str, key)"> key)(str, key)</a></dt>
<dd><p>This function is used to make the ConsoleManager handle the key events when the input is numeric and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>
</dd>
<dt><a href="#InputPopup.keyListnerText(str, key)"> key)(str, key)</a></dt>
<dd><p>This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>
</dd>
</dl>

<a name="InputPopup"></a>

## InputPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [InputPopup](#InputPopup) ⇐ <code>EventEmitter</code>
    * [new InputPopup(id, title, value, numeric, visible)](#new_InputPopup_new)
    * [.getValue()](#InputPopup+getValue) ⇒ <code>string</code> \| <code>number</code>
    * [.setValue(newValue)](#InputPopup+setValue) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.show()](#InputPopup+show) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.hide()](#InputPopup+hide) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.isVisible()](#InputPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#InputPopup+manageInput) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.unManageInput()](#InputPopup+unManageInput) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.draw()](#InputPopup+draw) ⇒ [<code>InputPopup</code>](#InputPopup)

<a name="new_InputPopup_new"></a>

### new InputPopup(id, title, value, numeric, visible)
This class is used to create a popup with a text or numeric input. Emits the following events: - "confirm" when the user confirm the input- "cancel" when the user cancel the input- "exit" when the user exit the input


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the popup. |
| title | <code>string</code> | The title of the popup. |
| value | <code>string</code> \| <code>number</code> | The value of the input. |
| numeric | <code>boolean</code> | If the input is numeric. |
| visible | <code>boolean</code> | If the popup is visible. Default is false (make it appears using show()). |

**Example**  
```js
const popup = new InputPopup("popup1", "Choose the number", selectedNumber, true).show().on("confirm", (value) => { console.log(value) }) // show the popup and wait for the user to confirm
```
<a name="InputPopup+getValue"></a>

### inputPopup.getValue() ⇒ <code>string</code> \| <code>number</code>
This function is used to get the value of the input.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: <code>string</code> \| <code>number</code> - The value of the input.  
<a name="InputPopup+setValue"></a>

### inputPopup.setValue(newValue) ⇒ [<code>InputPopup</code>](#InputPopup)
This function is used to change the value of the input. It also refresh the ConsoleManager.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - The instance of the InputPopup.  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>string</code> \| <code>number</code> | The new value of the input. |

<a name="InputPopup+show"></a>

### inputPopup.show() ⇒ [<code>InputPopup</code>](#InputPopup)
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - The instance of the InputPopup.  
<a name="InputPopup+hide"></a>

### inputPopup.hide() ⇒ [<code>InputPopup</code>](#InputPopup)
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - The instance of the InputPopup.  
<a name="InputPopup+isVisible"></a>

### inputPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: <code>boolean</code> - The visibility of the popup.  
<a name="InputPopup+manageInput"></a>

### inputPopup.manageInput() ⇒ [<code>InputPopup</code>](#InputPopup)
This function is used to add the InputPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - The instance of the InputPopup.  
<a name="InputPopup+unManageInput"></a>

### inputPopup.unManageInput() ⇒ [<code>InputPopup</code>](#InputPopup)
This function is used to remove the InputPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - The instance of the InputPopup.  
<a name="InputPopup+draw"></a>

### inputPopup.draw() ⇒ [<code>InputPopup</code>](#InputPopup)
This function is used to draw the InputPopup to the screen in the middle.

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - The instance of the InputPopup.  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
