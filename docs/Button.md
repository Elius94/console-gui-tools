## Classes

<dl>
<dt><a href="#Button">Button</a> ⇐ <code>Control</code></dt>
<dd></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#ButtonConfig">ButtonConfig</a></dt>
<dd><p>The configuration object for the Button class</p></dd>
<dt><a href="#ButtonKey">ButtonKey</a></dt>
<dd><p>The configuration object for the ButtonKey class</p></dd>
<dt><a href="#ButtonStyle">ButtonStyle</a></dt>
<dd><p>The configuration object for the ButtonStyle class</p></dd>
</dl>

<a name="ButtonConfig"></a>

## ButtonConfig
<p>The configuration object for the Button class</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the button (required)</p> |
| text | <code>string</code> | <p>The text of the button (if not specified, it will be &quot;TEXT&quot;)</p> |
| width | <code>number</code> | <p>The width of the button (if not specified, it will be the length of the text + 4)</p> |
| height | <code>number</code> | <p>The height of the button (if not specified, it will be 3)</p> |
| x | <code>number</code> | <p>The x position of the button (required)</p> |
| y | <code>number</code> | <p>The y position of the button (required)</p> |
| style | [<code>ButtonStyle</code>](#ButtonStyle) | <p>The style of the button (if not specified, it will be { background: &quot;bgBlack&quot;, borderColor: &quot;white&quot;, color: &quot;white&quot;, bold: true })</p> |
| key | [<code>ButtonKey</code>](#ButtonKey) | <p>The key to press to trigger the button</p> |
| onClick | <code>function</code> | <p>The function to call when the button is clicked</p> |
| onRelease | <code>function</code> | <p>The function to call when the button is released</p> |
| visible | <code>boolean</code> | <p>If the button is visible or not (default: true)</p> |
| enabled | <code>boolean</code> | <p>If the button is enabled or not (default: true)</p> |
| draggable | <code>boolean</code> | <p>If the button is draggable or not (default: false)</p> |

<a name="ButtonKey"></a>

## ButtonKey
<p>The configuration object for the ButtonKey class</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>The name of the key (required)</p> |
| ctrl | <code>boolean</code> | <p>If the key is pressed with the ctrl key (default: false)</p> |
| shift | <code>boolean</code> | <p>If the key is pressed with the shift key (default: false)</p> |

<a name="ButtonStyle"></a>

## ButtonStyle
<p>The configuration object for the ButtonStyle class</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| background | <code>BackgroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> \| <code>&quot;&quot;</code> | <p>The background color of the button (if not specified, it will be &quot;bgBlack&quot;)</p> |
| borderColor | <code>ForegroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> \| <code>&quot;&quot;</code> | <p>The border color of the button (if not specified, it will be &quot;white&quot;)</p> |
| color | <code>ForegroundColorName</code> \| <code>HEX</code> \| <code>RGB</code> \| <code>&quot;&quot;</code> | <p>The text color of the button (if not specified, it will be &quot;white&quot;)</p> |
| bold | <code>boolean</code> | <p>If the text is bold or not (default: true)</p> |
| italic | <code>boolean</code> | <p>If the text is italic or not (default: false)</p> |
| dim | <code>boolean</code> | <p>If the text is dim or not (default: false)</p> |
| underline | <code>boolean</code> | <p>If the text is underlined or not (default: false)</p> |
| inverse | <code>boolean</code> | <p>If the text is inverted or not (default: false)</p> |
| hidden | <code>boolean</code> | <p>If the text is hidden or not (default: false)</p> |
| strikethrough | <code>boolean</code> | <p>If the text is strikethrough or not (default: false)</p> |
| overline | <code>boolean</code> | <p>If the text is overlined or not (default: false)</p> |

<a name="Button"></a>

## Button ⇐ <code>Control</code>
**Kind**: global class  
**Extends**: <code>Control</code>  
<a name="new_Button_new"></a>

### new Button(config)
<p>This class is an overload of Control that is used to create a button.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/202866824-047503fc-9af6-4990-aa9a-57a3d691f6b0.gif" alt="Button"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;click&quot; when the user confirm</li>
<li>&quot;relese&quot; when the user cancel</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>ButtonConfig</code>](#ButtonConfig) | <p>The configuration object</p> |

**Example**  
```js
new Button({
        id: "btnRun", 
        text: "Run me!", 
        x: 21, 
        y: 18,
        style: {
            color: "magentaBright",
            bold: true,
            italic: true,
            borderColor: "green"
        },
        onRelease: () => {
            GUI.log("Button clicked!")
        },
        draggable: true,
    })
```
