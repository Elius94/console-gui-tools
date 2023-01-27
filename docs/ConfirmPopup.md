## Classes

<dl>
<dt><a href="#ConfirmPopup">ConfirmPopup</a> ⇐ <code>ButtonPopup</code></dt>
<dd></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#ConfirmPopupConfig">ConfirmPopupConfig</a> : <code>Object</code></dt>
<dd><p>The configuration for the ConfirmPopup class.</p></dd>
</dl>

<a name="ConfirmPopupConfig"></a>

## ConfirmPopupConfig : <code>Object</code>
<p>The configuration for the ConfirmPopup class.</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| [message] | <code>string</code> | <p>The message of the popup.</p> |

<a name="ConfirmPopup"></a>

## ConfirmPopup ⇐ <code>ButtonPopup</code>
**Kind**: global class  
**Extends**: <code>ButtonPopup</code>  
<a name="new_ConfirmPopup_new"></a>

### new ConfirmPopup(config)
<p>This class is an overload of ButtonPopup that is used to create a popup with That asks for a confirm [Yes, No].</p>
<p><img src="https://user-images.githubusercontent.com/14907987/165752226-b76b157f-4935-4248-a5cc-3b21d087cb04.gif" alt="ConfirmPopup"></p>
<p>Emits the following events:</p>
<ul>
<li>&quot;confirm&quot; when the user confirm</li>
<li>&quot;cancel&quot; when the user cancel</li>
<li>&quot;exit&quot; when the user exit</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>ConfirmPopupConfig</code>](#ConfirmPopupConfig) | <p>The configuration of the popup.</p> |

**Example**  
```tsconst popup = new ConfirmPopup({ id: "popup1",  title: "Are you shure",}) popup.show() // show the popuppopup.on("confirm", (answer) => { console.log(console.log(answer))})```
