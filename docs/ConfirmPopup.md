<a name="ConfirmPopup"></a>

## ConfirmPopup ⇐ <code>ButtonPopup</code>
**Kind**: global class  
**Extends**: <code>ButtonPopup</code>  
<a name="new_ConfirmPopup_new"></a>

### new ConfirmPopup(id, title, message, visible)
This class is an overload of ButtonPopup that is used to create a popup with That asks for a confirm [Yes, No]. Emits the following events: - "confirm" when the user confirm- "cancel" when the user cancel- "exit" when the user exit


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the popup. |
| title | <code>string</code> | The title of the popup. |
| message | <code>string</code> | The message of the popup. |
| visible | <code>boolean</code> | If the popup is visible. Default is false (make it appears using show()). |

**Example**  
```js
const popup = new ConfirmPopup("popup1", "Are you shure").show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
```
