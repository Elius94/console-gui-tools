## Classes

<dl>
<dt><a href="#Progress">Progress</a> ⇐ <code>Control</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#drawingChars">drawingChars</a> : <code>Object</code></dt>
<dd><p>The characters used to draw the progress bar.</p></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#ProgressConfig">ProgressConfig</a></dt>
<dd><p>The configuration object for the progress class</p></dd>
<dt><a href="#ProgressStyle">ProgressStyle</a></dt>
<dd><p>Defines the styles and settings for the progress bar</p></dd>
</dl>

<a name="ProgressConfig"></a>

## ProgressConfig
<p>The configuration object for the progress class</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the progress (required)</p> |
| length | <code>number</code> | <p>The length of the progress bar (required)</p> |
| thickness | <code>number</code> | <p>The thickness of the progress bar (required)</p> |
| x | <code>number</code> | <p>The x position of the progress bar (required)</p> |
| y | <code>number</code> | <p>The y position of the progress bar (required)</p> |
| [value] | <code>number</code> | <p>The value of the progress bar (optional)</p> |
| [min] | <code>number</code> | <p>The minimum value of the progress bar (optional)</p> |
| [max] | <code>number</code> | <p>The maximum value of the progress bar (optional)</p> |
| [unit] | <code>string</code> | <p>The unit of the progress bar (optional)</p> |
| [increment] | <code>number</code> | <p>The increment of the progress bar (optional)</p> |
| [label] | <code>string</code> | <p>The label of the progress bar (optional)</p> |
| [style] | [<code>ProgressStyle</code>](#ProgressStyle) | <p>The style of the progress bar (optional)</p> |
| orientation | <code>Orientation</code> | <p>The orientation of the progress bar (required)</p> |
| [interactive] | <code>boolean</code> | <p>Whether the progress bar is interactive (optional)</p> |
| [visible] | <code>boolean</code> | <p>Whether the progress bar is visible (optional)</p> |
| [enabled] | <code>boolean</code> | <p>Whether the progress bar is enabled (optional)</p> |
| [draggable] | <code>boolean</code> | <p>Whether the progress bar is draggable (optional)</p> |

<a name="ProgressStyle"></a>

## ProgressStyle
<p>Defines the styles and settings for the progress bar</p>

**Kind**: global interface  

| Param | Type | Description |
| --- | --- | --- |
| background | <code>BackgroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> | <p>The background color of the progress bar</p> |
| borderColor | <code>ForegroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> | <p>The color of the border</p> |
| [textColor] | <code>ForegroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> | <p>The color of the text</p> |
| color | <code>ForegroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> | <p>The color of the progress bar</p> |
| [theme] | <code>&quot;precision&quot;</code> \| <code>&quot;htop&quot;</code> \| <code>&quot;htop-light&quot;</code> \| <code>&quot;htop-heavy&quot;</code> | <p>The theme to use for the progress bar [&quot;precision&quot;, &quot;htop&quot;, &quot;htop-light&quot;, &quot;htop-heavy&quot;]</p> |
| [boxed] | <code>boolean</code> | <p>Whether or not to draw a box around the progress bar</p> |
| [showPercentage] | <code>boolean</code> | <p>Whether or not to show the percentage</p> |
| [showValue] | <code>boolean</code> | <p>Whether or not to show the value</p> |
| [showMinMax] | <code>boolean</code> | <p>Whether or not to show the min and max values</p> |
| [showTitle] | <code>boolean</code> | <p>Whether or not to show the title</p> |
| [bold] | <code>boolean</code> | <p>Whether or not to bold the text</p> |
| [italic] | <code>boolean</code> | <p>Whether or not to italicize the text</p> |
| [dim] | <code>boolean</code> | <p>Whether or not to dim the text</p> |
| [underline] | <code>boolean</code> | <p>Whether or not to underline the text</p> |
| [inverse] | <code>boolean</code> | <p>Whether or not to inverse the text</p> |
| [hidden] | <code>boolean</code> | <p>Whether or not to hide the text</p> |
| [strikethrough] | <code>boolean</code> | <p>Whether or not to strikethrough the text</p> |
| [overline] | <code>boolean</code> | <p>Whether or not to overline the text</p> |

<a name="Progress"></a>

## Progress ⇐ <code>Control</code>
**Kind**: global class  
**Extends**: <code>Control</code>  
<a name="new_Progress_new"></a>

### new Progress(config)
<p>This class is an overload of Control that is used to create a Progress bar.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/203602965-b66f9eb0-c7a1-4caa-947a-a140badeddc2.gif" alt="Progress"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;valueChanged&quot; when the user changes the value of the progress bar with the scroll wheel (if interactive is true).</li>
<li>&quot;click&quot; when the user clicks on the progress bar (if interactive is true).</li>
<li>&quot;relese&quot; when the user releases the mouse button on the progress bar (if interactive is true).</li>
<li>&quot;rightClick&quot; when the user clicks on the progress bar with right button (if interactive is true).</li>
<li>&quot;rightRelese&quot; when the user releases the right mouse button on the progress bar (if interactive is true).</li>
</ul>
<h3>Example of interactive progress bar</h3>
<p><img src="https://user-images.githubusercontent.com/14907987/203607512-6ce3656c-7ffb-4185-b36e-6c10619b2b6e.gif" alt="Progress_Interactive"></p>


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>ProgressConfig</code>](#ProgressConfig) | <p>The configuration object for the progress bar</p> |

**Example**  
```js const pStyle = {     boxed: true,     showTitle: true,     showValue: true,     showPercentage: true,     showMinMax: false, } const p = new Progress({     id: "prog1",      x: 10, y: 2,     style: pStyle,      theme: "htop",     length: 25,     label: "Mem" }) const incr = setInterval(() => {     const value = p.getValue() + 0.25     p.setValue(value)     if (value >= p.getMax()) {         clearInterval(incr)     } }, 100) const p1Style = {     background: "bgBlack",     borderColor: "yellow",     color: "green",     boxed: true,     showTitle: true,     showValue: true,     showPercentage: true,     showMinMax: true, } const p1 = new Progress({     id: "prog1",      x: 10, y: 4,     style: pStyle,      theme: "precision",     length: 25,     label: "Precision" }) const incr1 = setInterval(() => {     const value = p1.getValue() + 0.25     p1.setValue(value)     if (value >= p1.getMax()) {         clearInterval(incr1)     } }, 100) const p2Style = {     background: "bgBlack",     borderColor: "yellow",     color: "magenta",     boxed: true,     showTitle: true,     showValue: true,     showPercentage: true,     showMinMax: true, } const p2 = new Progress({     id: "prog3",      x: 10, y: 6,     style: pStyle,      theme: "precision",     length: 25,     label: "Interactive",     direction: "vertical",     interactive: true, }) p2.on("valueChanged", (value) => {     console.log(`Value changed: ${value}`) })```
<a name="drawingChars"></a>

## drawingChars : <code>Object</code>
<p>The characters used to draw the progress bar.</p>

**Kind**: global constant  
