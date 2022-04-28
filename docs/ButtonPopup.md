## Classes

<dl>
<dt><a href="#ButtonPopup">ButtonPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
</dl>

<a name="ButtonPopup"></a>

## ButtonPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ButtonPopup](#ButtonPopup) ⇐ <code>EventEmitter</code>
    * [new ButtonPopup(id, title, message, buttons, visible)](#new_ButtonPopup_new)
    * [.keyListner(str, key)](#ButtonPopup+keyListner)
    * [.show()](#ButtonPopup+show) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.hide()](#ButtonPopup+hide) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.isVisible()](#ButtonPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#ButtonPopup+manageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.unManageInput()](#ButtonPopup+unManageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.draw()](#ButtonPopup+draw) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)

<a name="new_ButtonPopup_new"></a>

### new ButtonPopup(id, title, message, buttons, visible)
This class is used to create a popup with That asks for a confirm. ![ButtonPopup](https://user-images.githubusercontent.com/14907987/165752116-b796f41a-e4fe-45db-8c90-5d97318bd17a.gif)Emits the following events: - "confirm" when the user confirm- "cancel" when the user cancel- "exit" when the user exit


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
<a name="ButtonPopup+keyListner"></a>

### buttonPopup.keyListner(str, key)
This function is used to make the ConsoleManager handle the key events when the popup is showed.Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string of the input. |
| key | <code>Object</code> | The key object. |

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
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
