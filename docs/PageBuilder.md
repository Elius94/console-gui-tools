<a name="PageBuilder"></a>

## PageBuilder
**Kind**: global class  

* [PageBuilder](#PageBuilder)
    * [new PageBuilder(rowsPerPage)](#new_PageBuilder_new)
    * _instance_
        * [.addRow(row)](#PageBuilder+addRow) ⇒ [<code>PageBuilder</code>](#PageBuilder)
        * [.addSpacer([count])](#PageBuilder+addSpacer) ⇒ [<code>PageBuilder</code>](#PageBuilder)
        * [.getContent()](#PageBuilder+getContent) ⇒ <code>Array.&lt;Array.&lt;object&gt;&gt;</code>
        * [.getPageHeight()](#PageBuilder+getPageHeight) ⇒ <code>number</code>
        * [.getViewedPageHeight()](#PageBuilder+getViewedPageHeight) ⇒ <code>number</code>
        * [.setScrollIndex(index)](#PageBuilder+setScrollIndex) ⇒ [<code>PageBuilder</code>](#PageBuilder)
        * [.setRowsPerPage(rowsPerPage)](#PageBuilder+setRowsPerPage) ⇒ [<code>PageBuilder</code>](#PageBuilder)
        * [.increaseScrollIndex()](#PageBuilder+increaseScrollIndex) ⇒ [<code>PageBuilder</code>](#PageBuilder)
        * [.decreaseScrollIndex()](#PageBuilder+decreaseScrollIndex) ⇒ [<code>PageBuilder</code>](#PageBuilder)
        * [.clear()](#PageBuilder+clear) ⇒ [<code>PageBuilder</code>](#PageBuilder)
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

### pageBuilder.addRow(row) ⇒ [<code>PageBuilder</code>](#PageBuilder)
<p>Add a new styled row to the page.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  

| Param | Type | Description |
| --- | --- | --- |
| row | <code>parameters.&lt;object&gt;</code> | <p>The styled row to add.</p> |

**Example**  
```js
page.addRow({ text: 'Hello World', color: 'white' })
page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
```
<a name="PageBuilder+addSpacer"></a>

### pageBuilder.addSpacer([count]) ⇒ [<code>PageBuilder</code>](#PageBuilder)
<p>Add an empty row to the page. (like <br /> in HTML)</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [count] | <code>number</code> | <code>1</code> | <p>The number of empty rows to add.</p> |

**Example**  
```js
page.addEmptyRow()
page.addEmptyRow(2)
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

### pageBuilder.setScrollIndex(index) ⇒ [<code>PageBuilder</code>](#PageBuilder)
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

### pageBuilder.setRowsPerPage(rowsPerPage) ⇒ [<code>PageBuilder</code>](#PageBuilder)
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

### pageBuilder.increaseScrollIndex() ⇒ [<code>PageBuilder</code>](#PageBuilder)
<p>Increases the index of the scroll bar.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.increaseScrollIndex()
```
<a name="PageBuilder+decreaseScrollIndex"></a>

### pageBuilder.decreaseScrollIndex() ⇒ [<code>PageBuilder</code>](#PageBuilder)
<p>Decreases the index of the scroll bar.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Example**  
```js
page.increaseScrollIndex()
```
<a name="PageBuilder+clear"></a>

### pageBuilder.clear() ⇒ [<code>PageBuilder</code>](#PageBuilder)
<p>Clears the page.</p>

**Kind**: instance method of [<code>PageBuilder</code>](#PageBuilder)  
**Since**: 1.2.0  
**Example**  
```js
page.clear()
```
<a name="PageBuilder.scrollIndex"></a>

### PageBuilder.scrollIndex : <code>number</code>
<p>The index of the scroll bar.</p>

**Kind**: static constant of [<code>PageBuilder</code>](#PageBuilder)  
<a name="PageBuilder.content"></a>

### PageBuilder.content : <code>Array.&lt;Array.&lt;object&gt;&gt;</code>
<p>The content of the page.</p>

**Kind**: static constant of [<code>PageBuilder</code>](#PageBuilder)  
