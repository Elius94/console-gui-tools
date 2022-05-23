## Classes

<dl>
<dt><a href="#InputPopup">InputPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
</dl>

<a name="InputPopup"></a>

## InputPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [InputPopup](#InputPopup) ⇐ <code>EventEmitter</code>
    * [new InputPopup(id, title, value, numeric, visible)](#new_InputPopup_new)
    * [.keyListnerNumeric(_str, key)](#InputPopup+keyListnerNumeric)
    * [.keyListnerText(_str, key)](#InputPopup+keyListnerText)
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
<p>This class is used to create a popup with a text or numeric input.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/165752281-e836b862-a54a-48d5-b4e7-954374d6509f.gif" alt="InputPopup"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;confirm&quot; when the user confirm the input</li>
<li>&quot;cancel&quot; when the user cancel the input</li>
<li>&quot;exit&quot; when the user exit the input</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| value | <code>string</code> \| <code>number</code> | <p>The value of the input.</p> |
| numeric | <code>boolean</code> | <p>If the input is numeric.</p> |
| visible | <code>boolean</code> | <p>If the popup is visible. Default is false (make it appears using show()).</p> |

**Example**  
```js
const popup = new InputPopup("popup1", "Choose the number", selectedNumber, true).show().on("confirm", (value) => { console.log(value) }) // show the popup and wait for the user to confirm
```
<a name="InputPopup+keyListnerNumeric"></a>

### inputPopup.keyListnerNumeric(_str, key)
<p>This function is used to make the ConsoleManager handle the key events when the input is numeric and it is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>InputPopup</code>](#InputPopup)  

| Param | Type | Description |
| --- | --- | --- |
| _str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>Object</code> | <p>The key object.</p> |

<a name="InputPopup+keyListnerText"></a>

### inputPopup.keyListnerText(_str, key)
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
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
