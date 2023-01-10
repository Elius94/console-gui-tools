<a name="Button"></a>

## Button ⇐ <code>Control</code>
**Kind**: global class  
**Extends**: <code>Control</code>  
<a name="new_Button_new"></a>

### new Button(id, text, width, height, x, y, style, key, onClick, onRelease, visible, enabled)
<p>This class is an overload of Control that is used to create a button.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/202866824-047503fc-9af6-4990-aa9a-57a3d691f6b0.gif" alt="Button"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;click&quot; when the user confirm</li>
<li>&quot;relese&quot; when the user cancel</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the button.</p> |
| text | <code>string</code> | <p>The text of the button.</p> |
| width | <code>number</code> | <p>The width of the button.</p> |
| height | <code>number</code> | <p>The height of the button.</p> |
| x | <code>number</code> | <p>The x position of the button.</p> |
| y | <code>number</code> | <p>The y position of the button.</p> |
| style | <code>ButtonStyle</code> | <p>To set the style of the button.</p> |
| key | <code>ButtonKey</code> \| <code>undefined</code> | <p>To set a key to press to click the button.</p> |
| onClick | <code>function</code> | <p>The function to call when the button is clicked.</p> |
| onRelease | <code>function</code> | <p>The function to call when the button is released.</p> |
| visible | <code>boolean</code> | <p>If the button is visible. Default is true (make it hide using hide()).</p> |
| enabled | <code>boolean</code> | <p>If the button is enabled. Default is true (make it disabled using disable()).</p> |

**Example**  
```js
new Button("btnRun", "Run me!", 10, 3, 21, 18, 
     { 
         color: "magentaBright", 
         bold: true, 
         italic: true,
         borderColor: "green"
     },
     () => {
         GUI.log("Button clicked!")
     })
```
