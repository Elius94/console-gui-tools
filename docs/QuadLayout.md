## Classes

<dl>
<dt><a href="#QuadLayout">QuadLayout</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
<dt><a href="#page1Title">page1Title</a> : <code>string</code></dt>
<dd><p>The application title.</p></dd>
<dt><a href="#page2Title">page2Title</a> : <code>string</code></dt>
<dd><p>The title of page2.</p></dd>
<dt><a href="#page3Title">page3Title</a> : <code>string</code></dt>
<dd><p>The title of page3.</p></dd>
<dt><a href="#page4Title">page4Title</a> : <code>string</code></dt>
<dd><p>The title of page4.</p></dd>
</dl>

<a name="QuadLayout"></a>

## QuadLayout
**Kind**: global class  

* [QuadLayout](#QuadLayout)
    * [new QuadLayout(page1, page2, page3, page4, options, selected)](#new_QuadLayout_new)
    * [.setPage(page)](#QuadLayout+setPage)
    * [.setPage1(page)](#QuadLayout+setPage1)
    * [.setPage2(page)](#QuadLayout+setPage2)
    * [.setPage3(page)](#QuadLayout+setPage3)
    * [.setPage4(page)](#QuadLayout+setPage4)
    * [.setTitles(titles)](#QuadLayout+setTitles)
    * [.setTitle(title, index)](#QuadLayout+setTitle)
    * [.setBorder(border)](#QuadLayout+setBorder)
    * [.setSelected(selected)](#QuadLayout+setSelected)
    * [.getSelected()](#QuadLayout+getSelected) ⇒ <code>number</code>
    * [.changeLayout()](#QuadLayout+changeLayout) ⇒ <code>void</code>
    * [.setRatio(ratio)](#QuadLayout+setRatio)
    * [.increaseRatio(quantity)](#QuadLayout+increaseRatio)
    * [.decreaseRatio(quantity)](#QuadLayout+decreaseRatio)
    * [.drawLine(line, secondLine, row)](#QuadLayout+drawLine) ⇒ <code>void</code>
    * [.draw()](#QuadLayout+draw) ⇒ <code>void</code>

<a name="new_QuadLayout_new"></a>

### new QuadLayout(page1, page2, page3, page4, options, selected)
<p>This class is a layout that has two pages.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/170998201-59880c90-7b1a-491a-8a45-6610e5c33de9.png" alt="quad layout"></p>


| Param | Type | Description |
| --- | --- | --- |
| page1 | <code>PageBuilder</code> | <p>The first page.</p> |
| page2 | <code>PageBuilder</code> | <p>The second page.</p> |
| page3 | <code>PageBuilder</code> | <p>The third page.</p> |
| page4 | <code>PageBuilder</code> | <p>The fourth page.</p> |
| options | <code>boolean</code> | <p>Layout options.</p> |
| selected | <code>number</code> | <p>The selected page.</p> |

**Example**  
```js
const layout = new QuadLayout(page1, page2, true, 0)
```
<a name="QuadLayout+setPage"></a>

### quadLayout.setPage(page)
<p>This function is used to overwrite the page content.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="QuadLayout+setPage1"></a>

### quadLayout.setPage1(page)
<p>This function is used to overwrite the first page content.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="QuadLayout+setPage2"></a>

### quadLayout.setPage2(page)
<p>This function is used to overwrite the second page content.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="QuadLayout+setPage3"></a>

### quadLayout.setPage3(page)
<p>This function is used to overwrite the third page content.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="QuadLayout+setPage4"></a>

### quadLayout.setPage4(page)
<p>This function is used to overwrite the forth page content.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="QuadLayout+setTitles"></a>

### quadLayout.setTitles(titles)
<p>This function is used to set the page titles.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| titles | <code>Array.&lt;string&gt;</code> | <p>the titles of the pages</p> |

**Example**  
```js
layout.setTitles(["Page 1", "Page 2", "Page 3", "Page 4"])
```
<a name="QuadLayout+setTitle"></a>

### quadLayout.setTitle(title, index)
<p>This function is used to set the page title at the given index.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | <p>the title of the page</p> |
| index | <code>number</code> | <p>the index of the page</p> |

**Example**  
```js
layout.setTitle("Page 1", 0)
```
<a name="QuadLayout+setBorder"></a>

### quadLayout.setBorder(border)
<p>This function is used to enable or disable the layout border.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| border | <code>boolean</code> | <p>enable or disable the border</p> |

<a name="QuadLayout+setSelected"></a>

### quadLayout.setSelected(selected)
<p>This function is used to choose the page to be highlighted.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>number</code> | <p>0 for page1, 1 for page2</p> |

<a name="QuadLayout+getSelected"></a>

### quadLayout.getSelected() ⇒ <code>number</code>
<p>This function is used to get the selected page.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  
**Returns**: <code>number</code> - <p>0 for page1, 1 for page2</p>  
<a name="QuadLayout+changeLayout"></a>

### quadLayout.changeLayout() ⇒ <code>void</code>
<p>This function is used to get switch the selected page.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  
<a name="QuadLayout+setRatio"></a>

### quadLayout.setRatio(ratio)
<p>This function is used to change the page ratio.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| ratio | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | <p>the ratio of pages</p> |

**Example**  
```js
layout.setRatio([[0.4, 0.6], [0.5, 0.5]])
```
<a name="QuadLayout+increaseRatio"></a>

### quadLayout.increaseRatio(quantity)
<p>This function is used to increase the page ratio of the selected row by the given ratio to add.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>number</code> | <p>the ratio to add</p> |

**Example**  
```js
layout.increaseRatio(0.01)
```
<a name="QuadLayout+decreaseRatio"></a>

### quadLayout.decreaseRatio(quantity)
<p>This function is used to decrease the page ratio of the selected row by the given ratio to add.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>number</code> | <p>the ratio to subtract</p> |

**Example**  
```js
layout.decreaseRatio(0.01)
```
<a name="QuadLayout+drawLine"></a>

### quadLayout.drawLine(line, secondLine, row) ⇒ <code>void</code>
<p>This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| line | <code>Array.&lt;StyledElement&gt;</code> |  | <p>the line to be drawn</p> |
| secondLine | <code>Array.&lt;StyledElement&gt;</code> |  | <p>the line to be drawn</p> |
| row | <code>number</code> | <code>0</code> | <p>the row of the quad grid to be drawn</p> |

<a name="QuadLayout+draw"></a>

### quadLayout.draw() ⇒ <code>void</code>
<p>This function is used to draw the layout to the screen.</p>

**Kind**: instance method of [<code>QuadLayout</code>](#QuadLayout)  
**Example**  
```js
layout.draw()
```
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
<a name="page1Title"></a>

## page1Title : <code>string</code>
<p>The application title.</p>

**Kind**: global constant  
<a name="page2Title"></a>

## page2Title : <code>string</code>
<p>The title of page2.</p>

**Kind**: global constant  
<a name="page3Title"></a>

## page3Title : <code>string</code>
<p>The title of page3.</p>

**Kind**: global constant  
<a name="page4Title"></a>

## page4Title : <code>string</code>
<p>The title of page4.</p>

**Kind**: global constant  
