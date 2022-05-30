## Classes

<dl>
<dt><a href="#ConsoleManager">ConsoleManager</a> ⇐ <code>EventEmitter</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#Screen">Screen</a> : <code><a href="#Screen">Screen</a></code></dt>
<dd><p>The screen instance</p></dd>
<dt><a href="#logLocation">logLocation</a> : <code>number</code> | <code>&#x27;popup&#x27;</code></dt>
<dd><p>Choose where the logs are displayed: number (0,1) - to pot them on one of the two layouts, string (&quot;popup&quot;) - to put them on a CustomPopup that can be displayed on the window.</p></dd>
<dt><a href="#changeLayoutKey">changeLayoutKey</a> : <code>string</code></dt>
<dd><p>The key or combination to switch the selected page</p></dd>
<dt><a href="#homePage">homePage</a> : <code>Array.&lt;PageBuilder&gt;</code></dt>
<dd><p>The main application</p></dd>
<dt><a href="#stdOut">stdOut</a> : <code>PageBuilder</code></dt>
<dd><p>The logs page</p></dd>
<dt><a href="#layout">layout</a> : <code>LayoutManager</code></dt>
<dd><p>The layout instance</p></dd>
</dl>

<a name="ConsoleManager"></a>

## ConsoleManager ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ConsoleManager](#ConsoleManager) ⇐ <code>EventEmitter</code>
    * [new ConsoleManager(options)](#new_ConsoleManager_new)
    * [.getLogPageSize()](#ConsoleManager+getLogPageSize) ⇒ <code>number</code>
    * [.setLogPageSize(size)](#ConsoleManager+setLogPageSize) ⇒ <code>void</code>
    * [.addGenericListeners()](#ConsoleManager+addGenericListeners)
    * [.setKeyListener(id, manageFunction)](#ConsoleManager+setKeyListener)
    * [.removeKeyListener(id)](#ConsoleManager+removeKeyListener)
    * [.registerWiget(widget)](#ConsoleManager+registerWiget)
    * [.unRegisterWidget(id)](#ConsoleManager+unRegisterWidget)
    * ~~[.setHomePage(page)](#ConsoleManager+setHomePage)~~
    * [.setPage(page, [pageNumber], [title])](#ConsoleManager+setPage)
    * [.setPages(pages, [titles])](#ConsoleManager+setPages)
    * [.refresh()](#ConsoleManager+refresh)
    * [.showLogPopup()](#ConsoleManager+showLogPopup) ⇒
    * [.log(message)](#ConsoleManager+log)
    * [.error(message)](#ConsoleManager+error)
    * [.warn(message)](#ConsoleManager+warn)
    * [.info(message)](#ConsoleManager+info)
    * [.updateLogsConsole(resetCursor)](#ConsoleManager+updateLogsConsole)
    * [.truncate(str, n, useWordBoundary)](#ConsoleManager+truncate)

<a name="new_ConsoleManager_new"></a>

### new ConsoleManager(options)
<p>This class is used to manage the console GUI and all the widgets.
This is a singleton class, so you can use it like this: const CM = new ConsoleManager()
Emits the following events:</p>
<ul>
<li>&quot;keypressed&quot; to propagate the key pressed event to the application</li>
<li>&quot;exit&quot; when the user wants to exit the application</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | <p>The options of the ConsoleManager.</p> |

**Example**  
```js
const CM = new ConsoleManager({ logPageSize: 10, layoutBorder: true, changeLayoutKey: 'ctrl+l', title: 'Console Application' })
```
<a name="ConsoleManager+getLogPageSize"></a>

### consoleManager.getLogPageSize() ⇒ <code>number</code>
<p>This method is used to get the log page size.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  
**Returns**: <code>number</code> - <p>The log page size.</p>  
**Example**  
```js
CM.getLogPageSize()
```
<a name="ConsoleManager+setLogPageSize"></a>

### consoleManager.setLogPageSize(size) ⇒ <code>void</code>
<p>This method is used to set the log page size.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | <p>The new log page size.</p> |

**Example**  
```js
CM.setLogPageSize(10)
```
<a name="ConsoleManager+addGenericListeners"></a>

### consoleManager.addGenericListeners()
<p>This function is used to make the ConsoleManager handle the key events when no widgets are showed.
Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  
<a name="ConsoleManager+setKeyListener"></a>

### consoleManager.setKeyListener(id, manageFunction)
<p>This function is used to set a key listener for a specific widget. The event listener is stored in the eventListenersContainer object.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the widget.</p> |
| manageFunction | <code>function</code> | <p>The function to call when the key is pressed.</p> |

**Example**  
```js
CM.setKeyListener('inputPopup', popup.keyListener)
```
<a name="ConsoleManager+removeKeyListener"></a>

### consoleManager.removeKeyListener(id)
<p>This function is used to remove a key listener for a specific widget. The event listener is removed from the eventListenersContainer object.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the widget.</p> |

**Example**  
```js
CM.removeKeyListener('inputPopup')
```
<a name="ConsoleManager+registerWiget"></a>

### consoleManager.registerWiget(widget)
<p>This function is used to register a widget. The widget is stored in the widgetsCollection object. That is called by the widgets in show().</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| widget | <code>Widget</code> | <p>The widget to register.</p> |

<a name="ConsoleManager+unRegisterWidget"></a>

### consoleManager.unRegisterWidget(id)
<p>This function is used to unregister a widget. The widget is removed from the widgetsCollection object. That is called by the widgets in hide().</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the widget.</p> |

<a name="ConsoleManager+setHomePage"></a>

### ~~consoleManager.setHomePage(page)~~
***Deprecated***

<p>This function is used to set the home page. It also refresh the screen.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>PageBuilder</code> | <p>The page to set as home page.</p> |

**Example**  
```js
CM.setHomePage(p)
```
<a name="ConsoleManager+setPage"></a>

### consoleManager.setPage(page, [pageNumber], [title])
<p>This function is used to set a page of layout. It also refresh the screen.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| page | <code>PageBuilder</code> |  | <p>The page to set as home page.</p> |
| [pageNumber] | <code>number</code> | <code>0</code> | <p>The page number to set. 0 is the first page, 1 is the second page.</p> |
| [title] | <code>string</code> \| <code>null</code> | <code>null</code> | <p>The title of the page to overwrite the default title. Default is null.</p> |

**Example**  
```js
CM.setPage(p, 0)
```
<a name="ConsoleManager+setPages"></a>

### consoleManager.setPages(pages, [titles])
<p>This function is used to set both pages of layout. It also refresh the screen.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pages | <code>Array.&lt;PageBuilder&gt;</code> |  | <p>The page to set as home page.</p> |
| [titles] | <code>Array.&lt;string&gt;</code> \| <code>null</code> | <code></code> | <p>The titles of the page to overwrite the default titles. Default is null.</p> |

**Example**  
```js
CM.setPages([p1, p2], 0)
```
<a name="ConsoleManager+refresh"></a>

### consoleManager.refresh()
<p>This function is used to refresh the screen. It do the following sequence: Clear the screen, draw layout, draw widgets and finally print the screen to the stdOut.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  
**Example**  
```js
CM.refresh()
```
<a name="ConsoleManager+showLogPopup"></a>

### consoleManager.showLogPopup() ⇒
<p>This function is used to show a popup containing all the stdOut of the console.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  
**Returns**: <p>the instance of the generated popup.</p>  
**Example**  
```js
CM.showLogPopup()
```
<a name="ConsoleManager+log"></a>

### consoleManager.log(message)
<p>This function is used to log a message. It is used to log messages in the log page. Don't add colors to the message.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>The message to log.</p> |

**Example**  
```js
CM.log("Hello world")
```
<a name="ConsoleManager+error"></a>

### consoleManager.error(message)
<p>This function is used to log an error message. It is used to log red messages in the log page. Don't add colors to the message.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>The message to log.</p> |

**Example**  
```js
CM.error("Anomaly detected")
```
<a name="ConsoleManager+warn"></a>

### consoleManager.warn(message)
<p>This function is used to log a warning message. It is used to log yellow messages in the log page. Don't add colors to the message.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>The message to log.</p> |

**Example**  
```js
CM.warn("Anomaly detected")
```
<a name="ConsoleManager+info"></a>

### consoleManager.info(message)
<p>This function is used to log an info message. It is used to log blue messages in the log page. Don't add colors to the message.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>The message to log.</p> |

**Example**  
```js
CM.info("Anomaly detected")
```
<a name="ConsoleManager+updateLogsConsole"></a>

### consoleManager.updateLogsConsole(resetCursor)
<p>This function is used to update the logs console. It is called by the log functions.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| resetCursor | <code>boolean</code> | <p>If true, the log scroll index is resetted.</p> |

<a name="ConsoleManager+truncate"></a>

### consoleManager.truncate(str, n, useWordBoundary)
<p>This function is used to truncate a string adding ... at the end.</p>

**Kind**: instance method of [<code>ConsoleManager</code>](#ConsoleManager)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>The string to truncate.</p> |
| n | <code>number</code> | <p>The number of characters to keep.</p> |
| useWordBoundary | <code>boolean</code> | <p>If true, the truncation will be done at the end of the word.</p> |

**Example**  
```js
CM.truncate("Hello world", 5, true) // "Hello..."
```
<a name="Screen"></a>

## Screen : [<code>Screen</code>](#Screen)
<p>The screen instance</p>

**Kind**: global constant  
<a name="logLocation"></a>

## logLocation : <code>number</code> \| <code>&#x27;popup&#x27;</code>
<p>Choose where the logs are displayed: number (0,1) - to pot them on one of the two layouts, string (&quot;popup&quot;) - to put them on a CustomPopup that can be displayed on the window.</p>

**Kind**: global constant  
<a name="changeLayoutKey"></a>

## changeLayoutKey : <code>string</code>
<p>The key or combination to switch the selected page</p>

**Kind**: global constant  
<a name="homePage"></a>

## homePage : <code>Array.&lt;PageBuilder&gt;</code>
<p>The main application</p>

**Kind**: global constant  
<a name="stdOut"></a>

## stdOut : <code>PageBuilder</code>
<p>The logs page</p>

**Kind**: global constant  
<a name="layout"></a>

## layout : <code>LayoutManager</code>
<p>The layout instance</p>

**Kind**: global constant  
