## Classes

<dl>
<dt><a href="#Control">Control</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
</dl>

<a name="Control"></a>

## Control ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [Control](#Control) ⇐ <code>EventEmitter</code>
    * [new Control(id, visible, attributes, children)](#new_Control_new)
    * [.keyListner(_str, key)](#Control+keyListner)
    * [.getContent()](#Control+getContent) ⇒ <code>InPageWidgetBuilder</code>
    * [.focus()](#Control+focus) ⇒ [<code>Control</code>](#Control)
    * [.unfocus()](#Control+unfocus) ⇒ [<code>Control</code>](#Control)
    * [.show()](#Control+show) ⇒ [<code>Control</code>](#Control)
    * [.hide()](#Control+hide) ⇒ [<code>Control</code>](#Control)
    * [.isVisible()](#Control+isVisible) ⇒ <code>boolean</code>
    * [.isFocused()](#Control+isFocused) ⇒ <code>boolean</code>
    * [.manageInput([mouse])](#Control+manageInput) ⇒ [<code>Control</code>](#Control)
    * [.unManageInput([mouse])](#Control+unManageInput) ⇒ [<code>Control</code>](#Control)
    * [.drawLine(line)](#Control+drawLine) ⇒ <code>void</code>
    * [.draw()](#Control+draw) ⇒ [<code>Control</code>](#Control)

<a name="new_Control_new"></a>

### new Control(id, visible, attributes, children)
<p>This class is used to create a custom control (widget) with That is showed in a
absolute position on the screen. It's a base class for all the controls (widgets).</p>
<p>Emits the following events:</p>
<ul>
<li>&quot;mouse&quot;: It carries the pure mouse event, but it fires only if the mouse is over the control.</li>
<li>&quot;relativeMouse&quot;: It's like the &quot;mouse&quot; event, but it carries the relative mouse X and Y (relative to the control).</li>
</ul>
<p><img src="https://user-images.githubusercontent.com/14907987/202856804-afe605d2-46b2-4da7-ad4e-9fba5826c787.gif" alt="InPageWidget"></p>
<p>Emits the following events:</p>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| visible | <code>boolean</code> | <p>If the popup is visible. Default is false (make it appears using show()).</p> |
| attributes | <code>PhisicalValues</code> | <p>The phisical values of the control (x, y, width, height).</p> |
| children | <code>InPageWidgetBuilder</code> | <p>The content of the control.</p> |

**Example**  
```tsconst widget1 = new InPageWidgetBuilder()widget1.addRow({ text: "┌────────┐", color: "yellow", style: "bold" })widget1.addRow({ text: "│ START! │", color: "yellow", style: "bold" })widget1.addRow({ text: "└────────┘", color: "yellow", style: "bold" })const button1 = new Control("btn1", false, { x: 30, y: 18, width: 10, height: 3 }, widget1)button1.on("relativeMouse", (event) => {    // The relative mouse event is triggered with the mouse position relative to the widget    //console.log(`Mouse event: x: ${event.data.x}, y: ${event.data.y}`)    if (event.name === "MOUSE_LEFT_BUTTON_RELEASED") {        GUI.log("Button 1 clicked!")        if (valueEmitter) {            clearInterval(valueEmitter)            valueEmitter = null        } else {            valueEmitter = setInterval(frame, period)        }    }})button1.show()```
<a name="Control+keyListner"></a>

### control.keyListner(_str, key)
<p>This function is used to make the ConsoleManager handle the key events when the popup is showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  

| Param | Type | Description |
| --- | --- | --- |
| _str | <code>string</code> | <p>The string of the input.</p> |
| key | <code>any</code> | <p>The key object.</p> |

<a name="Control+getContent"></a>

### control.getContent() ⇒ <code>InPageWidgetBuilder</code>
<p>This function is used to get the content of the Control.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: <code>InPageWidgetBuilder</code> - <p>The content of the Control.</p>  
**Example**  
```tsconst content = control.getContent()```
<a name="Control+focus"></a>

### control.focus() ⇒ [<code>Control</code>](#Control)
<p>This function is used to focus the Control. It also register the key events.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  
<a name="Control+unfocus"></a>

### control.unfocus() ⇒ [<code>Control</code>](#Control)
<p>This function is used to unfocus the Control. It also unregister the key events.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  
<a name="Control+show"></a>

### control.show() ⇒ [<code>Control</code>](#Control)
<p>This function is used to show the Control. It also register the mouse events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  
<a name="Control+hide"></a>

### control.hide() ⇒ [<code>Control</code>](#Control)
<p>This function is used to hide the Control. It also unregister the mouse events and refresh the ConsoleManager.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  
<a name="Control+isVisible"></a>

### control.isVisible() ⇒ <code>boolean</code>
<p>This function is used to get the visibility of the Control.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: <code>boolean</code> - <p>The visibility of the Control.</p>  
<a name="Control+isFocused"></a>

### control.isFocused() ⇒ <code>boolean</code>
<p>This function is used to get the focus status of the Control.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: <code>boolean</code> - <p>The focused status of the Control.</p>  
<a name="Control+manageInput"></a>

### control.manageInput([mouse]) ⇒ [<code>Control</code>](#Control)
<p>This function is used to add the Control key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  

| Param | Type | Description |
| --- | --- | --- |
| [mouse] | <code>boolean</code> | <p>Register only mouse event listener.</p> |

<a name="Control+unManageInput"></a>

### control.unManageInput([mouse]) ⇒ [<code>Control</code>](#Control)
<p>This function is used to remove the Control key listener callback to te ConsoleManager.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  

| Param | Type | Description |
| --- | --- | --- |
| [mouse] | <code>boolean</code> | <p>Register only mouse event listener.</p> |

<a name="Control+drawLine"></a>

### control.drawLine(line) ⇒ <code>void</code>
<p>This function is used to draw a single line of the widget to the screen. It also trim the line if it is too long.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Array.&lt;StyledElement&gt;</code> | <p>the line to be drawn</p> |

<a name="Control+draw"></a>

### control.draw() ⇒ [<code>Control</code>](#Control)
<p>This function is used to draw the Control to the screen in the middle.</p>

**Kind**: instance method of [<code>Control</code>](#Control)  
**Returns**: [<code>Control</code>](#Control) - <p>The instance of the Control.</p>  
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
