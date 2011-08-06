/*
Version: MPL 1.1/GPL 2.0

The contents of this file are subject to the Mozilla Public License
Version 1.1 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License atpath
http://www.mozilla.org/MPL/. 

Software distributed under the License is distributed on an "AS IS"
basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
License for the specific language governing rights and limitations
under the License.

The Original Code is TeleKast.

The Initial Developer of the Original Code is Greg Marine.
Portions created by the Initial Developer are Copyright (C) 2006-2007
the Initial Developer. All Rights Reserved.

Contributor(s):
   David Czechowski

Alternatively, the contents of this file may be used under the terms
of the GNU General Public License version 2 or above (the  "GPL License"),
in which case the provisions of the GPL License are applicable instead of
those above. If you wish to allow use of your version of this file only
under the terms of the GPL License and not to allow others to use
your version of this file under the MPL, indicate your decision by
deleting the provisions above and replace them with the notice and
other provisions required by the GPL License. If you do not delete
the provisions above, a recipient may use your version of this file
under either the MPL or the GPL License.
*/

// frmMain Event Handlers.

// OnLoad for frmMain
function OnLoad()
{
    init();

    Element("ctlSegmentPreview").setAttribute("src", "file://" + strSegmentPreviewPath);
    
    strScriptPath = "New File.xml";
    
    OpenSegmentClip();
    
    Element("chkAutoRefreshClip").checked = objPrefs.getBoolPref("telekast.clip.autorefresh");
    if(objPrefs.getBoolPref("telekast.clip.autorefresh"))
    {
        window.clearTimeout(intClipAutoRefresh);
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
    
    UpdateScriptSaved(true);
    
    blnScriptChanged = false;
    
    if(objPrefs.getBoolPref("telekast.update.checkforupdate"))
    {
        CheckForUpdate();
    }
}

// OnClose for frmMain...mostly for clean up.
function OnClose()
{
    if(!blnScriptSaved)
    {
        UnsavedScriptPrompt();
    }

    var f = new File(strTeleprompterPath);
    if(f.exists())
    {
        f.remove();
    }

    f = new File(strTeleprompterCSSPath);
    if(f.exists())
    {
        f.remove();
    }
    
    f = new File(strTeleprompterJSPath);
    if(f.exists())
    {
        f.remove();
    }

    f = new File(strStylesheetPath);
    if(f.exists())
    {
        f.remove();
    }
    
    f = new File(strSegmentPreviewPath);
    if(f.exists())
    {
        f.remove();
    }
    
    f = new File(strPrintDocument);
    if(f.exists())
    {
        f.remove();
    }

    quit(false);
}

// File Commands

// New Script
function OnCmdNewScript()
{
    if(!blnScriptSaved)
    {
        UnsavedScriptPrompt();
    }
    
    while(Element("lstScript").getRowCount()>0)
    {
        Element("lstScript").removeItemAt(0);
    }
    
    Element("cmdEditSegmentInScript").setAttribute("disabled", "true");
    Element("cmdCopyToClip").setAttribute("disabled", "true");
    Element("cmdMoveSegmentUp").setAttribute("disabled", "true");
    Element("cmdMoveSegmentDown").setAttribute("disabled", "true");
    Element("cmdScriptDeleteSelectedSegments").setAttribute("disabled", "true");
    Element("cmdScriptDeleteAllSegments").setAttribute("disabled", "true");
    Element("cmdShowTeleprompter").setAttribute("disabled", "true");

    ClearSegmentPreview();
    
    strScriptPath = "New File.xml";
    UpdateScriptSaved(true);
}

// Open Script
function OnCmdOpenScript()
{
    if(!blnScriptSaved)
    {
        UnsavedScriptPrompt();
    }
    
    var path = OpenScriptPrompt();
    if(path != null)
    {
        strScriptPath = path;
        while(Element("lstScript").getRowCount()>0)
        {
            Element("lstScript").removeItemAt(0);
        }
        
        ClearSegmentPreview();
        
        var f = new File(path);
        f.open("r");
        
        var xmlParser = new DOMParser();
        var xmlDoc = xmlParser.parseFromString(f.read(), "text/xml");
        
        f.close();
        
        var segments = xmlDoc.getElementsByTagName("segment");
        
        for(var i=0; i<segments.length; i++)
        {
            var title = segments[i].getAttribute("title");
            var text = segments[i].getElementsByTagName("teleprompter")[0].textContent;
            var camera = segments[i].getElementsByTagName("camera")[0].textContent;
            var audio = segments[i].getElementsByTagName("audio")[0].textContent;
            var video = segments[i].getElementsByTagName("video")[0].textContent;
            var talent = segments[i].getElementsByTagName("talent")[0].textContent;
            var other = segments[i].getElementsByTagName("other")[0].textContent;
            AddSegment(title, text, camera, audio, video, talent, other, "na", "Script");
        }
        
        Element("cmdSaveScriptAs").removeAttribute("disabled");

        UpdateScriptSaved(true);
    }
}

// Import Script
function OnCmdImportScript()
{
    
    var path = OpenScriptPrompt();
    if(path != null)
    {
        var f = new File(path);
        f.open("r");
        
        var xmlParser = new DOMParser();
        var xmlDoc = xmlParser.parseFromString(f.read(), "text/xml");
        
        f.close();
        
        var segments = xmlDoc.getElementsByTagName("segment");
        
        for(var i=0; i<segments.length; i++)
        {
            var title = segments[i].getAttribute("title");
            var text = segments[i].getElementsByTagName("teleprompter")[0].textContent;
            var camera = segments[i].getElementsByTagName("camera")[0].textContent;
            var audio = segments[i].getElementsByTagName("audio")[0].textContent;
            var video = segments[i].getElementsByTagName("video")[0].textContent;
            var talent = segments[i].getElementsByTagName("talent")[0].textContent;
            var other = segments[i].getElementsByTagName("other")[0].textContent;
            AddSegment(title, text, camera, audio, video, talent, other, "na", "Script");
        }
        
        UpdateScriptSaved(false);
    }
}

// Save Script
function OnCmdSaveScript()
{
    SaveScript();
}

// Save Script As
function OnCmdSaveScriptAs()
{
    SaveScriptAs();
}

// Print
function OnCmdPrint()
{
    window.openDialog("chrome://telekast/content/frmPrintScriptOptions.xul", "frmPrintScriptOptions", "modal,centerscreen");
}

// Causes the application to quit.
function OnCmdQuit()
{
    OnClose();
}

// Script Editor Commands

// New Segment
function OnCmdNewSegment()
{
    var segment = window.openDialog("chrome://telekast/content/frmSegmentEditor.xul", "frmSegmentEditor", "modal,centerscreen", true, "", "Script");
}

// Edit Segment
function OnCmdEditSegmentInScript()
{
    if(Element("lstScript").selectedIndex != -1)
    {
        var segment = window.openDialog("chrome://telekast/content/frmSegmentEditor.xul", "frmSegmentEditor", "modal,centerscreen", false, Element("lstScript").value, "Script");
        
        ClearSegmentPreview();
        Element("lstScript").clearSelection();
        
        Element("cmdEditSegmentInScript").setAttribute("disabled", "true");
        Element("cmdCopyToClip").setAttribute("disabled", "true");
        Element("cmdMoveSegmentUp").setAttribute("disabled", "true");
        Element("cmdMoveSegmentDown").setAttribute("disabled", "true");
        Element("cmdScriptDeleteSelectedSegments").setAttribute("disabled", "true");
    }
}

// Copy to Clip
function OnCmdCopyToClip()
{
    var script = Element("lstScript");
    if(script.selectedIndex != -1)
    {
        var items = script.selectedItems;
        for(var i=0; i<items.length; i++)
        {
            var strPath = objPrefs.getCharPref("telekast.folders.clippath");
            var strID = jslibDate("U") + ".xml";
            var values = items[i].value.split("|");
            AddSegment(values[0], values[1], values[2], values[3], values[4], values[5], values[6], strID, "SegmentClip");
            
            var segment = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
            segment += "<segmentclip>\r\n";
            segment += "    <segment title=\"" + values[0] + "\">\r\n";
            segment += "        <teleprompter>" + values[1] + "</teleprompter>\r\n";
            segment += "        <camera>" + values[2] + "</camera>\r\n";
            segment += "        <audio>" + values[3] + "</audio>\r\n";
            segment += "        <video>" + values[4] + "</video>\r\n";
            segment += "        <talent>" + values[5] + "</talent>\r\n";
            segment += "        <other>" + values[6] + "</other>\r\n";
            segment += "    </segment>\r\n";
            segment += "</segmentclip>";
            
            var f = new File(strPath + objSystem.separator + strID);
            f.open("w");
            f.write(segment);
            f.close();
        }
        
        Element("cmdClipDeleteAllSegments").removeAttribute("disabled");
    }
}

// Move Segment Up
function OnCmdMoveSegmentUp()
{
    var list = Element("lstScript");
    var index = list.selectedIndex;
    if(index > 0)
    {
        var item = list.removeItemAt(list.selectedIndex);
        item = list.insertItemAt(index - 1, item.getAttribute("label"), item.getAttribute("value"));
        item.setAttribute("class", "listitem-iconic");
        item.setAttribute("image", "images/segment_title.png");
        list.selectItem(item);
    }
    
    UpdateScriptSaved(false);
}

// Move Segment Down
function OnCmdMoveSegmentDown()
{
    var list = Element("lstScript");
    var index = list.selectedIndex;
    if(index < (list.getRowCount() - 2))
    {
        var item = list.removeItemAt(list.selectedIndex);
        index = index + 1;
        item = list.insertItemAt(index, item.getAttribute("label"), item.getAttribute("value"));
        item.setAttribute("class", "listitem-iconic");
        item.setAttribute("image", "images/segment_title.png");
        list.selectItem(item);
    }
    else if(index < (list.getRowCount() - 1))
    {
        var item = list.removeItemAt(list.getRowCount() - 1);
        item = list.insertItemAt(index, item.getAttribute("label"), item.getAttribute("value"));
        item.setAttribute("class", "listitem-iconic");
        item.setAttribute("image", "images/segment_title.png");
        list.selectedIndex = index + 1;
    }
    
    UpdateScriptSaved(false);
}

// Delete Selected Segments from Script
function OnCmdScriptDeleteSelectedSegments()
{
    var check = {value: false};
    var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
    var button = Prompts.confirmEx(window, Element("frmMainProperties").getString("CONFIRM_DELETE_TITLE"), Element("frmMainProperties").getString("CONFIRM_DELETE_SELECTED"), flags, Element("frmMainProperties").getString("CONFIRM_YES"), Element("frmMainProperties").getString("CONFIRM_NO"), null, null, check);
    if(button == 0)
    {
        var list = Element("lstScript");
        var items = list.selectedItems;
        for(var i=(items.length-1); i>=0; i--)
        {
            list.removeItemAt(list.getIndexOfItem(items[i]));
        }
        
        if(list.getRowCount() == 0)
        {
            Element("cmdShowTeleprompter").setAttribute("disabled", "true");
            Element("cmdScriptDeleteAllSegments").setAttribute("disabled", "true");
        }

        Element("cmdEditSegmentInScript").setAttribute("disabled", "true");
        Element("cmdCopyToClip").setAttribute("disabled", "true");
        Element("cmdMoveSegmentUp").setAttribute("disabled", "true");
        Element("cmdMoveSegmentDown").setAttribute("disabled", "true");
        Element("cmdScriptDeleteSelectedSegments").setAttribute("disabled", "true");

        ClearSegmentPreview();
        
        UpdateScriptSaved(false);
    }
}

// Delete All Segments from Script
function OnCmdScriptDeleteAllSegments()
{
    var check = {value: false};
    var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
    var button = Prompts.confirmEx(window, Element("frmMainProperties").getString("CONFIRM_DELETE_TITLE"), Element("frmMainProperties").getString("CONFIRM_DELETE_ALL"), flags, Element("frmMainProperties").getString("CONFIRM_YES"), Element("frmMainProperties").getString("CONFIRM_NO"), null, null, check);
    if(button == 0)
    {
        while(Element("lstScript").getRowCount()>0)
        {
            Element("lstScript").removeItemAt(0);
        }
        
        ClearSegmentPreview();
        
        UpdateScriptSaved(false);
        
        Element("cmdEditSegmentInScript").setAttribute("disabled", "true");
        Element("cmdCopyToClip").setAttribute("disabled", "true");
        Element("cmdMoveSegmentUp").setAttribute("disabled", "true");
        Element("cmdMoveSegmentDown").setAttribute("disabled", "true");
        Element("cmdScriptDeleteSelectedSegments").setAttribute("disabled", "true");
        Element("cmdScriptDeleteAllSegments").setAttribute("disabled", "true");
        Element("cmdShowTeleprompter").setAttribute("disabled", "true");
    }
}

// Segment Clip Commands

// Copy to Script
function OnCmdCopyToScript()
{
    var clip = Element("lstSegmentClip");
    if(clip.selectedIndex != -1)
    {
        var items = clip.selectedItems;
        for(var i=0; i<items.length; i++)
        {
            var values = items[i].value.split("|");
            AddSegment(values[0], values[1], values[2], values[3], values[4], values[5], values[6], "na", "Script");
        }
        
        Element("cmdScriptDeleteAllSegments").removeAttribute("disabled");
        Element("cmdShowTeleprompter").removeAttribute("disabled");
    }
}

// Delete Selected Segments from Clip
function OnCmdClipDeleteSelectedSegments()
{
    window.clearTimeout(intClipAutoRefresh);
    
    var check = {value: false};
    var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
    var button = Prompts.confirmEx(window, Element("frmMainProperties").getString("CONFIRM_DELETE_TITLE"), Element("frmMainProperties").getString("CONFIRM_DELETE_SELECTED"), flags, Element("frmMainProperties").getString("CONFIRM_YES"), Element("frmMainProperties").getString("CONFIRM_NO"), null, null, check);
    if(button == 0)
    {
        var list = Element("lstSegmentClip");
        var items = list.selectedItems;
        for(var i=(items.length-1); i>=0; i--)
        {
            var values = items[i].value.split("|");
            var f = new File(objPrefs.getCharPref("telekast.folders.clippath") + objSystem.separator + values[7]);
            f.remove();
            list.removeItemAt(list.getIndexOfItem(items[i]));
        }
        
        if(Element("lstSegmentClip").getRowCount() == 0)
        {
            Element("cmdClipDeleteAllSegments").setAttribute("disabled", "true");
        }

        Element("cmdEditSegmentInClip").setAttribute("disabled", "true");
        Element("cmdCopyToScript").setAttribute("disabled", "true");
        Element("cmdClipDeleteSelectedSegments").setAttribute("disabled", "true");
        
        ClearSegmentPreview();
    }
    
    if(Element("chkAutoRefreshClip").checked)
    {
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
}

// Delete All Segments from Clip
function OnCmdClipDeleteAllSegments()
{
    window.clearTimeout(intClipAutoRefresh);
    
    var check = {value: false};
    var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
    var button = Prompts.confirmEx(window, Element("frmMainProperties").getString("CONFIRM_DELETE_TITLE"), Element("frmMainProperties").getString("CONFIRM_DELETE_ALL"), flags, Element("frmMainProperties").getString("CONFIRM_YES"), Element("frmMainProperties").getString("CONFIRM_NO"), null, null, check);
    if(button == 0)
    {
        while(Element("lstSegmentClip").getRowCount()>0)
        {
            var values = Element("lstSegmentClip").getItemAtIndex(0).value.split("|");
            var f = new File(objPrefs.getCharPref("telekast.folders.clippath") + objSystem.separator + values[7]);
            f.remove();
            Element("lstSegmentClip").removeItemAt(0);
        }
        
        ClearSegmentPreview();
    
        Element("cmdEditSegmentInClip").setAttribute("disabled", "true");
        Element("cmdCopyToScript").setAttribute("disabled", "true");
        Element("cmdClipDeleteSelectedSegments").setAttribute("disabled", "true");
        Element("cmdClipDeleteAllSegments").setAttribute("disabled", "true");
    }
    
    if(Element("chkAutoRefreshClip").checked)
    {
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
}

// Refreshes the segment clip.
function OnCmdRefreshClip()
{
    OpenSegmentClip();
}

// Actions to perform if the Clip Auto Refresh checkbox is clicked.
function OnAutoRefreshClipClick()
{
    if(!Element("chkAutoRefreshClip").checked)
    {
        window.clearTimeout(intClipAutoRefresh);
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
        objPrefs.setBoolPref("telekast.clip.autorefresh", true);
    }
    else
    {
        window.clearTimeout(intClipAutoRefresh);
        objPrefs.setBoolPref("telekast.clip.autorefresh", false);
        Element("sbpClipAutoRefresh").label = "0s";
        intClipAutoRefreshCounter = 1;
    }
}

// Teleprompter Commands

// Show Teleprompter
function OnCmdShowTeleprompter()
{
    window.clearTimeout(intClipAutoRefresh);
    
    StatusNotification("Loading teleprompter...");
    
    PrepareTeleprompter();

    Element("webTeleprompter").setAttribute("src", "file://" + strTeleKast + objSystem.separator + "teleprompter.html");
    window.setTimeout("Element(\"webTeleprompter\").reload();", 1000);
    window.setTimeout("Element(\"MainDeck\").selectedIndex = 1;", 1100);
    window.setTimeout("window.fullScreen = true;", 1100);
    window.setTimeout("Element(\"webTeleprompter\").contentWindow.focus();", 1100);
}

// Hide Teleprompter
function OnCmdHideTeleprompter()
{
    Element("webTeleprompter").reload();
    Element("MainDeck").selectedIndex = 0;
    window.fullScreen = false;
    Element("lstScript").focus();
    
    if(Element("chkAutoRefreshClip").checked)
    {
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
}

// Tools Commands

// Checks the server for an update
function OnCmdCheckForUpdate()
{
    CheckForUpdate();
}

// TeleKast Preferences
function OnCmdPreferences()
{
    window.openDialog("chrome://telekast/content/frmPreferences.xul", "frmPreferences", "modal,toolbar,centerscreen");
    
    CreatePreviewStyleSheet();
    
    window.setTimeout("Element(\"ctlSegmentPreview\").reload();", 1000);
    
    OpenSegmentClip();
    
    Element("chkAutoRefreshClip").checked = objPrefs.getBoolPref("telekast.clip.autorefresh");
    if(objPrefs.getBoolPref("telekast.clip.autorefresh"))
    {
        window.clearTimeout(intClipAutoRefresh);
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
}

// Help Commands

// Loads the help viewer
function OnCmdHelp()
{
    window.openDialog("chrome://telekast/content/frmHelp.xul", "frmHelp", "centerscreen");
}

// Loads the "About" dialog.
function OnCmdAbout()
{
    window.openDialog("chrome://telekast/content/frmAbout.xul", "frmAbout", "modal,centerscreen");
}

// Actions to perform when a segment is selected in the script.
function OnScriptSelect()
{
    if(Element("lstScript").selectedIndex != -1)
    {
        var segment = Element("lstScript").value.split("|");
        Element("lblTitle").value = segment[0];
        
        var f = new File(strSegmentPreviewPath);
        // Create HTML document for segment preview page.
        var strHTML = "<html>\r\n";
        strHTML += "  <head>\r\n";
        strHTML += "    <title>" + segment[0] + "</title>\r\n";
        strHTML += "    <link rel=\"stylesheet\" type=\"text/css\" href=\"segment_preview.css\" title=\"Default\" />\r\n";
        strHTML += "  </head>\r\n";
        strHTML += "  <body>\r\n";
        strHTML += "      <h1>" + segment[1] + "</h1>\r\n";
        strHTML += "  </body>\r\n";
        strHTML += "</html>";
        
        // Create new file to put HTML in.
        f.open("w");
        f.write(strHTML);
        f.close();
        
        Element("ctlSegmentPreview").reload();
        Element("lblCameraCue").value = segment[2];
        Element("lblAudioCue").value = segment[3];
        Element("lblVideoCue").value = segment[4];
        Element("lblTalentCue").value = segment[5];
        Element("lblOtherCue").value = segment[6];

        Element("cmdEditSegmentInScript").removeAttribute("disabled");
        Element("cmdCopyToClip").removeAttribute("disabled");
        Element("cmdMoveSegmentUp").removeAttribute("disabled");
        Element("cmdMoveSegmentDown").removeAttribute("disabled");
        Element("cmdScriptDeleteSelectedSegments").removeAttribute("disabled");
        Element("cmdScriptDeleteAllSegments").removeAttribute("disabled");
    }
}

// Actions to take place when a script segment is double clicked.
function OnScriptDblClick()
{
    if(Element("lstScript").selectedIndex != -1)
    {
        var segment = window.openDialog("chrome://telekast/content/frmSegmentEditor.xul", "frmSegmentEditor", "modal,centerscreen", false, Element("lstScript").value, "Script");
        
        ClearSegmentPreview();
        Element("lstScript").clearSelection();
        
        Element("cmdEditSegmentInScript").setAttribute("disabled", "true");
        Element("cmdCopyToClip").setAttribute("disabled", "true");
        Element("cmdMoveSegmentUp").setAttribute("disabled", "true");
        Element("cmdMoveSegmentDown").setAttribute("disabled", "true");
        Element("cmdScriptDeleteSelectedSegments").setAttribute("disabled", "true");
    }
}

// Actions to perform when a segment is selected in the segment clip.
function OnSegmentClipSelect()
{
    if(Element("lstSegmentClip").selectedIndex != -1)
    {
        var segment = Element("lstSegmentClip").value.split("|");
        Element("lblTitle").value = segment[0];
        
        var f = new File(strSegmentPreviewPath);
        // Create HTML document for segment preview page.
        var strHTML = "<html>\r\n";
        strHTML += "  <head>\r\n";
        strHTML += "    <title>" + segment[0] + "</title>\r\n";
        strHTML += "    <link rel=\"stylesheet\" type=\"text/css\" href=\"segment_preview.css\" title=\"Default\" />\r\n";
        strHTML += "  </head>\r\n";
        strHTML += "  <body>\r\n";
        strHTML += "      <h1>" + segment[1] + "</h1>\r\n";
        strHTML += "  </body>\r\n";
        strHTML += "</html>";
        
        // Create new file to put HTML in.
        f.open("w");
        f.write(strHTML);
        f.close();
        
        Element("ctlSegmentPreview").reload();
        Element("lblCameraCue").value = segment[2];
        Element("lblAudioCue").value = segment[3];
        Element("lblVideoCue").value = segment[4];
        Element("lblTalentCue").value = segment[5];
        Element("lblOtherCue").value = segment[6];

        Element("cmdEditSegmentInClip").removeAttribute("disabled");
        Element("cmdCopyToScript").removeAttribute("disabled");
        Element("cmdClipDeleteSelectedSegments").removeAttribute("disabled");
    }

}

// Actions to take place when a segment clip segment is double clicked.
function OnSegmentClipDblClick()
{
    var strID = Element("lstSegmentClip").value.split("|")[7];
    if(LockSegment(strID))
    {
        if(Element("lstSegmentClip").selectedIndex != -1)
        {
            // Pause clip auto refresh.
            window.clearTimeout(intClipAutoRefresh);

            var segment = window.openDialog("chrome://telekast/content/frmSegmentEditor.xul", "frmSegmentEditor", "modal,centerscreen", false, Element("lstSegmentClip").value, "SegmentClip");
            
            ClearSegmentPreview();
            Element("lstSegmentClip").clearSelection();
            
            Element("cmdEditSegmentInClip").setAttribute("disabled", "true");
            Element("cmdCopyToScript").setAttribute("disabled", "true");
            Element("cmdClipDeleteSelectedSegments").setAttribute("disabled", "true");
            
            if(Element("chkAutoRefreshClip").checked)
            {
                intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
            }
        }
        
        UnlockSegment(strID);
    }
    else
    {
        Prompts.alert(this, Element("frmMainProperties").getString("ALERT_SEGMENT_LOCKED_TITLE"), Element("frmMainProperties").getString("ALERT_SEGMENT_LOCKED_PROMPT"));
    }
}

// Actions to take place when a segment clip segment is being edited.
function OnCmdEditSegmentInClip()
{
    var strID = Element("lstSegmentClip").value.split("|")[7];
    if(LockSegment(strID))
    {
        if(Element("lstSegmentClip").selectedIndex != -1)
        {
            // Pause clip auto refresh.
            window.clearTimeout(intClipAutoRefresh);

            var segment = window.openDialog("chrome://telekast/content/frmSegmentEditor.xul", "frmSegmentEditor", "modal,centerscreen", false, Element("lstSegmentClip").value, "SegmentClip");
            
            SaveSegmentClip();
            
            ClearSegmentPreview();
            Element("lstSegmentClip").clearSelection();
            
            Element("cmdEditSegmentInClip").setAttribute("disabled", "true");
            Element("cmdCopyToScript").setAttribute("disabled", "true");
            Element("cmdClipDeleteSelectedSegments").setAttribute("disabled", "true");
            
            if(Element("chkAutoRefreshClip").checked)
            {
                intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
            }
        }
        
        UnlockSegment(strID);
    }
    else
    {
        Prompts.alert(this, Element("frmMainProperties").getString("ALERT_SEGMENT_LOCKED_TITLE"), Element("frmMainProperties").getString("ALERT_SEGMENT_LOCKED_PROMPT"));
    }
}
