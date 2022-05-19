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
Defines a new page:It's a sort of collection of styled rows.


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
page.addRow({ text: 'Hello World', color: 'white' })page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
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
page.addEmptyRow()page.addEmptyRow(2)
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
<a name="PageBuilder+getViewedPageHeight"></a>

### pageBuilder.getViewedPageHeight() ⇒ <code>number</code>
Returns the height of the viewed page. It excludes the rows that are not visible.

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.getViewedPageHeight() // returns the height of the page that is visible
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
