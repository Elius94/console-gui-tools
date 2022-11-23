<a name="Progress"></a>

## Progress ⇐ <code>Control</code>
**Kind**: global class  
**Extends**: <code>Control</code>  
<a name="new_Progress_new"></a>

### new Progress(id, length, thickness, x, y, style, theme, orientation, interactive, visible, enabled)
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
| id | <code>string</code> | <p>The id of the Progress.</p> |
| length | <code>number</code> | <p>The length of the Progress.</p> |
| thickness | <code>number</code> | <p>The thickness of the Progress.</p> |
| x | <code>number</code> | <p>The x position of the Progress.</p> |
| y | <code>number</code> | <p>The y position of the Progress.</p> |
| style | <code>ProgressStyle</code> | <p>The style of the Progress.</p> |
| theme | <code>string</code> | <p>The theme of the Progress.</p> |
| orientation | <code>string</code> | <p>The orientation of the Progress.</p> |
| interactive | <code>boolean</code> | <p>If the Progress is interactive.</p> |
| visible | <code>boolean</code> | <p>If the Progress is visible.</p> |
| enabled | <code>boolean</code> | <p>If the Progress is enabled.</p> |

**Example**  
```js const pStyle = {     boxed: true,     showTitle: true,     showValue: true,     showPercentage: true,     showMinMax: false, } const p = new Progress("prog1", 20, 1, 3, 23, pStyle, "htop", "horizontal") p.setText("Mem") const incr = setInterval(() => {     const value = p.getValue() + 0.25     p.setValue(value)     if (value >= p.getMax()) {         clearInterval(incr)     } }, 100) const p1Style = {     background: "bgBlack",     borderColor: "yellow",     color: "green",     boxed: true,     showTitle: true,     showValue: true,     showPercentage: true,     showMinMax: true, } const p1 = new Progress("prog2", 25, 2, 3, 25, p1Style, "precision", "horizontal") p1.setText("Precision") const incr1 = setInterval(() => {     const value = p1.getValue() + 0.25     p1.setValue(value)     if (value >= p1.getMax()) {         clearInterval(incr1)     } }, 100) const p2Style = {     background: "bgBlack",     borderColor: "yellow",     color: "magenta",     boxed: true,     showTitle: true,     showValue: true,     showPercentage: true,     showMinMax: true, } const p2 = new Progress("prog3", 25, 2, 3, 31, p2Style, "precision", "horizontal", true) p2.setText("Interactive") p2.on("valueChanged", (value) => {     console.log(`Value changed: ${value}`) })```
