# PageBuilder

## Classes

<dl>
<dt><a href="#PageBuilder">PageBuilder</a></dt>
<dd></dd>
<dt><a href="#Screen">Screen</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#width">width</a> : <code>number</code></dt>
<dd><p>The width of the screen.</p>
</dd>
<dt><a href="#height">height</a> : <code>number</code></dt>
<dd><p>The height of the screen.</p>
</dd>
<dt><a href="#buffer">buffer</a> : <code>Array</code></dt>
<dd><p>The screen buffer object.</p>
</dd>
<dt><a href="#cursor">cursor</a> : <code>object</code></dt>
<dd><p>The cursor object.</p>
</dd>
</dl>

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
        * [.setScrollIndex(index)](#PageBuilder+setScrollIndex) ⇒ <code>void</code>
        * [.setRowsPerPage(rowsPerPage)](#PageBuilder+setRowsPerPage) ⇒ <code>void</code>
        * [.increaseScrollIndex()](#PageBuilder+increaseScrollIndex) ⇒ <code>void</code>
        * [.decreaseScrollIndex()](#PageBuilder+decreaseScrollIndex) ⇒ <code>void</code>
    * _static_
        * [.scrollIndex](#PageBuilder.scrollIndex) : <code>number</code>  
        * [.content](#PageBuilder.content) : <code>Array.&lt;Array.&lt;object&gt;&gt;</code>

<a name="new_PageBuilder_new"></a>

### new PageBuilder(rowsPerPage)
It's a sort of collection of styled rows.


| Param | Type | Description |
| --- | --- | --- |
| rowsPerPage | <code>number</code> | The number of rows per page. Default is 100. Useful for scrolling. |

<a name="PageBuilder+addRow"></a>

### pageBuilder.addRow(row) ⇒ <code>void</code>
Add a new styled row to the page.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     

| Param | Type | Description |
| --- | --- | --- |
| row | <code>parameters.&lt;object&gt;</code> | The styled row to add. | 

**Example**
```js
page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
```
<a name="PageBuilder+addSpacer"></a>

### pageBuilder.addSpacer([count]) ⇒ <code>void</code>
Add an empty row to the page. (like <br /> in HTML)

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [count] | <code>number</code> | <code>1</code> | The number of empty rows to add. |

**Example**
```js
page.addEmptyRow(2)
```
<a name="PageBuilder+getContent"></a>

### pageBuilder.getContent() ⇒ <code>Array.&lt;Array.&lt;object&gt;&gt;</code>
Returns the content of the page.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     
**Example**
```js
page.getContent()
```
<a name="PageBuilder+getPageHeight"></a>

### pageBuilder.getPageHeight() ⇒ <code>number</code>
Returns the height of the page.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     
**Example**
```js
page.getPageHeight()
```
<a name="PageBuilder+setScrollIndex"></a>

### pageBuilder.setScrollIndex(index) ⇒ <code>void</code>
Changes the index of the scroll bar.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | The index of the scroll bar. |

**Example**
```js
page.setScrollIndex(10)
```
<a name="PageBuilder+setRowsPerPage"></a>

### pageBuilder.setRowsPerPage(rowsPerPage) ⇒ <code>void</code>
Changes the number of rows per page.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     

| Param | Type | Description |
| --- | --- | --- |
| rowsPerPage | <code>number</code> | The number of rows per page. |      

**Example**
```js
page.setRowsPerPage(10)
```
<a name="PageBuilder+increaseScrollIndex"></a>

### pageBuilder.increaseScrollIndex() ⇒ <code>void</code>
Increases the index of the scroll bar.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     
**Example**
```js
page.increaseScrollIndex()
```
<a name="PageBuilder+decreaseScrollIndex"></a>

### pageBuilder.decreaseScrollIndex() ⇒ <code>void</code>
Decreases the index of the scroll bar.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)     
**Example**
```js
page.increaseScrollIndex()
```
<a name="PageBuilder.scrollIndex"></a>

### PageBuilder.scrollIndex : <code>number</code>
The index of the scroll bar.

**Kind**: static constant of [<code>PageBuilder</code>](#PageBuilder)     
<a name="PageBuilder.content"></a>

### PageBuilder.content : <code>Array.&lt;Array.&lt;object&gt;&gt;</code> 
The content of the page.

**Kind**: static constant of [<code>PageBuilder</code>](#PageBuilder)     

# Screen

<a name="Screen"></a>

## Screen ⇐ <code>EventEmitter</code>
**Kind**: global class
**Extends**: <code>EventEmitter</code>

* [Screen](#Screen) ⇐ <code>EventEmitter</code>
    * [new Screen(Terminal)](#new_Screen_new)
    * [.write(row)](#Screen+write) ⇒ <code>void</code>
    * [.cursorTo(x, y)](#Screen+cursorTo) ⇒ <code>void</code>
    * [.moveCursor(x, y)](#Screen+moveCursor) ⇒ <code>void</code>
    * [.update()](#Screen+update) ⇒ <code>void</code>
    * [.print()](#Screen+print) ⇒ <code>void</code>
    * [.replaceAt(str, index, replacement)](#Screen+replaceAt) ⇒ <code>string</code>
    * [.mergeStyles(newStyleIndex, currentStyleIndex, startIndex, newSize)](#Screen+mergeStyles) ⇒ <code>Array.&lt;object&gt;</code>
    * [.sortByIndex(a, b)](#Screen+sortByIndex) ⇒ <code>number</code>     

<a name="new_Screen_new"></a>

### new Screen(Terminal)
This class is used to manage the screen buffer.


| Param | Type | Description |
| --- | --- | --- |
| Terminal | <code>object</code> | The terminal object (process.stdout). |

**Example**
```js
const screen = new Screen(process.stdout)
```
<a name="Screen+write"></a>

### screen.write(row) ⇒ <code>void</code>
This method is used to write or overwrite a row in the screen buffer at a specific position.

**Kind**: instance method of [<code>Screen</code>](#Screen)

| Param | Type | Description |
| --- | --- | --- |
| row | <code>arguments.&lt;object&gt;</code> | The row to write. |       

**Example**
```js
screen.write({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
```
<a name="Screen+cursorTo"></a>

### screen.cursorTo(x, y) ⇒ <code>void</code>
This method is used to change the cursor position.

**Kind**: instance method of [<code>Screen</code>](#Screen)

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x position. |
| y | <code>number</code> | The y position. |

**Example**
```js
screen.cursorTo(0, 0)
```
<a name="Screen+moveCursor"></a>

### screen.moveCursor(x, y) ⇒ <code>void</code>
This method is used to change the Terminal cursor position.

**Kind**: instance method of [<code>Screen</code>](#Screen)

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x position. |
| y | <code>number</code> | The y position. |

**Example**
```js
screen.moveCursor(0, 0)
```
<a name="Screen+update"></a>

### screen.update() ⇒ <code>void</code>
This method is used to clear the screen. It fills the screen buffer with empty rows with the size of the screen.

**Kind**: instance method of [<code>Screen</code>](#Screen)
**Example**
```js
screen.clear()
```
<a name="Screen+print"></a>

### screen.print() ⇒ <code>void</code>
This method is used to print the screen buffer to the terminal. It also converts the styles to the terminal format using Chalk.

**Kind**: instance method of [<code>Screen</code>](#Screen)  
**Example**
```js
screen.print()
```
<a name="Screen+replaceAt"></a>

### screen.replaceAt(str, index, replacement) ⇒ <code>string</code>       
This method is used to insert a substring into a string at a specific position.

**Kind**: instance method of [<code>Screen</code>](#Screen)

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to insert into. |
| index | <code>number</code> | The position to insert the substring. |   
| replacement | <code>string</code> | The substring to insert. |

**Example**
```js
screen.replaceAt('Hello Luca', 6, 'Elia') // returns 'Hello Elia'
```
<a name="Screen+mergeStyles"></a>

### screen.mergeStyles(newStyleIndex, currentStyleIndex, startIndex, newSize) ⇒ <code>Array.&lt;object&gt;</code>
This method is used to merge two styleIndex arrays into one. It also recalculates the indexes for the new row.

**Kind**: instance method of [<code>Screen</code>](#Screen)

| Param | Type | Description |
| --- | --- | --- |
| newStyleIndex | <code>Array.&lt;object&gt;</code> | The new styleIndex array. |
| currentStyleIndex | <code>Array.&lt;object&gt;</code> | The current styleIndex array. |
| startIndex | <code>number</code> | The start index of the new styleIndex array (Usually the cursor.x). |
| newSize | <code>number</code> | The new size of the string. |

**Example**
```js
screen.mergeStyles([{ color: 'red', bg: 'black', italic: false, bold: false, index: [0, 5] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [6, 10] }], [{ color: 'magenta', bg: 'black', italic: false, breturns [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 4] }, { color: 'red', bg: 'black', italic: false, bold: false, index: [5, 10] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [11, 15] }, { color: 'magenta', bg: 'black', italic: false, bold: false, index: [16, 30] }]
```
<a name="Screen+sortByIndex"></a>

### screen.sortByIndex(a, b) ⇒ <code>number</code>
This method is used to sort an array of styleIndex objects by child index[0].

**Kind**: instance method of [<code>Screen</code>](#Screen)

| Param | Type | Description |
| --- | --- | --- |
| a | <code>object</code> | The first object to compare. |
| b | <code>object</code> | The second object to compare. |

**Example**
```js
merged.sort(this.sortByIndex)
```
<a name="width"></a>

## width : <code>number</code>
The width of the screen.

**Kind**: global constant
<a name="height"></a>

## height : <code>number</code>
The height of the screen.

**Kind**: global constant
<a name="buffer"></a>

## buffer : <code>Array</code>
The screen buffer object.

**Kind**: global constant
<a name="cursor"></a>

## cursor : <code>object</code>
The cursor object.

**Kind**: global constant

