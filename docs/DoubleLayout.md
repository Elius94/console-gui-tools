## Classes

<dl>
<dt><a href="#DoubleLayout">DoubleLayout</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p>
</dd>
<dt><a href="#page2Title">page2Title</a> : <code>string</code></dt>
<dd><p>The title of page2.</p>
</dd>
<dt><a href="#applicationTitle">applicationTitle</a> : <code>string</code></dt>
<dd><p>The application title.</p>
</dd>
</dl>

<a name="DoubleLayout"></a>

## DoubleLayout
**Kind**: global class  

* [DoubleLayout](#DoubleLayout)
    * [new DoubleLayout(page1, page2, border, selected)](#new_DoubleLayout_new)
    * [.setPage1(page)](#DoubleLayout+setPage1)
    * [.setPage2(page)](#DoubleLayout+setPage2)
    * [.setBorder(border)](#DoubleLayout+setBorder)
    * [.setSelected(selected)](#DoubleLayout+setSelected)
    * [.getSelected()](#DoubleLayout+getSelected) ⇒ <code>number</code>
    * [.changeLayout()](#DoubleLayout+changeLayout) ⇒ <code>void</code>
    * [.drawLine(line, lineIndex)](#DoubleLayout+drawLine) ⇒ <code>void</code>
    * [.draw()](#DoubleLayout+draw) ⇒ <code>void</code>

<a name="new_DoubleLayout_new"></a>

### new DoubleLayout(page1, page2, border, selected)
This class is a layout that has two pages.


| Param | Type | Description |
| --- | --- | --- |
| page1 | <code>PageBuilder</code> | The first page. |
| page2 | <code>PageBuilder</code> | The second page. |
| border | <code>boolean</code> | If the layout has a border. |
| selected | <code>number</code> | The selected page. |

**Example**  
```js
const layout = new DoubleLayout(page1, page2, true, 0)
```
<a name="DoubleLayout+setPage1"></a>

### doubleLayout.setPage1(page)
This function is used to overwrite the page content.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | the page to be added |

<a name="DoubleLayout+setPage2"></a>

### doubleLayout.setPage2(page)
This function is used to overwrite the page content.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | the page to be added |

<a name="DoubleLayout+setBorder"></a>

### doubleLayout.setBorder(border)
This function is used to enable or disable the layout border.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| border | <code>boolean</code> | enable or disable the border |

<a name="DoubleLayout+setSelected"></a>

### doubleLayout.setSelected(selected)
This function is used to choose the page to be highlighted.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| selected | <code>number</code> | 0 for page1, 1 for page2 |

<a name="DoubleLayout+getSelected"></a>

### doubleLayout.getSelected() ⇒ <code>number</code>
This function is used to get the selected page.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  
**Returns**: <code>number</code> - 0 for page1, 1 for page2  
<a name="DoubleLayout+changeLayout"></a>

### doubleLayout.changeLayout() ⇒ <code>void</code>
This function is used to get switch the selected page.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  
<a name="DoubleLayout+drawLine"></a>

### doubleLayout.drawLine(line, lineIndex) ⇒ <code>void</code>
This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Array.&lt;object&gt;</code> | the line to be drawn |
| lineIndex | <code>number</code> | the index of the selected line |

<a name="DoubleLayout+draw"></a>

### doubleLayout.draw() ⇒ <code>void</code>
This function is used to draw the layout to the screen.

**Kind**: instance method of [<code>DoubleLayout</code>](#DoubleLayout)  
**Example**  
```js
layout.draw()
```
<a name="CM"></a>

## CM : <code>ConsoleManager</code>
the instance of ConsoleManager (singleton)

**Kind**: global constant  
<a name="page2Title"></a>

## page2Title : <code>string</code>
The title of page2.

**Kind**: global constant  
<a name="applicationTitle"></a>

## applicationTitle : <code>string</code>
The application title.

**Kind**: global constant  
