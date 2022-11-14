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
