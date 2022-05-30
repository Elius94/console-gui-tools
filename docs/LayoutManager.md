## Classes

<dl>
<dt><a href="#LayoutManager">LayoutManager</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
<dt><a href="#pageTitle">pageTitle</a> : <code>string</code></dt>
<dd><p>The application title.</p></dd>
</dl>

<a name="LayoutManager"></a>

## LayoutManager
**Kind**: global class  

* [LayoutManager](#LayoutManager)
    * [new LayoutManager(pages, options)](#new_LayoutManager_new)
    * [.setPages(pages)](#LayoutManager+setPages)
    * [.setPage(page, index)](#LayoutManager+setPage)
    * [.setTitle(title, index)](#LayoutManager+setTitle)
    * [.setTitles(titles)](#LayoutManager+setTitles)
    * [.setBorder(border)](#LayoutManager+setBorder)
    * [.setSelected(selected)](#LayoutManager+setSelected)
    * [.getSelected()](#LayoutManager+getSelected) ⇒ <code>0</code> \| <code>1</code> \| <code>2</code> \| <code>3</code>
    * [.changeLayout()](#LayoutManager+changeLayout) ⇒ <code>void</code>
    * [.decreaseRatio(quantity)](#LayoutManager+decreaseRatio)
    * [.increaseRatio(quantity)](#LayoutManager+increaseRatio)
    * [.draw()](#LayoutManager+draw) ⇒ <code>void</code>

<a name="new_LayoutManager_new"></a>

### new LayoutManager(pages, options)
<p>This class is a layout that has two pages.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/170999347-868eac7b-6bdf-4147-bcb0-b7465282ed5f.gif" alt="change ratio"></p>


| Param | Type | Description |
| --- | --- | --- |
| pages | <code>Array.&lt;PageBuilder&gt;</code> | <p>The pages that should be shown.</p> |
| options | <code>boolean</code> | <p>Layout options.</p> |

**Example**  
```js
const layout = new LayoutManager([page1, page2], pageOptions);
```
<a name="LayoutManager+setPages"></a>

### layoutManager.setPages(pages)
<p>This function is used to update the layout pages.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| pages | <code>Array.&lt;PageBuilder&gt;</code> | <p>The pages that should be shown.</p> |

**Example**  
```js
layout.updatePages([page1, page2])
```
**Example**  
```js
layout.updatePages([page1, page2, page3])
```
<a name="LayoutManager+setPage"></a>

### layoutManager.setPage(page, index)
<p>This function is used to overwrite the page content.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |
| index | <code>number</code> | <p>the index of the page</p> |

<a name="LayoutManager+setTitle"></a>

### layoutManager.setTitle(title, index)
<p>This function is used to update the page title.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | <p>The title of the page.</p> |
| index | <code>number</code> | <p>The index of the page.</p> |

**Example**  
```js
layout.setTitle("Page Title", 1)
```
<a name="LayoutManager+setTitles"></a>

### layoutManager.setTitles(titles)
<p>This function is used to update the page titles.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| titles | <code>Array.&lt;string&gt;</code> | <p>The titles of the pages.</p> |

**Example**  
```js
layout.setTitles(["Page Title 1", "Page Title 2"])
```
<a name="LayoutManager+setBorder"></a>

### layoutManager.setBorder(border)
<p>This function is used to enable or disable the layout border.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| border | <code>boolean</code> | <p>enable or disable the border</p> |

<a name="LayoutManager+setSelected"></a>

### layoutManager.setSelected(selected)
<p>This function is used to choose the page to be highlighted.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>0</code> \| <code>1</code> \| <code>2</code> \| <code>3</code> | <p>0 for page1, 1 for page2</p> |

<a name="LayoutManager+getSelected"></a>

### layoutManager.getSelected() ⇒ <code>0</code> \| <code>1</code> \| <code>2</code> \| <code>3</code>
<p>This function is used to get the selected page.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  
**Returns**: <code>0</code> \| <code>1</code> \| <code>2</code> \| <code>3</code> - <p>0 for page1, 1 for page2, 2 for page3, 3 for page4</p>  
<a name="LayoutManager+changeLayout"></a>

### layoutManager.changeLayout() ⇒ <code>void</code>
<p>This function is used to get switch the selected page. If the layout is a single layout, it will do nothing.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  
<a name="LayoutManager+decreaseRatio"></a>

### layoutManager.decreaseRatio(quantity)
<p>This function is used to decrease the row ratio between the pages in the selected row. This is propagated to the layout instance.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>quantity</code> | <p>The amount of aspect ratio to be decreased.</p> |

**Example**  
```js
layout.decreaseRowRatio(0.01)
```
<a name="LayoutManager+increaseRatio"></a>

### layoutManager.increaseRatio(quantity)
<p>This function is used to increase the row ratio between the pages in the selected row. This is propagated to the layout instance.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  

| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>quantity</code> | <p>The amount of aspect ratio to be increased.</p> |

**Example**  
```js
layout.increaseRowRatio(0.01)
```
<a name="LayoutManager+draw"></a>

### layoutManager.draw() ⇒ <code>void</code>
<p>This function is used to draw the layout to the screen.</p>

**Kind**: instance method of [<code>LayoutManager</code>](#LayoutManager)  
**Example**  
```js
layout.draw()
```
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
<a name="pageTitle"></a>

## pageTitle : <code>string</code>
<p>The application title.</p>

**Kind**: global constant  
