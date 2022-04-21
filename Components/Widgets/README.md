# ButtonPopup

## Classes

<dl>
<dt><a href="#ButtonPopup">ButtonPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
<dt><a href="#ConfirmPopup">ConfirmPopup</a> ⇐ <code><a href="#ButtonPopup">ButtonPopup</a></code></dt>
<dd></dd>
<dt><a href="#InputPopup">InputPopup</a> ⇐ <code>EventEmitter</code></dt> 
<dd></dd>
<dt><a href="#OptionPopup">OptionPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#ButtonPopup.keyListner(str, key)"> key)(str, key)</a></dt>  
<dd><p>This function is used to make the ConsoleManager handle the key events when the popup is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>
</dd>
<dt><a href="#InputPopup.keyListnerNumeric(str, key)"> key)(str, key)</a></dt>
<dd><p>This function is used to make the ConsoleManager handle the key events when the input is numeric and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>
</dd>
<dt><a href="#InputPopup.keyListnerText(str, key)"> key)(str, key)</a></dt>
<dd><p>This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>
</dd>
<dt><a href="#OptionPopup.keyListner(str, key)"> key)(str, key)</a></dt>  
<dd><p>This function is used to make the ConsoleManager handle the key events when the popup is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>
</dd>
</dl>

# ButtonPopup

<a name="ButtonPopup"></a>

## ButtonPopup ⇐ <code>EventEmitter</code>
**Kind**: global class
**Extends**: <code>EventEmitter</code>

* [ButtonPopup](#ButtonPopup) ⇐ <code>EventEmitter</code>
    * [new ButtonPopup(id, title, message, buttons, visible)](#new_ButtonPopup_new)
    * [.show()](#ButtonPopup+show) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.hide()](#ButtonPopup+hide) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.isVisible()](#ButtonPopup+isVisible) ⇒ <code>boolean</code>       
    * [.manageInput()](#ButtonPopup+manageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.unManageInput()](#ButtonPopup+unManageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.draw()](#ButtonPopup+draw) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)

<a name="new_ButtonPopup_new"></a>

### new ButtonPopup(id, title, message, buttons, visible)
- "exit" when the user exitncelrmpup with That asks for a confirm.        


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the popup. |
| title | <code>string</code> | The title of the popup. |
| message | <code>string</code> | The message of the popup. |
| buttons | <code>Array.&lt;string&gt;</code> | The buttons of the popup (default is ["Yes", "No"]). |
| visible | <code>boolean</code> | If the popup is visible. Default is false (make it appears using show()). |

**Example**
```js
const popup = new ButtonPopup("popup1", "Choose the option", ["YES", "NO", "?"]).show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
```
<a name="ButtonPopup+show"></a>

### buttonPopup.show() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)     
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+hide"></a>

### buttonPopup.hide() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)     
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+isVisible"></a>

### buttonPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)     
**Returns**: <code>boolean</code> - The visibility of the popup.
<a name="ButtonPopup+manageInput"></a>

### buttonPopup.manageInput() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)  
This function is used to add the ButtonPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)     
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+unManageInput"></a>

### buttonPopup.unManageInput() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
This function is used to remove the ButtonPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)     
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+draw"></a>

### buttonPopup.draw() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
This function is used to draw the ButtonPopup to the screen in the middle.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)     
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.

# ConfirmPopup

<a name="ConfirmPopup"></a>

## ConfirmPopup ⇐ [<code>ButtonPopup</code>](#ButtonPopup)
**Kind**: global class
**Extends**: [<code>ButtonPopup</code>](#ButtonPopup)

* [ConfirmPopup](#ConfirmPopup) ⇐ [<code>ButtonPopup</code>](#ButtonPopup)
    * [new ConfirmPopup(id, title, message, visible)](#new_ConfirmPopup_new)
    * [.show()](#ButtonPopup+show) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.hide()](#ButtonPopup+hide) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.isVisible()](#ButtonPopup+isVisible) ⇒ <code>boolean</code>       
    * [.manageInput()](#ButtonPopup+manageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.unManageInput()](#ButtonPopup+unManageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.draw()](#ButtonPopup+draw) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)

<a name="new_ConfirmPopup_new"></a>

### new ConfirmPopup(id, title, message, visible)
This class is an overload of ButtonPopup that is used to create a popup wi- "exit" when the user exitncelrmNo].


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the popup. |
| title | <code>string</code> | The title of the popup. |
| message | <code>string</code> | The message of the popup. |
| visible | <code>boolean</code> | If the popup is visible. Default is false (make it appears using show()). |

**Example**
```js
const popup = new ConfirmPopup("popup1", "Are you shure").show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
```
<a name="ButtonPopup+show"></a>

### confirmPopup.show() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)        
This function is used to show the popup. It also register the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>ConfirmPopup</code>](#ConfirmPopup)   
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+hide"></a>

### confirmPopup.hide() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)        
This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.

**Kind**: instance method of [<code>ConfirmPopup</code>](#ConfirmPopup)   
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+isVisible"></a>

### confirmPopup.isVisible() ⇒ <code>boolean</code>
This function is used to get the visibility of the popup.

**Kind**: instance method of [<code>ConfirmPopup</code>](#ConfirmPopup)   
**Returns**: <code>boolean</code> - The visibility of the popup.
<a name="ButtonPopup+manageInput"></a>

### confirmPopup.manageInput() ⇒ [<code>ButtonPopup</code>](#ButtonPopup) 
This function is used to add the ButtonPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>ConfirmPopup</code>](#ConfirmPopup)   
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+unManageInput"></a>

### confirmPopup.unManageInput() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
This function is used to remove the ButtonPopup key listener callback to te ConsoleManager.

**Kind**: instance method of [<code>ConfirmPopup</code>](#ConfirmPopup)   
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.
<a name="ButtonPopup+draw"></a>

### confirmPopup.draw() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)        
This function is used to draw the ButtonPopup to the screen in the middle.

**Kind**: instance method of [<code>ConfirmPopup</code>](#ConfirmPopup)   
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - The instance of the ButtonPopup.

# InputPopup

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
- "exit" when the user exit the inputnputut text or numeric input.        


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

# OptionPopup

<a name="OptionPopup"></a>

## OptionPopup ⇐ <code>EventEmitter</code>
**Kind**: global class
**Extends**: <code>EventEmitter</code>

* [OptionPopup](#OptionPopup) ⇐ <code>EventEmitter</code>
    * [new OptionPopup(id, title, options, selected, visible)](#new_OptionPopup_new)
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
- "exit" when the user exit the optiontiononlist of selectable options.   


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
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant

# Other documentation

[ConsoleManager](https://github.com/Elius94/console-gui-tools/blob/dc6094cbc9a9a0f70bc7877804261af129a0748c/DOCS.md).

[Components](https://github.com/Elius94/console-gui-tools/blob/dc6094cbc9a9a0f70bc7877804261af129a0748c/Components/README.md)

[Layouts](https://github.com/Elius94/console-gui-tools/blob/dc6094cbc9a9a0f70bc7877804261af129a0748c/Components/Layout/README.md)