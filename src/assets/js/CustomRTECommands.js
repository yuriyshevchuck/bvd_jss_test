/*Telerik.Web.UI.Editor.CommandList["InsertUnorderedList2"] = function(commandName, editor, args) {  
    var val = args.get_value();  
    editor.pasteHtml(val);  
    args.set_cancel(true);  
};  
jQuery(document).ready(function($) {  
    loadCSS = function(href) {  
        var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");  
        $("head").append(cssLink);  
    };  
    //loadCSS("/sitecore/shell/Controls/Rich Text Editor/InsertToken/InsertToken.css");  
});  
*/
var RadEditorCommandList = Telerik.Web.UI.Editor.CommandList;
 
var unorderedList = RadEditorCommandList["InsertUnorderedList"];
RadEditorCommandList["InsertUnorderedListExm"] = function (commandName, editor, args) {
    unorderedList(commandName, editor, args);
    var p = editor.getSelectedElement();
    var liCollection = p.parentNode.childNodes;
    for (i = 0; i < liCollection.length; i++) {
      var span = editor.get_document().createElement("span");
      var liElement = liCollection[i];
      var v = liElement.innerText;
      liElement.innerText = "";
      liElement.appendChild(span);
      span.innerText = v;
    }
    //p.classList.add("editor-table")
};
