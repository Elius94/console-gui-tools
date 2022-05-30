## Classes

<dl>
<dt><a href="#DoubleLayout">DoubleLayout</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
<dt><a href="#page2Title">page2Title</a> : <code>string</code></dt>
<dd><p>The title of page2.</p></dd>
<dt><a href="#page1Title">page1Title</a> : <code>string</code></dt>
<dd><p>The application title.</p></dd>
</dl>

<a name="DoubleLayout"></a>

## DoubleLayout
**Kind**: global class  

* [DoubleLayout](#DoubleLayout)
    * [new DoubleLayout(page1, page2, options, selected)](#new_DoubleLayout_new)
    * [.setPage(page)](#DoubleLayout+setPage)
    * [.setPage1(page)](#DoubleLayout+setPage1)
    * [.setPage2(page)](#DoubleLayout+setPage2)
    * [.setTitles(titles)](#DoubleLayout+setTitles)
    * [.setTitle(title, index)](#DoubleLayout+setTitle)
    * [.setBorder(border)](#DoubleLayout+setBorder)
    * [.setSelected(selected)](#DoubleLayout+setSelected)
    * [.getSelected()](#DoubleLayout+getSelected) ⇒ <code>number</code>
    * [.changeLayout()](#DoubleLayout+changeLayout) ⇒ <code>void</code>
    * [.drawLine(line, lineIndex)](#DoubleLayout+drawLine) ⇒ <code>void</code>
    * [.draw()](#DoubleLayout+draw) ⇒ <code>void</code>

<a name="new_DoubleLayout_new"></a>

### new DoubleLayout(page1, page2, options, selected)
<p>This class is a layout that has two pages.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/170996957-cb28414b-7be2-4aa0-938b-f6d1724cfa4c.png" alt="double layout"></p>


| Param | Type | Description |
| --- | --- | --- |
| page1 | <code>PageBuilder</code> | <p>The first page.</p> |
| page2 | <code>PageBuilder</code> | <p>The second page.</p> |
| options | <code>boolean</code> | <p>Layout options.</p> |
| selected | <code>number</code> | <p>The selected page.</p> |

**Example**  
```js
const layout = new DoubleLayout(page1, page2, true, 0)
```
<a name="DoubleLayout+setPage"></a>

### doubleLayout.setPage(page)
<p>This function is used to overwrite the page content.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="DoubleLayout+setPage1"></a>

### doubleLayout.setPage1(page)
<p>This function is used to overwrite the page content.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="DoubleLayout+setPage2"></a>

### doubleLayout.setPage2(page)
<p>This function is used to overwrite the page content.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="DoubleLayout+setTitles"></a>

### doubleLayout.setTitles(titles)
<p>This function is used to set the page titles.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| titles | <code>Array.&lt;string&gt;</code> | <p>the titles of the pages</p> |

**Example**  
```js
layout.setTitles(["Page 1", "Page 2"])
```
<a name="DoubleLayout+setTitle"></a>

### doubleLayout.setTitle(title, index)
<p>This function is used to set the page title at the given index.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | <p>the title of the page</p> |
| index | <code>number</code> | <p>the index of the page</p> |

**Example**  
```js
layout.setTitle("Page 1", 0)
```
<a name="DoubleLayout+setBorder"></a>

### doubleLayout.setBorder(border)
<p>This function is used to enable or disable the layout border.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| border | <code>boolean</code> | <p>enable or disable the border</p> |

<a name="DoubleLayout+setSelected"></a>

### doubleLayout.setSelected(selected)
<p>This function is used to choose the page to be highlighted.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>number</code> | <p>0 for page1, 1 for page2</p> |

<a name="DoubleLayout+getSelected"></a>

### doubleLayout.getSelected() ⇒ <code>number</code>
<p>This function is used to get the selected page.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  
**Returns**: <code>number</code> - <p>0 for page1, 1 for page2</p>  
<a name="DoubleLayout+changeLayout"></a>

### doubleLayout.changeLayout() ⇒ <code>void</code>
<p>This function is used to get switch the selected page.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  
<a name="DoubleLayout+drawLine"></a>

### doubleLayout.drawLine(line, lineIndex) ⇒ <code>void</code>
<p>This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Array.&lt;StyledElement&gt;</code> | <p>the line to be drawn</p> |
| lineIndex | <code>number</code> | <p>the index of the selected line</p> |

<a name="DoubleLayout+draw"></a>

### doubleLayout.draw() ⇒ <code>void</code>
<p>This function is used to draw the layout to the screen.</p>

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  
**Example**  
```js
layout.draw()
```
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
<p>the instance of ConsoleManager (singleton)</p>

**Kind**: global constant  
<a name="page2Title"></a>

## page2Title : <code>string</code>
<p>The title of page2.</p>

**Kind**: global constant  
<a name="page1Title"></a>

## page1Title : <code>string</code>
<p>The application title.</p>

**Kind**: global constant  
