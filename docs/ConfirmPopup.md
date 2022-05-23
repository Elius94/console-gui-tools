<a name="ConfirmPopup"></a>

## ConfirmPopup ⇐ <code>ButtonPopup</code>
**Kind**: global class  
**Extends**: <code>ButtonPopup</code>  
<a name="new_ConfirmPopup_new"></a>

### new ConfirmPopup(id, title, message, visible)
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
| id | <code>string</code> | <p>The id of the popup.</p> |
| title | <code>string</code> | <p>The title of the popup.</p> |
| message | <code>string</code> | <p>The message of the popup.</p> |
| visible | <code>boolean</code> | <p>If the popup is visible. Default is false (make it appears using show()).</p> |

**Example**  
```js
const popup = new ConfirmPopup("popup1", "Are you shure").show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
```
