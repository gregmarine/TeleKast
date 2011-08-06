/*
Version: MPL 1.1/GPL 2.0

The contents of this file are subject to the Mozilla Public License
Version 1.1 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License at
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

var strID;

function OnLoad()
{
    init();
    
    if(!window.arguments[0])
    {
        var segment = window.arguments[1].split("|");
        Element("txtSegmentTitle").value = segment[0];
        document.title = Element("frmSegmentEditorProperties").getString("SEGMENT_EDITOR_TITLE") + " (" + Element("txtSegmentTitle").value + ")";
        Element("txtSegmentText").value = segment[1];
        Element("txtCameraCue").value = segment[2];
        Element("txtAudioCue").value = segment[3];
        Element("txtVideoCue").value = segment[4];
        Element("txtTalentCue").value = segment[5];
        Element("txtOtherCue").value = segment[6];
        
        strID = segment[7];
    }
    else
    {
        Element("chkNewToClip").removeAttribute("hidden");
        Element("chkNewToClip").checked = objPrefs.getBoolPref("telekast.clip.newtoclip");
    }
}

// Updates the dialog's title with the segment title.
function OnTitleKeyUp(e)
{
    if(!e.altKey && !e.ctrlKey)
    {
        if(Element("txtSegmentTitle").value != "")
        {
            document.title = Element("frmSegmentEditorProperties").getString("SEGMENT_EDITOR_TITLE") + " (" + Element("txtSegmentTitle").value + ")";
        }
        else
        {
            document.title = Element("frmSegmentEditorProperties").getString("SEGMENT_EDITOR_TITLE");
        }
    }
}

// What to do if the user presses the "OK" button.
function OnDialogAccept()
{
    if(window.arguments[0])
    {
        if(window.arguments[2] == "Script")
        {
            opener.AddSegment(Element("txtSegmentTitle").value, Element("txtSegmentText").value, Element("txtCameraCue").value, Element("txtAudioCue").value, Element("txtVideoCue").value, Element("txtTalentCue").value, Element("txtOtherCue").value, "na", window.arguments[2]);
        }
        
        if(objPrefs.getBoolPref("telekast.clip.newtoclip"))
        {
            var strPath = objPrefs.getCharPref("telekast.folders.clippath");
            strID = jslibDate("U") + ".xml";
            opener.AddSegment(Element("txtSegmentTitle").value, Element("txtSegmentText").value, Element("txtCameraCue").value, Element("txtAudioCue").value, Element("txtVideoCue").value, Element("txtTalentCue").value, Element("txtOtherCue").value, strID, "SegmentClip");
            
            var segment = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
            segment += "<segmentclip>\r\n";
            segment += "    <segment title=\"" + Element("txtSegmentTitle").value + "\">\r\n";
            segment += "        <teleprompter>" + Element("txtSegmentText").value + "</teleprompter>\r\n";
            segment += "        <camera>" + Element("txtCameraCue").value + "</camera>\r\n";
            segment += "        <audio>" + Element("txtAudioCue").value + "</audio>\r\n";
            segment += "        <video>" + Element("txtVideoCue").value + "</video>\r\n";
            segment += "        <talent>" + Element("txtTalentCue").value + "</talent>\r\n";
            segment += "        <other>" + Element("txtOtherCue").value + "</other>\r\n";
            segment += "    </segment>\r\n";
            segment += "</segmentclip>";
            
            var f = new File(strPath + objSystem.separator + strID);
            f.open("w");
            f.write(segment);
            f.close();
        }
    }
    else
    {
        opener.UpdateSegment(Element("txtSegmentTitle").value, Element("txtSegmentText").value, Element("txtCameraCue").value, Element("txtAudioCue").value, Element("txtVideoCue").value, Element("txtTalentCue").value, Element("txtOtherCue").value, strID, window.arguments[2]);
    }
    
    window.close();
}

// What to do if the user presses the "Cancel" button
function OnCmdCancel()
{
    window.close();
}

// Actions to perform if save to clip checkbox is clicked
function OnNewToClipClick()
{
    if(!Element("chkNewToClip").checked)
    {
        objPrefs.setBoolPref("telekast.clip.newtoclip", true);
    }
    else
    {
        objPrefs.setBoolPref("telekast.clip.newtoclip", false);
    }
}
