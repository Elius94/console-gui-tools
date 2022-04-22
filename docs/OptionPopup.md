## Classes

<dl>
<dt><a href="#OptionPopup">OptionPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

<a name="OptionPopup"></a>

## OptionPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [OptionPopup](#OptionPopup) ⇐ <code>EventEmitter</code>
    * [new OptionPopup(id, title, options, selected, visible)](#new_OptionPopup_new)
    * [.keyListner(str, key)](#OptionPopup+keyListner)
    * [.getSelected()](#OptionPopup+getSelected) ⇒ <code>string</code> \| <code>number</code>
    * [.setSelected(selected)](#OptionPopup+setSelected) ⇒ [<code>OptionPopup</code>](#OptionPopup)
    * [.show()](#OptionPopup+show) ⇒ [<code>OptionPopup</code>](#OptionPopup)
    * [.hide()](#OptionPopup+hide) ⇒ [<code>OptionPopup</code>](#OptionPopup)
    * [.isVisible()](#OptionPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#OptionPopup+manageInput) ⇒ [<code>OptionPopup</code>](#OptionPopup)
    * [.unManageInput()](#OptionPopup+unManageInput) ⇒ [<code>OptionPopup</code>](#OptionPopup)
    * [.draw()](#OptionPopup+draw) ⇒ [<code>OptionPopup</code>](#OptionPopup)

<a name="new_OptionPopup_new"></a>

### new OptionPopup(id, title, options, selected, visible)
This class is used to create a popup with a list of selectable options. Emits the following events: - "confirm" when the user confirm the option- "cancel" when the user cancel the option- "exit" when the user exit the option


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the popup. |
| title | <code>string</code> | The title of the popup. |
| options | <code>Array.&lt;(string\|number)&gt;</code> | The options of the popup. |
| selected | <code>string</code> \| <code>number</code> | The selected option. |
| visible | <code>boolean</code> | If the popup is visible. Default is false (make it appears using show()). |

**Example**  
```js
const popup = new OptionPopup("popup1", "Choose the option", options, selectedOption).show().on("confirm", (option) => { console.log(option) }) // show the popup and wait for the user to confirm
```
<a name="OptionPopup+keyListner"></a>

### optionPopup.keyListner(str, key)
This function is used to make the ConsoleManager handle the key events when the popup is showed.Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string of the input. |
| key | <code>Object</code> | The key object. |

<a name="OptionPopup+getSelected"></a>

### optionPopup.getSelected() ⇒ <code>string</code> \| <code>number</code>
This function is used to get the selected option.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: <code>string</code> \| <code>number</code> - The selected value of the popup.  
<a name="OptionPopup+setSelected"></a>

### optionPopup.setSelected(selected) ⇒ [<code>OptionPopup</code>](#OptionPopup)
This function is used to change the selection of the popup. It also refresh the ConsoleManager.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - The instance of the OptionPopup.  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>string</code> \| <code>number</code> | The new value of the selection. |

<a name="OptionPopup+show"></a>

### optionPopup.show() ⇒ [<code>OptionPopup</code>](#OptionPopup)
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - The instance of the OptionPopup.  
<a name="OptionPopup+hide"></a>

### optionPopup.hide() ⇒ [<code>OptionPopup</code>](#OptionPopup)
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - The instance of the OptionPopup.  
<a name="OptionPopup+isVisible"></a>

### optionPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: <code>boolean</code> - The visibility of the popup.  
<a name="OptionPopup+manageInput"></a>

### optionPopup.manageInput() ⇒ [<code>OptionPopup</code>](#OptionPopup)
This function is used to add the OptionPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - The instance of the OptionPopup.  
<a name="OptionPopup+unManageInput"></a>

### optionPopup.unManageInput() ⇒ [<code>OptionPopup</code>](#OptionPopup)
This function is used to remove the OptionPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - The instance of the OptionPopup.  
<a name="OptionPopup+draw"></a>

### optionPopup.draw() ⇒ [<code>OptionPopup</code>](#OptionPopup)
This function is used to draw the OptionPopup to the screen in the middle.

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - The instance of the OptionPopup.  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
