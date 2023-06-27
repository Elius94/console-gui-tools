## Classes

<dl>
<dt><a href="#InputPopup">InputPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#cursorPos">cursorPos</a> : <code>number</code></dt>
<dd><p>Since v3.1.0 a blinking cursor has been added to InputPopup (thanks @Compositr)</p></dd>
<dt><a href="#flashLoop">flashLoop</a> : <code>setInterval</code></dt>
<dd><p>Since v3.1.0 a blinking cursor has been added to InputPopup (thanks @Compositr)</p></dd>
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
<dt><a href="#InputPopupConfig">InputPopupConfig</a> : <code>Object</code></dt>
<dd><p>The configuration for the InputPopup class.</p></dd>
</dl>

<a name="InputPopupConfig"></a>

## InputPopupConfig : <code>Object</code>
<p>The configuration for the InputPopup class.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| value | <code>string</code> \| <code>number</code> | <p>The value of the popup.</p> |
| numeric | <code>boolean</code> | <p>If the input is numeric.</p> |
| [visible] | <code>boolean</code> | <p>If the popup is visible.</p> |
| [placeholder] | <code>string</code> | <p>Optional placeholder to show if empty</p> |

<a name="InputPopup"></a>

## InputPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [InputPopup](#InputPopup) ⇐ <code>EventEmitter</code>
    * [new InputPopup(config)](#new_InputPopup_new)
    * [.keyListenerNumeric(_str, key)](#InputPopup+keyListenerNumeric)
    * [.keyListenerText(_str, key)](#InputPopup+keyListenerText)
    * [.getValue()](#InputPopup+getValue) ⇒ <code>string</code> \| <code>number</code>
    * [.setValue(newValue)](#InputPopup+setValue) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.show()](#InputPopup+show) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.hide()](#InputPopup+hide) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.isVisible()](#InputPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#InputPopup+manageInput) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.unManageInput()](#InputPopup+unManageInput) ⇒ [<code>InputPopup</code>](#InputPopup)
    * [.draw()](#InputPopup+draw) ⇒ [<code>InputPopup</code>](#InputPopup)

<a name="new_InputPopup_new"></a>

### new InputPopup(config)
<p>This class is used to create a popup with a text or numeric input.</p>
<p><img src="https://github.com/Elius94/console-gui-tools/assets/14907987/eecac72f-9ccc-444b-a0e3-2b7e277fdeea" alt="InputPopup"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;confirm&quot; when the user confirm the input</li>
<li>&quot;cancel&quot; when the user cancel the input</li>
<li>&quot;exit&quot; when the user exit the input</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>InputPopupConfig</code>](#InputPopupConfig) | <p>The config of the popup.</p> |

**Example**  
```tsconst popup = new InputPopup({ id: "popup1", title: "Choose the number", value: selectedNumber, numeric: true}).show().on("confirm", (value) => { console.log(value) }) // show the popup and wait for the user to confirm```
<a name="InputPopup+keyListenerNumeric"></a>

### inputPopup.keyListenerNumeric(_str, key)
<p>This function is used to make the ConsoleManager handle the key events when the input is numeric and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  

| Param | Type | Description |
| --- | --- | --- |
| _str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>Object</code> | <p>The key object.</p> |

<a name="InputPopup+keyListenerText"></a>

### inputPopup.keyListenerText(_str, key)
<p>This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  

| Param | Type | Description |
| --- | --- | --- |
| _str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>Object</code> | <p>The key object.</p> |

<a name="InputPopup+getValue"></a>

### inputPopup.getValue() ⇒ <code>string</code> \| <code>number</code>
<p>This function is used to get the value of the input.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: <code>string</code> \| <code>number</code> - <p>The value of the input.</p>  
<a name="InputPopup+setValue"></a>

### inputPopup.setValue(newValue) ⇒ [<code>InputPopup</code>](#InputPopup)
<p>This function is used to change the value of the input. It also refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - <p>The instance of the InputPopup.</p>  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>string</code> \| <code>number</code> | <p>The new value of the input.</p> |

<a name="InputPopup+show"></a>

### inputPopup.show() ⇒ [<code>InputPopup</code>](#InputPopup)
<p>This function is used to show the popup. It also register the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - <p>The instance of the InputPopup.</p>  
<a name="InputPopup+hide"></a>

### inputPopup.hide() ⇒ [<code>InputPopup</code>](#InputPopup)
<p>This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - <p>The instance of the InputPopup.</p>  
<a name="InputPopup+isVisible"></a>

### inputPopup.isVisible() ⇒ <code>boolean</code>
<p>This function is used to get the visibility of the popup.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: <code>boolean</code> - <p>The visibility of the popup.</p>  
<a name="InputPopup+manageInput"></a>

### inputPopup.manageInput() ⇒ [<code>InputPopup</code>](#InputPopup)
<p>This function is used to add the InputPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - <p>The instance of the InputPopup.</p>  
<a name="InputPopup+unManageInput"></a>

### inputPopup.unManageInput() ⇒ [<code>InputPopup</code>](#InputPopup)
<p>This function is used to remove the InputPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - <p>The instance of the InputPopup.</p>  
<a name="InputPopup+draw"></a>

### inputPopup.draw() ⇒ [<code>InputPopup</code>](#InputPopup)
<p>This function is used to draw the InputPopup to the screen in the middle.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  
**Returns**: [<code>InputPopup</code>](#InputPopup) - <p>The instance of the InputPopup.</p>  
<a name="cursorPos"></a>

## cursorPos : <code>number</code>
<p>Since v3.1.0 a blinking cursor has been added to InputPopup (thanks @Compositr)</p>

**Kind**: global variable  
<a name="flashLoop"></a>

## flashLoop : <code>setInterval</code>
<p>Since v3.1.0 a blinking cursor has been added to InputPopup (thanks @Compositr)</p>

**Kind**: global variable  
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
