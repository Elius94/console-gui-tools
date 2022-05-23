## Classes

<dl>
<dt><a href="#PageBuilder">PageBuilder</a></dt>
<dd></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#StyleObject">StyleObject</a> : <code>Object</code></dt>
<dd><p>The type containing all the possible styles for the text.</p></dd>
<dt><a href="#StyledElement">StyledElement</a> : <code>Object</code></dt>
<dd><p>The type of the single styled text, stored in a line of the PageBuilder.</p></dd>
<dt><a href="#SimplifiedStyledElement">SimplifiedStyledElement</a> : <code>Object</code></dt>
<dd><p>The type containing all the possible styles for the text and the text on the same level. It's used on the higher level.</p></dd>
</dl>

<a name="StyleObject"></a>

## StyleObject : <code>Object</code>
<p>The type containing all the possible styles for the text.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [color] | <code>chalk.ForegroundColor</code> \| <code>&quot;&quot;</code> | <p>The color of the text taken from the chalk library.</p> |
| [backgroundColor] | <code>chalk.BackgroundColor</code> \| <code>&quot;&quot;</code> | <p>The background color of the text taken from the chalk library.</p> |
| [italic] | <code>boolean</code> | <p>If the text is italic.</p> |
| [bold] | <code>boolean</code> | <p>If the text is bold.</p> |
| [dim] | <code>boolean</code> | <p>If the text is dim.</p> |
| [underline] | <code>boolean</code> | <p>If the text is underlined.</p> |
| [inverse] | <code>boolean</code> | <p>If the text is inverse.</p> |
| [hidden] | <code>boolean</code> | <p>If the text is hidden.</p> |
| [strikethrough] | <code>boolean</code> | <p>If the text is strikethrough.</p> |
| [overline] | <code>boolean</code> | <p>If the text is overlined.</p> |

**Example**  
```js
const textStyle = { color: "red", backgroundColor: "blue", bold: true, italic: true }
```
<a name="StyledElement"></a>

## StyledElement : <code>Object</code>
<p>The type of the single styled text, stored in a line of the PageBuilder.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | <p>The text of the styled text.</p> |
| style | [<code>StyleObject</code>](#StyleObject) | <p>The style of the styled text.</p> |

**Example**  
```js
const styledText = { text: "Hello", style: { color: "red", backgroundColor: "blue", bold: true, italic: true } }
```
<a name="SimplifiedStyledElement"></a>

## SimplifiedStyledElement : <code>Object</code>
<p>The type containing all the possible styles for the text and the text on the same level. It's used on the higher level.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | <p>The text of the styled text.</p> |
| [color] | <code>chalk.ForegroundColor</code> \| <code>&quot;&quot;</code> | <p>The color of the text taken from the chalk library.</p> |
| [backgroundColor] | <code>chalk.BackgroundColor</code> \| <code>&quot;&quot;</code> | <p>The background color of the text taken from the chalk library.</p> |
| [italic] | <code>boolean</code> | <p>If the text is italic.</p> |
| [bold] | <code>boolean</code> | <p>If the text is bold.</p> |
| [dim] | <code>boolean</code> | <p>If the text is dim.</p> |
| [underline] | <code>boolean</code> | <p>If the text is underlined.</p> |
| [inverse] | <code>boolean</code> | <p>If the text is inverse.</p> |
| [hidden] | <code>boolean</code> | <p>If the text is hidden.</p> |
| [strikethrough] | <code>boolean</code> | <p>If the text is strikethrough.</p> |
| [overline] | <code>boolean</code> | <p>If the text is overlined.</p> |

**Example**  
```js
const textStyle = { color: "red", backgroundColor: "blue", bold: true, italic: true }
```
<a name="PageBuilder"></a>

## PageBuilder
**Kind**: global class  

* [PageBuilder](#PageBuilder)
    * [new PageBuilder(rowsPerPage)](#new_PageBuilder_new)
    * _instance_
        * [.addRow(row)](#PageBuilder+addRow) ⇒ <code>void</code>
        * [.addSpacer([count])](#PageBuilder+addSpacer) ⇒ <code>void</code>
        * [.getContent()](#PageBuilder+getContent) ⇒ <code>Array.&lt;Array.&lt;object&gt;&gt;</code>
        * [.getPageHeight()](#PageBuilder+getPageHeight) ⇒ <code>number</code>
        * [.getViewedPageHeight()](#PageBuilder+getViewedPageHeight) ⇒ <code>number</code>
        * [.setScrollIndex(index)](#PageBuilder+setScrollIndex) ⇒ <code>void</code>
        * [.setRowsPerPage(rowsPerPage)](#PageBuilder+setRowsPerPage) ⇒ <code>void</code>
        * [.increaseScrollIndex()](#PageBuilder+increaseScrollIndex) ⇒ <code>void</code>
        * [.decreaseScrollIndex()](#PageBuilder+decreaseScrollIndex) ⇒ <code>void</code>
    * _static_
        * [.scrollIndex](#PageBuilder.scrollIndex) : <code>number</code>
        * [.content](#PageBuilder.content) : <code>Array.&lt;Array.&lt;object&gt;&gt;</code>

<a name="new_PageBuilder_new"></a>

### new PageBuilder(rowsPerPage)
<p>Defines a new page:
It's a sort of collection of styled rows.</p>


| Param | Type | Description |
| --- | --- | --- |
| rowsPerPage | <code>number</code> | <p>The number of rows per page. Default is 100. Useful for scrolling.</p> |

<a name="PageBuilder+addRow"></a>

### pageBuilder.addRow(row) ⇒ <code>void</code>
<p>Add a new styled row to the page.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  

| Param | Type | Description |
| --- | --- | --- |
| row | <code>parameters.&lt;object&gt;</code> | <p>The styled row to add.</p> |

**Example**  
```js
page.addRow({ text: 'Hello World', color: 'white' })page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
```
<a name="PageBuilder+addSpacer"></a>

### pageBuilder.addSpacer([count]) ⇒ <code>void</code>
<p>Add an empty row to the page. (like <br /> in HTML)</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [count] | <code>number</code> | <code>1</code> | <p>The number of empty rows to add.</p> |

**Example**  
```js
page.addEmptyRow()page.addEmptyRow(2)
```
<a name="PageBuilder+getContent"></a>

### pageBuilder.getContent() ⇒ <code>Array.&lt;Array.&lt;object&gt;&gt;</code>
<p>Returns the content of the page.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.getContent()
```
<a name="PageBuilder+getPageHeight"></a>

### pageBuilder.getPageHeight() ⇒ <code>number</code>
<p>Returns the height of the page.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.getPageHeight()
```
<a name="PageBuilder+getViewedPageHeight"></a>

### pageBuilder.getViewedPageHeight() ⇒ <code>number</code>
<p>Returns the height of the viewed page. It excludes the rows that are not visible.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.getViewedPageHeight() // returns the height of the page that is visible
```
<a name="PageBuilder+setScrollIndex"></a>

### pageBuilder.setScrollIndex(index) ⇒ <code>void</code>
<p>Changes the index of the scroll bar.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | <p>The index of the scroll bar.</p> |

**Example**  
```js
page.setScrollIndex(10)
```
<a name="PageBuilder+setRowsPerPage"></a>

### pageBuilder.setRowsPerPage(rowsPerPage) ⇒ <code>void</code>
<p>Changes the number of rows per page.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  

| Param | Type | Description |
| --- | --- | --- |
| rowsPerPage | <code>number</code> | <p>The number of rows per page.</p> |

**Example**  
```js
page.setRowsPerPage(10)
```
<a name="PageBuilder+increaseScrollIndex"></a>

### pageBuilder.increaseScrollIndex() ⇒ <code>void</code>
<p>Increases the index of the scroll bar.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.increaseScrollIndex()
```
<a name="PageBuilder+decreaseScrollIndex"></a>

### pageBuilder.decreaseScrollIndex() ⇒ <code>void</code>
<p>Decreases the index of the scroll bar.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.increaseScrollIndex()
```
<a name="PageBuilder.scrollIndex"></a>

### PageBuilder.scrollIndex : <code>number</code>
<p>The index of the scroll bar.</p>

**Kind**: static constant of [<code>PageBuilder</code>](#PageBuilder)  
<a name="PageBuilder.content"></a>

### PageBuilder.content : <code>Array.&lt;Array.&lt;object&gt;&gt;</code>
<p>The content of the page.</p>

**Kind**: static constant of [<code>PageBuilder</code>](#PageBuilder)  
