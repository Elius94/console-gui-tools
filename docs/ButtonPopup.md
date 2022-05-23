## Classes

<dl>
<dt><a href="#ButtonPopup">ButtonPopup</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
</dl>

<a name="ButtonPopup"></a>

## ButtonPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ButtonPopup](#ButtonPopup) ⇐ <code>EventEmitter</code>
    * [new ButtonPopup(id, title, message, buttons, visible)](#new_ButtonPopup_new)
    * [.keyListner(_str, key)](#ButtonPopup+keyListner)
    * [.show()](#ButtonPopup+show) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.hide()](#ButtonPopup+hide) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.isVisible()](#ButtonPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#ButtonPopup+manageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.unManageInput()](#ButtonPopup+unManageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.draw()](#ButtonPopup+draw) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)

<a name="new_ButtonPopup_new"></a>

### new ButtonPopup(id, title, message, buttons, visible)
<p>This class is used to create a popup with That asks for a confirm.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/165752116-b796f41a-e4fe-45db-8c90-5d97318bd17a.gif" alt="ButtonPopup"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;confirm&quot; when the user confirm</li>
<li>&quot;cancel&quot; when the user cancel</li>
<li>&quot;exit&quot; when the user exit</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| message | <code>string</code> | <p>The message of the popup.</p> |
| buttons | <code>Array.&lt;string&gt;</code> | <p>The buttons of the popup (default is [&quot;Yes&quot;, &quot;No&quot;]).</p> |
| visible | <code>boolean</code> | <p>If the popup is visible. Default is false (make it appears using show()).</p> |

**Example**  
```js
const popup = new ButtonPopup("popup1", "Choose the option", ["YES", "NO", "?"]).show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
```
<a name="ButtonPopup+keyListner"></a>

### buttonPopup.keyListner(_str, key)
<p>This function is used to make the ConsoleManager handle the key events when the popup is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  

| Param | Type | Description |
| --- | --- | --- |
| _str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>any</code> | <p>The key object.</p> |

<a name="ButtonPopup+show"></a>

### buttonPopup.show() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
<p>This function is used to show the popup. It also register the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - <p>The instance of the ButtonPopup.</p>  
<a name="ButtonPopup+hide"></a>

### buttonPopup.hide() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
<p>This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - <p>The instance of the ButtonPopup.</p>  
<a name="ButtonPopup+isVisible"></a>

### buttonPopup.isVisible() ⇒ <code>boolean</code>
<p>This function is used to get the visibility of the popup.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  
**Returns**: <code>boolean</code> - <p>The visibility of the popup.</p>  
<a name="ButtonPopup+manageInput"></a>

### buttonPopup.manageInput() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
<p>This function is used to add the ButtonPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - <p>The instance of the ButtonPopup.</p>  
<a name="ButtonPopup+unManageInput"></a>

### buttonPopup.unManageInput() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
<p>This function is used to remove the ButtonPopup key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - <p>The instance of the ButtonPopup.</p>  
<a name="ButtonPopup+draw"></a>

### buttonPopup.draw() ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
<p>This function is used to draw the ButtonPopup to the screen in the middle.</p>

**Kind**: instance method of [<code>ButtonPopup</code>](#ButtonPopup)  
**Returns**: [<code>ButtonPopup</code>](#ButtonPopup) - <p>The instance of the ButtonPopup.</p>  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
