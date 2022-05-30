## Classes

<dl>
<dt><a href="#SingleLayout">SingleLayout</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CM">CM</a> : <code>ConsoleManager</code></dt>
<dd><p>the instance of ConsoleManager (singleton)</p></dd>
<dt><a href="#pageTitle">pageTitle</a> : <code>string</code></dt>
<dd><p>The application title.</p></dd>
</dl>

<a name="SingleLayout"></a>

## SingleLayout
**Kind**: global class  

* [SingleLayout](#SingleLayout)
    * [new SingleLayout(page, options)](#new_SingleLayout_new)
    * [.setPage(page)](#SingleLayout+setPage)
    * [.setTitle(title)](#SingleLayout+setTitle) ⇒ <code>void</code>
    * [.setBorder(border)](#SingleLayout+setBorder)
    * [.drawLine(line)](#SingleLayout+drawLine) ⇒ <code>void</code>
    * [.draw()](#SingleLayout+draw) ⇒ <code>void</code>

<a name="new_SingleLayout_new"></a>

### new SingleLayout(page, options)
<p>This class is a layout that has two pages.</p>
<p><img src="https://user-images.githubusercontent.com/14907987/170997567-b1260996-cc7e-4c26-8389-39519313f3f6.png" alt="single layout"></p>


| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>The first page.</p> |
| options | <code>boolean</code> | <p>Layout options.</p> |

**Example**  
```js
const layout = new SingleLayout(page1, page2, true, 0)
```
<a name="SingleLayout+setPage"></a>

### singleLayout.setPage(page)
<p>This function is used to overwrite the page content.</p>

**Kind**: instance method of [<code>SingleLayout</code>](#SingleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>the page to be added</p> |

<a name="SingleLayout+setTitle"></a>

### singleLayout.setTitle(title) ⇒ <code>void</code>
<p>This function is used to set the title of the layout.</p>

**Kind**: instance method of [<code>SingleLayout</code>](#SingleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | <p>the title to be set</p> |

**Example**  
```js
layout.setTitle("My Title")
```
<a name="SingleLayout+setBorder"></a>

### singleLayout.setBorder(border)
<p>This function is used to enable or disable the layout border.</p>

**Kind**: instance method of [<code>SingleLayout</code>](#SingleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| border | <code>boolean</code> | <p>enable or disable the border</p> |

<a name="SingleLayout+drawLine"></a>

### singleLayout.drawLine(line) ⇒ <code>void</code>
<p>This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.</p>

**Kind**: instance method of [<code>SingleLayout</code>](#SingleLayout)  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Array.&lt;StyledElement&gt;</code> | <p>the line to be drawn</p> |

<a name="SingleLayout+draw"></a>

### singleLayout.draw() ⇒ <code>void</code>
<p>This function is used to draw the layout to the screen.</p>

**Kind**: instance method of [<code>SingleLayout</code>](#SingleLayout)  
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
