## Classes

<dl>
<dt><a href="#Box">Box</a> ⇐ <code>Control</code></dt>
<dd></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#BoxConfig">BoxConfig</a> : <code>Object</code></dt>
<dd><p>The configuration for the Box class.</p></dd>
<dt><a href="#BoxStyle">BoxStyle</a> : <code>Object</code></dt>
<dd><p>The style of the box.</p></dd>
</dl>

<a name="BoxConfig"></a>

## BoxConfig : <code>Object</code>
<p>The configuration for the Box class.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the box.</p> |
| x | <code>number</code> | <p>The x position of the box.</p> |
| y | <code>number</code> | <p>The y position of the box.</p> |
| [width] | <code>number</code> | <p>The width of the box.</p> |
| [height] | <code>number</code> | <p>The height of the box.</p> |
| [style] | [<code>BoxStyle</code>](#BoxStyle) | <p>The style of the box.</p> |
| [visible] | <code>boolean</code> | <p>If the box is visible.</p> |
| [draggable] | <code>boolean</code> | <p>If the box is draggable.</p> |

<a name="BoxStyle"></a>

## BoxStyle : <code>Object</code>
<p>The style of the box.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [boxed] | <code>boolean</code> | <p>If the box is boxed.</p> |
| [color] | <code>chalk.ForegroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> \| <code>&quot;&quot;</code> | <p>The color of the box.</p> |
| [label] | <code>string</code> | <p>The label of the box.</p> |

<a name="Box"></a>

## Box ⇐ <code>Control</code>
**Kind**: global class  
**Extends**: <code>Control</code>  
<a name="new_Box_new"></a>

### new Box(config)
<p>The class that represents a box.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/215069151-037e28d6-011f-428a-baac-3fe42ac0d540.png" alt="image"></p>
<p>Example of a box containing a list of process running on the computer.</p>


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>BoxConfig</code>](#BoxConfig) | <p>The configuration of the box.</p> |

**Example**  
```tsconst box = new Box({   id: "box",   x: 0,   y: 0,   width: 10,   height: 5,   style: { boxed: true, color: "red", label: "Box" } })box.setContent(new InPageWidgetBuilder(5).addText("Hello World!"))```
