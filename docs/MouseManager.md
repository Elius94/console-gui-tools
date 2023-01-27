## Classes

<dl>
<dt><a href="#MouseManager">MouseManager</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#keymap">keymap</a> : <code>Object</code></dt>
<dd><p>Object containing &quot;MOUSE&quot; array of key codes.</p></dd>
<dt><a href="#state">state</a> : <code>Object</code></dt>
<dd><p>Object containing the state of the mouse buttons.</p></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#MouseEventArgs">MouseEventArgs</a> : <code>Object</code></dt>
<dd><p>This type is used to define the parameters of the Mouse Listener event (mouseevent) data.</p></dd>
<dt><a href="#MouseEvent">MouseEvent</a> : <code>Object</code></dt>
<dd><p>This type is used to define the parameters of the Mouse Listener event (mouseevent).
available event names:</p>
<ul>
<li>MOUSE_MOTION: mouse moved (no button pressed / hover)</li>
<li>MOUSE_DRAG: Valorized xFrom and yFrom. Use left or right to know which button is pressed.</li>
<li>MOUSE_LEFT_BUTTON_PRESS</li>
<li>MOUSE_LEFT_BUTTON_RELEASE</li>
<li>MOUSE_RIGHT_BUTTON_PRESS</li>
<li>MOUSE_RIGHT_BUTTON_RELEASE</li>
<li>MOUSE_MIDDLE_BUTTON_PRESS</li>
<li>MOUSE_MIDDLE_BUTTON_RELEASE</li>
<li>MOUSE_WHEEL_UP</li>
<li>MOUSE_WHEEL_DOWN</li>
</ul></dd>
<dt><a href="#RelativeMouseEvent">RelativeMouseEvent</a> : <code>Object</code></dt>
<dd><p>This type is used to define the parameters of the Mouse Listener event (mouseevent) data, relative to a widget.</p></dd>
</dl>

<a name="MouseEventArgs"></a>

## MouseEventArgs : <code>Object</code>
<p>This type is used to define the parameters of the Mouse Listener event (mouseevent) data.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>The code of the pressed key.</p> |
| alt | <code>boolean</code> | <p>If the alt key is pressed.</p> |
| ctrl | <code>boolean</code> | <p>If the ctrl key is pressed.</p> |
| shift | <code>boolean</code> | <p>If the shift key is pressed.</p> |
| left | <code>boolean</code> | <p>If the left mouse key is pressed.</p> |
| right | <code>boolean</code> | <p>If the right mouse key is pressed.</p> |
| x | <code>number</code> | <p>The x position of the mouse (terminal column).</p> |
| y | <code>number</code> | <p>The y position of the mouse (terminal row).</p> |
| xFrom | <code>number</code> \| <code>null</code> | <p>The original x position of the mouse (terminal column) when the drag started.</p> |
| yFrom | <code>number</code> \| <code>null</code> | <p>The original y position of the mouse (terminal row) when the drag started.</p> |

**Example**  
```js
const mouseEventArgs = { code: "MOUSE", alt: false, ctrl: false, shift: false, left: true, right: false, x: 10, y: 10, xFrom: null, yFrom: null }
```
<a name="MouseEvent"></a>

## MouseEvent : <code>Object</code>
<p>This type is used to define the parameters of the Mouse Listener event (mouseevent).
available event names:</p>
<ul>
<li>MOUSE_MOTION: mouse moved (no button pressed / hover)</li>
<li>MOUSE_DRAG: Valorized xFrom and yFrom. Use left or right to know which button is pressed.</li>
<li>MOUSE_LEFT_BUTTON_PRESS</li>
<li>MOUSE_LEFT_BUTTON_RELEASE</li>
<li>MOUSE_RIGHT_BUTTON_PRESS</li>
<li>MOUSE_RIGHT_BUTTON_RELEASE</li>
<li>MOUSE_MIDDLE_BUTTON_PRESS</li>
<li>MOUSE_MIDDLE_BUTTON_RELEASE</li>
<li>MOUSE_WHEEL_UP</li>
<li>MOUSE_WHEEL_DOWN</li>
</ul>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>The name of the event.</p> |
| eaten | <code>number</code> | <p>The number of eaten events.</p> |
| args | [<code>MouseEventArgs</code>](#MouseEventArgs) | <p>The arguments of the event.</p> |

**Example**  
```js
const mouseEvent = { name: "MOUSE_MOTION", eaten: 0, args: { code: "MOUSE", alt: false, ctrl: false, shift: false, left: true, right: false, x: 10, y: 10, xFrom: null, yFrom: null } }
```
<a name="RelativeMouseEvent"></a>

## RelativeMouseEvent : <code>Object</code>
<p>This type is used to define the parameters of the Mouse Listener event (mouseevent) data, relative to a widget.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>The name of the event.</p> |
| data | <code>object</code> | <p>The data of the event.</p> |
| data.x | <code>number</code> | <p>The x position of the mouse (terminal column).</p> |
| data.y | <code>number</code> | <p>The y position of the mouse (terminal row).</p> |

<a name="MouseManager"></a>

## MouseManager ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  
**Emits**: <code>event:mouseevent - The mouse event.</code>  

* [MouseManager](#MouseManager) ⇐ <code>EventEmitter</code>
    * [new MouseManager(Terminal)](#new_MouseManager_new)
    * [.enableMouse()](#MouseManager+enableMouse)
    * [.disableMouse()](#MouseManager+disableMouse)
    * [.isMouseFrame(key)](#MouseManager+isMouseFrame) ⇒ <code>number</code>

<a name="new_MouseManager_new"></a>

### new MouseManager(Terminal)
<p>This class is used to manage the mouse tracking events.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/201913001-713ca6e7-c277-42f7-ac1a-5f90ee1b144f.gif" alt="MouseManager"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;mouseevent&quot; when the user confirm</li>
<li>&quot;error&quot; when an error occurs</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| Terminal | <code>object</code> | <p>The terminal object (process.stdout).</p> |

**Example**  
```js
const mouse = new MouseManager(process.stdout)
```
<a name="MouseManager+enableMouse"></a>

### mouseManager.enableMouse()
<p>Enables &quot;mouseevent&quot; event on the <em>input</em> stream. Note that <code>stream</code> must be
an <em>output</em> stream (i.e. a Writable Stream instance), usually <code>process.stdout</code>.</p>

**Kind**: instance method of [<code>MouseManager</code>](#MouseManager)  
**Api**: public  
<a name="MouseManager+disableMouse"></a>

### mouseManager.disableMouse()
<p>Disables &quot;mouseevent&quot; event from being sent to the <em>input</em> stream.
Note that <code>stream</code> must be an <em>output</em> stream (i.e. a Writable Stream instance),
usually <code>process.stdout</code>.</p>

**Kind**: instance method of [<code>MouseManager</code>](#MouseManager)  
**Api**: public  
<a name="MouseManager+isMouseFrame"></a>

### mouseManager.isMouseFrame(key) ⇒ <code>number</code>
<p>Test if the key is a part of the mouse event.</p>

**Kind**: instance method of [<code>MouseManager</code>](#MouseManager)  
**Returns**: <code>number</code> - <ul>
<li>1 if the key is the header of a mouse event, -1 if is a body part, 0 otherwise.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Object</code> | <p>The key object to test.</p> |

<a name="keymap"></a>

## keymap : <code>Object</code>
<p>Object containing &quot;MOUSE&quot; array of key codes.</p>

**Kind**: global constant  
<a name="state"></a>

## state : <code>Object</code>
<p>Object containing the state of the mouse buttons.</p>

**Kind**: global constant  
