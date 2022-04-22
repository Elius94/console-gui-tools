## Classes

<dl>
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
screen.write({ text: 'Hello World', color: 'white' })screen.write({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
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
screen.mergeStyles([{ color: 'red', bg: 'black', italic: false, bold: false, index: [0, 5] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [6, 10] }], [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 30] }], 5, 15)returns [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 4] }, { color: 'red', bg: 'black', italic: false, bold: false, index: [5, 10] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [11, 15] }, { color: 'magenta', bg: 'black', italic: false, bold: false, index: [16, 30] }]
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
