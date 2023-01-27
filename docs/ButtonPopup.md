## Classes

<dl>
<dt><a href="#ButtonPopup">ButtonPopup</a> ⇐ <code>EventEmitter</code></dt>
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
<dt><a href="#ButtonPopupConfig">ButtonPopupConfig</a> : <code>Object</code></dt>
<dd><p>The configuration for the ButtonPopup class.</p></dd>
</dl>

<a name="ButtonPopupConfig"></a>

## ButtonPopupConfig : <code>Object</code>
<p>The configuration for the ButtonPopup class.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| message | <code>string</code> | <p>The message of the popup.</p> |
| [buttons] | <code>Array.&lt;string&gt;</code> | <p>The buttons of the popup (default is [&quot;Ok&quot;, &quot;Cancel&quot;, &quot;?&quot;]).</p> |
| [visible] | <code>boolean</code> | <p>If the popup is visible. Default is false (make it appears using show()).</p> |

<a name="ButtonPopup"></a>

## ButtonPopup ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ButtonPopup](#ButtonPopup) ⇐ <code>EventEmitter</code>
    * [new ButtonPopup(config)](#new_ButtonPopup_new)
    * [.keyListener(_str, key)](#ButtonPopup+keyListener)
    * [.show()](#ButtonPopup+show) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.hide()](#ButtonPopup+hide) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.isVisible()](#ButtonPopup+isVisible) ⇒ <code>boolean</code>
    * [.manageInput()](#ButtonPopup+manageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.unManageInput()](#ButtonPopup+unManageInput) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)
    * [.draw()](#ButtonPopup+draw) ⇒ [<code>ButtonPopup</code>](#ButtonPopup)

<a name="new_ButtonPopup_new"></a>

### new ButtonPopup(config)
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
| config | [<code>ButtonPopupConfig</code>](#ButtonPopupConfig) | <p>The configuration of the popup.</p> |

**Example**  
```tsconst popup = new ButtonPopup({ id: "popup1",  title: "Choose the option",  buttons: ["YES", "NO", "?"],}) popup.show() // show the popuppopup.on("confirm", () => { console.log("User confirmed")})popup.on("cancel", () => { console.log("User canceled")})```
<a name="ButtonPopup+keyListener"></a>

### buttonPopup.keyListener(_str, key)
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
