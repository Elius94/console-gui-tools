## Classes

<dl>
<dt><a href="#OptionPopup">OptionPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
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
<p>This class is used to create a popup with a list of selectable options.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/165752387-2eac4936-1b5d-462e-9353-562d04f1b4fe.gif" alt="OptionPopup"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;confirm&quot; when the user confirm the option</li>
<li>&quot;cancel&quot; when the user cancel the option</li>
<li>&quot;exit&quot; when the user exit the option</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| options | <code>Array.&lt;(string\|number)&gt;</code> | <p>The options of the popup.</p> |
| selected | <code>string</code> \| <code>number</code> | <p>The selected option.</p> |
| visible | <code>boolean</code> | <p>If the popup is visible. Default is false (make it appears using show()).</p> |

**Example**  
```js
const popup = new OptionPopup("popup1", "Choose the option", options, selectedOption).show().on("confirm", (option) => { console.log(option) }) // show the popup and wait for the user to confirm
```
<a name="OptionPopup+keyListner"></a>

### optionPopup.keyListner(str, key)
<p>This function is used to make the ConsoleManager handle the key events when the popup is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>Object</code> | <p>The key object.</p> |

<a name="OptionPopup+getSelected"></a>

### optionPopup.getSelected() ⇒ <code>string</code> \| <code>number</code>
<p>This function is used to get the selected option.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: <code>string</code> \| <code>number</code> - <p>The selected value of the popup.</p>  
<a name="OptionPopup+setSelected"></a>

### optionPopup.setSelected(selected) ⇒ [<code>OptionPopup</code>](#OptionPopup)
<p>This function is used to change the selection of the popup. It also refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - <p>The instance of the OptionPopup.</p>  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>string</code> \| <code>number</code> | <p>The new value of the selection.</p> |

<a name="OptionPopup+show"></a>

### optionPopup.show() ⇒ [<code>OptionPopup</code>](#OptionPopup)
<p>This function is used to show the popup. It also register the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - <p>The instance of the OptionPopup.</p>  
<a name="OptionPopup+hide"></a>

### optionPopup.hide() ⇒ [<code>OptionPopup</code>](#OptionPopup)
<p>This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - <p>The instance of the OptionPopup.</p>  
<a name="OptionPopup+isVisible"></a>

### optionPopup.isVisible() ⇒ <code>boolean</code>
<p>This function is used to get the visibility of the popup.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: <code>boolean</code> - <p>The visibility of the popup.</p>  
<a name="OptionPopup+manageInput"></a>

### optionPopup.manageInput() ⇒ [<code>OptionPopup</code>](#OptionPopup)
<p>This function is used to add the OptionPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - <p>The instance of the OptionPopup.</p>  
<a name="OptionPopup+unManageInput"></a>

### optionPopup.unManageInput() ⇒ [<code>OptionPopup</code>](#OptionPopup)
<p>This function is used to remove the OptionPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - <p>The instance of the OptionPopup.</p>  
<a name="OptionPopup+draw"></a>

### optionPopup.draw() ⇒ [<code>OptionPopup</code>](#OptionPopup)
<p>This function is used to draw the OptionPopup to the screen in the middle.</p>

**Kind**: instance method of [<code>OptionPopup</code>](#OptionPopup)  
**Returns**: [<code>OptionPopup</code>](#OptionPopup) - <p>The instance of the OptionPopup.</p>  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
