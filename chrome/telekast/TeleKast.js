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
   David Czechowski, 2011

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

// TeleKast Utilities JavaScript

// Variables
var strTeleprompterPath;
var strTeleprompterCSSPath;
var strTeleprompterJSPath;
var strStylesheetPath;
var strSegmentPreviewPath;
var strPrintDocument;
var strScriptPath;
var strAppDir;
var blnScriptSaved;
var strTeleKast;
var objSystem;
var objDirUtils;
var objFileUtils;
var Prompts;
var objPrefs;
var intClipAutoRefresh;
var intClipAutoRefreshCounter;
var intNotifications;
var strLock;
var intUpdate;

// jslib Includes
include("chrome://jslib/content/io/dir.js");
include("chrome://jslib/content/io/dirUtils.js");
include("chrome://jslib/content/io/file.js");
include("chrome://jslib/content/io/fileUtils.js");
include("chrome://jslib/content/utils/system.js");
include("chrome://jslib/content/utils/date.js");

// Initialize
function init()
{
    // Initialize variables.

    objSystem = new System;
    objDirUtils = new DirUtils;
    objFileUtils = new FileUtils;
    Prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    intClipAutoRefreshCounter = 0;
    objPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    strLock = "0";
    strTeleKast = objDirUtils.getHomeDir() + objSystem.separator + Element("TeleKastProperties").getString("TELEKAST_FILES");
    strTeleprompterPath = strTeleKast + objSystem.separator + "teleprompter.html";
    strTeleprompterCSSPath = strTeleKast + objSystem.separator + "teleprompter.css";
    strTeleprompterJSPath = strTeleKast + objSystem.separator + "teleprompter.js";
    strStylesheetPath = strTeleKast + objSystem.separator + "segment_preview.css";
    strSegmentPreviewPath = strTeleKast + objSystem.separator + "segment_preview.html";
    strPrintDocument = strTeleKast + objSystem.separator + "print.html";
    strAppDir = objDirUtils.getChromeDir().substring(0, objDirUtils.getChromeDir().lastIndexOf(objSystem.separator));
    strAppDir = strAppDir.substring(0, strAppDir.lastIndexOf(objSystem.separator));

    CreateDefaultPrefs();
    CreateDefaultFolder();
    CreatePreviewStyleSheet();
    CreateBlankPreview();
}

// Creates default preferences that the user can change later.
function CreateDefaultPrefs()
{
    // Folder Paths
    try
    {
        objPrefs.getCharPref("telekast.folders.filepath");
    }
    catch(e)
    {
        objPrefs.setCharPref("telekast.folders.filepath", objDirUtils.getHomeDir());
    }
    
    // Segment Clip
    try
    {
        objPrefs.getCharPref("telekast.folders.clippath");
    }
    catch(e)
    {
        objPrefs.setCharPref("telekast.folders.clippath", strTeleKast + objSystem.separator + "Segment Clip");
    }
    
    try
    {
        objPrefs.getBoolPref("telekast.clip.autorefresh");
    }
    catch(e)
    {
        objPrefs.setBoolPref("telekast.clip.autorefresh", true);
    }
    
    try
    {
        objPrefs.getIntPref("telekast.clip.autorefresh.delay");
    }
    catch(e)
    {
        objPrefs.setIntPref("telekast.clip.autorefresh.delay", "15");
    }
    
    try
    {
        objPrefs.getBoolPref("telekast.clip.newtoclip");
    }
    catch(e)
    {
        objPrefs.setBoolPref("telekast.clip.newtoclip", false);
    }
    
    // Teleprompter
    try
    {
        objPrefs.getCharPref("telekast.teleprompter.bgcolor");
    }
    catch(e)
    {
        objPrefs.setCharPref("telekast.teleprompter.bgcolor", "#000000");
    }
    
    try
    {
        objPrefs.getCharPref("telekast.teleprompter.forecolor");
    }
    catch(e)
    {
        objPrefs.setCharPref("telekast.teleprompter.forecolor", "#ffffff");
    }
    
    try
    {
        objPrefs.getCharPref("telekast.teleprompter.segnumcolor");
    }
    catch(e)
    {
        objPrefs.setCharPref("telekast.teleprompter.segnumcolor", "#333333");
    }
    
    try
    {
        objPrefs.getIntPref("telekast.teleprompter.defaultspeed");
    }
    catch(e)
    {
        objPrefs.setIntPref("telekast.teleprompter.defaultspeed", 4);
    }
    
    try
    {
        objPrefs.getIntPref("telekast.teleprompter.textsize");
    }
    catch(e)
    {
        objPrefs.setIntPref("telekast.teleprompter.textsize", 120);
    }
    
    try
    {
    	objPrefs.getBoolPref("telekast.teleprompter.mirror-horz");
    }
    catch(e)
    {
    	objPrefs.setBoolPref("telekast.teleprompter.mirror-horz",false);
    }

    try
    {
    	objPrefs.getBoolPref("telekast.teleprompter.mirror-vert");
    }
    catch(e)
    {
    	objPrefs.setBoolPref("telekast.teleprompter.mirror-vert",false);
    }

    // Check for update preference
    try
    {
        objPrefs.getBoolPref("telekast.update.checkforupdate");
    }
    catch(e)
    {
        objPrefs.setBoolPref("telekast.update.checkforupdate", true);
    }
}

// Creates .telekast in the user's home folder.
function CreateDefaultFolder()
{
    // User's .telekast Folder
    var objDir = new Dir(strTeleKast);
    if (!objDir.exists())
    {
        objDir.create();
        
        CreateEmptySegmentClip();
    }
}

// Creates the stylesheet for the segment preview.
function CreatePreviewStyleSheet()
{
    var f = new File(strStylesheetPath);
    if(f.exists())
    {
        f.remove();
    }

    // Create CSS for segment preview.
    var strCSS = "body {font-family: Arial; background-color: " + objPrefs.getCharPref("telekast.teleprompter.bgcolor") + "; color: " + objPrefs.getCharPref("telekast.teleprompter.forecolor") + ";}"
    
    // Create new file to put stylesheet in.
    f.open("w");
    f.write(strCSS);
    f.close();
}

// Creates the default blank segment preview page.
function CreateBlankPreview()
{
    var f = new File(strSegmentPreviewPath);
    if(f.exists())
    {
        f.remove();
    }

    // Create HTML document for default blank segment preview page.
    var strHTML = "<html>\r\n";
    strHTML += "  <head>\r\n";
    strHTML += "    <title>Blank</title>\r\n";
    strHTML += "    <link rel=\"stylesheet\" type=\"text/css\" href=\"segment_preview.css\" title=\"Default\" />\r\n";
    strHTML += "  </head>\r\n";
    strHTML += "  <body>\r\n";
    strHTML += "  </body>\r\n";
    strHTML += "</html>";
    
    // Create new file to put HTML in.
    f.open("w");
    f.write(strHTML);
    f.close();
}

// Prepares the teleprompter files.
function PrepareTeleprompter()
{
    // Creates teleprompter.html
    var f = new File(strAppDir + objSystem.separator + "teleprompter" + objSystem.separator + "teleprompter.html");
    if(f.exists())
    {
        f.open("r");
        var t = f.read();
        f.close();
            
        var strHTML = "";
        var segments = Element("lstScript");
        for(var i=0; i<segments.getRowCount(); i++)
        {
            segment = segments.getItemAtIndex(i).value.split("|");
            strHTML += "                <span class=\"cssSegmentNumbers\">" + (i + 1) + "</span><br />\r\n"
            strHTML += "                " + segment[1] + "<br />\r\n";
        }
            
        t = t.replace("[content]", strHTML); 
        f = new File(strTeleprompterPath);
        f.open("w");
        f.write(t);
        f.close();
    }
    
    // Creates teleprompter.css
    f = new File(strAppDir + objSystem.separator + "teleprompter" + objSystem.separator + "teleprompter.css");
    if(f.exists())
    {
        f.open("r");
        var css = f.read();
        f.close();
        
        var scaleX = 1;
        var scaleY = 1;
        if(objPrefs.getBoolPref("telekast.teleprompter.mirror-horz")) {
        	scaleX = scaleX * -1;
        }
        if(objPrefs.getBoolPref("telekast.teleprompter.mirror-vert")) {
        	scaleY = scaleX * -1;
        }
        var strMirroring = "-moz-transform: scaleX(" + scaleX + ") scaleY(" + scaleY + ");";

        css = css.replace(/\[bgcolor\]/g, objPrefs.getCharPref("telekast.teleprompter.bgcolor"));
        css = css.replace(/\[fontcolor\]/g, objPrefs.getCharPref("telekast.teleprompter.forecolor"));
        css = css.replace(/\[fontsize\]/g, objPrefs.getIntPref("telekast.teleprompter.textsize"));
        css = css.replace(/\[segnumcolor\]/g, objPrefs.getCharPref("telekast.teleprompter.segnumcolor"));
	    css = css.replace(/\[mirroring\]/g, strMirroring);

        f = new File(strTeleprompterCSSPath);
        f.open("w");
        f.write(css);
        f.close();
    }
    
    // Creates teleprompter.js
    f = new File(strAppDir + objSystem.separator + "teleprompter" + objSystem.separator + "teleprompter.js");
    if(f.exists())
    {
        f.open("r");
        var js = f.read();
        f.close();
        
        js = js.replace("[speed]", objPrefs.getIntPref("telekast.teleprompter.defaultspeed"));
        f = new File(strTeleprompterJSPath);
        f.open("w");
        f.write(js);
        f.close();
    }
}

// Creates the default empty segment clip.
function CreateEmptySegmentClip()
{
    // User's Segment Clip Folder
    var objDir = new Dir(strTeleKast + objSystem.separator + "Segment Clip");
    if (!objDir.exists())
    {
        objDir.create();
    }
}

// Initializes a "Save As" dialog and returns a file path.
function SaveScriptAsPrompt()
{
    var strDefaultFolder = objPrefs.getCharPref("telekast.folders.filepath");
    var dir = Components.classes["@mozilla.org/file/local;1"].createInstance();
    dir.QueryInterface(Components.interfaces.nsILocalFile);
    dir.initWithPath(strDefaultFolder);
    
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, Element("TeleKastProperties").getString("TELEKAST_SAVE_AS"), nsIFilePicker.modeSave);
    fp.appendFilters(nsIFilePicker.filterXML);
    fp.displayDirectory = dir;
    var r = fp.show();
    if (r == nsIFilePicker.returnOK || r == nsIFilePicker.returnReplace)
    {
        objPrefs.setCharPref("telekast.folders.filepath", fp.file.path.substring(0, fp.file.path.lastIndexOf(objSystem.separator)));
        path = fp.file.path;
        if(path.indexOf(".xml") == -1)
        {
            path += ".xml";
        }
        return path;
    }
    else
    {
        return null;
    }
}

// Initializes a "Open" dialog and returns a file path.
function OpenScriptPrompt()
{
    var strDefaultFolder = objPrefs.getCharPref("telekast.folders.filepath");
    var dir = Components.classes["@mozilla.org/file/local;1"].createInstance();
    dir.QueryInterface(Components.interfaces.nsILocalFile);
    dir.initWithPath(strDefaultFolder);
    
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, Element("TeleKastProperties").getString("TELEKAST_OPEN"), nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterXML);
    fp.displayDirectory = dir;
    var r = fp.show();
    if (r == nsIFilePicker.returnOK)
    {
        objPrefs.setCharPref("telekast.folders.filepath", fp.file.path.substring(0, fp.file.path.lastIndexOf(objSystem.separator)));
        return fp.file.path;
    }
    else
    {
        return null;
    }

}

// Initializes an "Open Folder" dialog and moves the clip to the new folder if there isn't a clip already.
function ClipFolderPrompt()
{
    var strDefaultFolder = objPrefs.getCharPref("telekast.folders.clippath");
    var dir = Components.classes["@mozilla.org/file/local;1"].createInstance();
    dir.QueryInterface(Components.interfaces.nsILocalFile);
    dir.initWithPath(strDefaultFolder);
    
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, Element("TeleKastProperties").getString("TELEKAST_SELECT_FOLDER"), nsIFilePicker.modeGetFolder);
    fp.displayDirectory = dir;
    var r = fp.show();
    if (r == nsIFilePicker.returnOK)
    {
        var strOldPath = objPrefs.getCharPref("telekast.folders.clippath");
        objPrefs.setCharPref("telekast.folders.clippath", fp.file.path);
        
        var dir = new Dir(fp.file.path);
        var files = dir.readDir();
        if(files.length == 0)
        {
            dir = new Dir(strOldPath);
            files = dir.readDir()
            for(var i=0; i<files.length; i++)
            {
                if(files[i].isFile())
                {
                    if(files[i].ext == "xml")
                    {
                        files[i].move(fp.file.path + objSystem.separator + files[i].leaf);
                    }
                }
            }
        }
        else
        {
            dir = new Dir(strOldPath);
            files = dir.readDir()
            for(var i=0; i<files.length; i++)
            {
                if(files[i].isFile())
                {
                    files[i].remove();
                }
            }
        }
        
        return fp.file.path;
    }
    else
    {
        return null;
    }
}

// Initializes a "Open Folder" dialog to set the Script file path.
function ScriptFilePathPrompt()
{
    var strDefaultFolder = ""
    
    try
    {
        strDefaultFolder = objPrefs.getCharPref("telekast.folders.filepath");
    }
    catch(e)
    {
        strDefaultFolder = strTeleKast;
    }
    var dir = Components.classes["@mozilla.org/file/local;1"].createInstance();
    dir.QueryInterface(Components.interfaces.nsILocalFile);
    dir.initWithPath(strDefaultFolder);
    
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, Element("TeleKastProperties").getString("TELEKAST_SELECT_FOLDER"), nsIFilePicker.modeGetFolder);
    fp.displayDirectory = dir;
    var r = fp.show();
    if (r == nsIFilePicker.returnOK)
    {
        objPrefs.setCharPref("telekast.folders.filepath", fp.file.path);
    }
}

// Update the saved boolean and titlebar.
function UpdateScriptSaved(saved)
{
    if(saved)
    {
        blnScriptSaved = true;
        document.title = Element("TeleKastProperties").getString("TELEKAST_TITLE") + " [" + strScriptPath + "]";
        
        Element("cmdSaveScript").setAttribute("disabled", "true");
    }
    else
    {
        blnScriptSaved = false;
        document.title = Element("TeleKastProperties").getString("TELEKAST_TITLE") + " [*" + strScriptPath + "]";
        
        Element("cmdSaveScript").removeAttribute("disabled");
        Element("cmdSaveScriptAs").removeAttribute("disabled");
    }
    
    
}

// Adds a segment to the script or segment clip.
function AddSegment(title, text, camera, audio, video, talent, other, id, which)
{
    var item = Element("lst" + which).appendItem(title, title + "|" + text + "|" + camera + "|" + audio + "|" + video + "|" + talent + "|" + other + "|" + id);
    item.setAttribute("class", "listitem-iconic");
    item.setAttribute("image", "images/segment_title.png");
    
    switch(which)
    {
        case "Script":
            UpdateScriptSaved(false);
            Element("cmdShowTeleprompter").removeAttribute("disabled");
            Element("cmdScriptDeleteAllSegments").removeAttribute("disabled");
            break;
            
        case "SegmentClip":
            Element("cmdClipDeleteAllSegments").removeAttribute("disabled");
            break;
    }
}

// Updates a segment on the script or segment clip.
function UpdateSegment(title, text, camera, audio, video, talent, other, id, which)
{
    var item = Element("lst" + which).selectedItem;
    item.label = title
    item.value = title + "|" + text + "|" + camera + "|" + audio + "|" + video + "|" + talent + "|" + other + "|" + id;
    
    switch(which)
    {
        case "Script":
            UpdateScriptSaved(false);
            break;
            
        case "SegmentClip":
            var segment = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
            segment += "<segmentclip>\r\n";
            segment += "    <segment title=\"" + title + "\">\r\n";
            segment += "        <teleprompter>" + text + "</teleprompter>\r\n";
            segment += "        <camera>" + camera + "</camera>\r\n";
            segment += "        <audio>" + audio + "</audio>\r\n";
            segment += "        <video>" + video + "</video>\r\n";
            segment += "        <talent>" + talent + "</talent>\r\n";
            segment += "        <other>" + other + "</other>\r\n";
            segment += "    </segment>\r\n";
            segment += "</segmentclip>";
            
            var f = new File(objPrefs.getCharPref("telekast.folders.clippath") + objSystem.separator + id);
            f.open("w");
            f.write(segment);
            f.close();
            break;
    }
}

// Quit the application.
function quit (aForceQuit)
{
    var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
    getService(Components.interfaces.nsIAppStartup);

    // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
    // process if there is unsaved data. eForceQuit will quit no matter what.
    var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit : Components.interfaces.nsIAppStartup.eAttemptQuit;
    appStartup.quit(quitSeverity);
}

// Clears the segment preview elements.
function ClearSegmentPreview()
{
    CreateBlankPreview();
    Element("lblTitle").value = "";
    Element("lblCameraCue").value = "";
    Element("lblAudioCue").value = "";
    Element("lblVideoCue").value = "";
    Element("lblTalentCue").value = "";
    Element("lblOtherCue").value = "";
    window.setTimeout("Element('ctlSegmentPreview').reload();", 1000);
}

// Prompts user to ensure they want to save the script before moving on.
function UnsavedScriptPrompt()
{   
    var check = {value: false};
    var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
    var button = Prompts.confirmEx(window, Element("frmMainProperties").getString("CONFIRM_SCRIPT_SAVE_TITLE"), Element("frmMainProperties").getString("CONFIRM_SCRIPT_SAVE_PROMPT"), flags, Element("frmMainProperties").getString("CONFIRM_YES"), Element("frmMainProperties").getString("CONFIRM_NO"), null, null, check);
    if(button == 0)
    {
        SaveScript();
    }
}

// Saves the current script
function SaveScript()
{
    if(strScriptPath == "New File.xml")
    {
        SaveScriptAs();
    }
    else
    {
        var script = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
        script += "<script>\r\n";
        for(var i=0; i<Element("lstScript").getRowCount(); i++)
        {
            var segment = Element("lstScript").getItemAtIndex(i).value.split("|");
            script += "    <segment title=\"" + segment[0] + "\">\r\n";
            script += "        <teleprompter>" + segment[1] + "</teleprompter>\r\n";
            script += "        <camera>" + segment[2] + "</camera>\r\n";
            script += "        <audio>" + segment[3] + "</audio>\r\n";
            script += "        <video>" + segment[4] + "</video>\r\n";
            script += "        <talent>" + segment[5] + "</talent>\r\n";
            script += "        <other>" + segment[6] + "</other>\r\n";
            script += "    </segment>\r\n";
        }
        script += "</script>";
        
        var f = new File(strScriptPath);
        if(f.exists())
        {
            f.remove();
        }
        f.open("w");
        f.write(script);
        f.close();
        
        StatusNotification("Script '" + strScriptPath + "' Saved.");
        UpdateScriptSaved(true);
    }
}

// Prompts user for the file name before saving.
function SaveScriptAs()
{
    var path = SaveScriptAsPrompt();
    if(path != null)
    {
        strScriptPath = path;
        SaveScript();
    }
}

// Opens the segment clip.
function OpenSegmentClip()
{
    while(Element("lstSegmentClip").getRowCount()>0)
    {
        Element("lstSegmentClip").removeItemAt(0);
    }
    
    var strClipFolder = objPrefs.getCharPref("telekast.folders.clippath");

    var f = new File(strClipFolder + objSystem.separator + "segmentclip.xml");
    if(f.exists())
    {
        f.open("r");
        
        var xmlParser = new DOMParser();
        var xmlDoc = xmlParser.parseFromString(f.read(), "text/xml");
        
        f.close();
        f.remove();
        
        var segments = xmlDoc.getElementsByTagName("segment");
            
        for(var i=0; i<segments.length; i++)
        {
            var segment = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
            segment += "<segmentclip>\r\n";
            segment += "    <segment title=\"" + segments[i].getAttribute("title") + "\">\r\n";
            segment += "        <teleprompter>" + segments[i].getElementsByTagName("teleprompter")[0].textContent + "</teleprompter>\r\n";
            segment += "        <camera>" + segments[i].getElementsByTagName("camera")[0].textContent + "</camera>\r\n";
            segment += "        <audio>" + segments[i].getElementsByTagName("audio")[0].textContent + "</audio>\r\n";
            segment += "        <video>" + segments[i].getElementsByTagName("video")[0].textContent + "</video>\r\n";
            segment += "        <talent>" + segments[i].getElementsByTagName("talent")[0].textContent + "</talent>\r\n";
            segment += "        <other>" + segments[i].getElementsByTagName("other")[0].textContent + "</other>\r\n";
            segment += "    </segment>\r\n";
            segment += "</segmentclip>";
            
            f = new File(strClipFolder + objSystem.separator + jslibDate("U") + ".xml");
            f.open("w");
            f.write(segment);
            f.close();
        }
    }
    
    var dir = new Dir(strClipFolder);
    var files = dir.readDir();
    
    for(var i=0; i<files.length; i++)
    {
        if(files[i].isFile())
        {
            if(files[i].ext == "xml")
            {
                files[i].open("r");
                var xmlParser = new DOMParser();
                var xmlDoc = xmlParser.parseFromString(files[i].read(), "text/xml");
                files[i].close();
                var segment = xmlDoc.getElementsByTagName("segment")[0];

                var title = segment.getAttribute("title");
                var text = segment.getElementsByTagName("teleprompter")[0].textContent;
                var camera = segment.getElementsByTagName("camera")[0].textContent;
                var audio = segment.getElementsByTagName("audio")[0].textContent;
                var video = segment.getElementsByTagName("video")[0].textContent;
                var talent = segment.getElementsByTagName("talent")[0].textContent;
                var other = segment.getElementsByTagName("other")[0].textContent;
                AddSegment(title, text, camera, audio, video, talent, other, files[i].leaf, "SegmentClip");                
            }
        }
    }
    
    if(Element("lstSegmentClip").getRowCount() > 0)
    {
        Element("cmdClipDeleteAllSegments").removeAttribute("disabled");
    }
}

// Segment Clip Refresh Timer
function SegmentClipRefresh()
{
    
    if(intClipAutoRefreshCounter == objPrefs.getIntPref("telekast.clip.autorefresh.delay"))
    {
        Element("sbpClipAutoRefresh").label = intClipAutoRefreshCounter + "s";
        intClipAutoRefreshCounter = 0;
        OpenSegmentClip();
        window.clearTimeout(intClipAutoRefresh);
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
    else
    {
        Element("sbpClipAutoRefresh").label = intClipAutoRefreshCounter + "s";
        intClipAutoRefreshCounter++;
        window.clearTimeout(intClipAutoRefresh);
        intClipAutoRefresh = window.setTimeout("SegmentClipRefresh();", 1000);
    }
}

// Saves the segment clip.
function SaveSegmentClip()
{
    if(LockClip())
    {
        var clip = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
        clip += "<segmentclip>\r\n";
        for(var i=0; i<Element("lstSegmentClip").getRowCount(); i++)
        {
            var segment = Element("lstSegmentClip").getItemAtIndex(i).value.split("|");
            clip += "    <segment title=\"" + segment[0] + "\">\r\n";
            clip += "        <teleprompter>" + segment[1] + "</teleprompter>\r\n";
            clip += "        <camera>" + segment[2] + "</camera>\r\n";
            clip += "        <audio>" + segment[3] + "</audio>\r\n";
            clip += "        <video>" + segment[4] + "</video>\r\n";
            clip += "        <talent>" + segment[5] + "</talent>\r\n";
            clip += "        <other>" + segment[6] + "</other>\r\n";
            clip += "    </segment>\r\n";
        }
        clip += "</segmentclip>";

        var f = new File(objPrefs.getCharPref("telekast.folders.clippath") + objSystem.separator + "segmentclip.xml");
        if(f.exists())
        {
            f.remove();
        }
        f.open("w");
        f.write(clip);
        f.close();
        
        StatusNotification("Segment Clip Saved.");
        
        UnlockClip();
    }
    else
    {
        Prompts.alert(this, Element("frmMainProperties").getString("ALERT_CLIP_LOCKED_TITLE"), Element("frmMainProperties").getString("ALERT_CLIP_LOCKED_PROMPT"));
    }
}

// Generates a printable document for the script.
function ShowPrintScriptDialog(camera, audio, video, talent, other)
{
    var strImages = "file://"+ strAppDir + objSystem.separator + "print" + objSystem.separator + "images" + objSystem.separator;
    strImages = strImages.replace(" ", "%20");

    var HTML = "<html>\r\n";
    HTML += "<head>\r\n";
    HTML += "<title>TeleKast</title>\r\n";
    HTML += "</head>\r\n";
    HTML += "<body>\r\n";
    for(var i=0; i<Element("lstScript").getRowCount(); i++)
    {
        var segment = Element("lstScript").getItemAtIndex(i).value.split("|");
        HTML += "<p>\r\n";
        HTML += (i + 1) + ") " + segment[0] + ": " + segment[1] + "\r\n";
        HTML += "<ul>\r\n";
        if(segment[2] != "" && camera)
        {
            HTML += "<li><img src=\"" + strImages + "camera_cue.png\" /> " + Element("frmMainProperties").getString("CAMERA") + ": " + segment[2] + "</li>\r\n";
        }
        if(segment[3] != "" && audio)
        {
            HTML += "<li><img src=\"" + strImages + "audio_cue.png\" /> " + Element("frmMainProperties").getString("AUDIO") + ": " + segment[3] + "</li>\r\n";
        }
        if(segment[4] != "" && video)
        {
            HTML += "<li><img src=\"" + strImages + "video_cue.png\" /> " + Element("frmMainProperties").getString("VIDEO") + ": " + segment[4] + "</li>\r\n";
        }
        if(segment[5] != "" && talent)
        {
            HTML += "<li><img src=\"" + strImages + "talent_cue.png\" /> " + Element("frmMainProperties").getString("TALENT") + ": " + segment[5] + "</li>\r\n";
        }
        if(segment[6] != "" && other)
        {
            HTML += "<li><img src=\"" + strImages + "other_cue.png\" /> " + Element("frmMainProperties").getString("OTHER") + ": " + segment[6] + "</li>\r\n";
        }
        HTML += "</ul>\r\n";
        HTML += "</p>\r\n";
    }
    HTML += "</body>\r\n";
    HTML += "</html>\r\n";
    
    var f = new File(strPrintDocument);
    if(f.exists())
    {
        f.remove();
    }
    f.open("w")
    f.write(HTML);
    f.close();
    
    window.openDialog("chrome://telekast/content/frmPrint.xul", "frmPrint", "centerscreen", strPrintDocument);
    
    StatusNotification("Printing " + strScriptPath + ".");
}

// Puts a message in the notifications status bar panel.
function StatusNotification(label)
{
    if(intNotifications)
    {
        window.clearTimeout(intNotifications);
    }
    
    Element("sbpNotifications").label = label;
    intNotifications = window.setTimeout("ClearNotification();", 5000);
}

// Clears the any message in the notifications status bar panel.
function ClearNotification()
{
    Element("sbpNotifications").label = "";
}

// Opens the supplied URI in the user's default Web browser.
function OpenURI(uri)
{
    var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    var uriToOpen = ioservice.newURI(uri, null, null);
    var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
    extps.loadURI(uriToOpen, null);
}

// Checks to see if the requested segment is locked. If unlocked, this will lock it for the user.
function LockSegment(id)
{
    var lock = new File(objPrefs.getCharPref("telekast.folders.clippath") + objSystem.separator + id + ".lock");
    if(lock.exists())
    {
        lock.open("r");
        if(strLock == lock.read())
        {
            lock.close();
            return true;
        }
        else
        {
            lock.close();
            return false;
        }
    }
    else
    {
        strLock = jslibDate("U");
        lock.open("w");
        lock.write(strLock);
        lock.close();
        return true;
    }
}

// Releases the segment locked by the user.
function UnlockSegment(id)
{
    var lock = new File(objPrefs.getCharPref("telekast.folders.clippath") + objSystem.separator + id + ".lock");
    lock.remove();
}

// Checks to see if a new version is out.
function CheckForUpdate()
{
    StatusNotification(Element("TeleKastProperties").getString("CHECK_FOR_UPDATE"));
    
    var request = new XMLHttpRequest();
    request.open("GET", Element("TeleKastProperties").getString("TELEKAST_UPDATE_URL"), true);
    request.onload = CheckForUpdateOnLoad;
    request.onerror = CheckForUpdateOnError;
    request.send(null);
}

// Actions to perform when the update check loads the XML document.
function CheckForUpdateOnLoad(e)
{
    var xmlDoc = e.target.responseXML;
    var version = xmlDoc.getElementsByTagName("info")[0].textContent;
    
    if(version != Element("TeleKastProperties").getString("TELEKAST_VERSION"))
    {
        var check = {value: false};
        var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
        var button = Prompts.confirmEx(window, Element("TeleKastProperties").getString("CONFIRM_DOWNLOAD_TITLE") + " " + version, Element("TeleKastProperties").getString("CONFIRM_DOWNLOAD"), flags, Element("TeleKastProperties").getString("CONFIRM_YES"), Element("TeleKastProperties").getString("CONFIRM_NO"), null, null, check);
        if(button == 0)
        {
            if(xmlDoc.getElementsByTagName("info")[1].textContent == "full")
            {
                /* var check = {value: false};
                var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
                var button = Prompts.confirmEx(window, Element("TeleKastProperties").getString("CONFIRM_DOWNLOAD_TITLE") + " " + version, Element("TeleKastProperties").getString("CONFIRM_WEB_SITE"), flags, Element("TeleKastProperties").getString("CONFIRM_YES"), Element("TeleKastProperties").getString("CONFIRM_NO"), null, null, check);
                if(button == 0)
                { */
                    OpenURI("http://sourceforge.net/project/platformdownload.php?group_id=190048");
                // }
            }
            else if(xmlDoc.getElementsByTagName("info")[1].textContent == "files")
            {
                intUpdate = xmlDoc.getElementsByTagName("file").length;
                
                StatusNotification(intUpdate + " file(s) to download...");
                
                for(var i=0; i<xmlDoc.getElementsByTagName("file").length; i++)
                {
                    DownloadFile(xmlDoc.getElementsByTagName("file")[i].getAttribute("url"), strAppDir + objSystem.separator + xmlDoc.getElementsByTagName("file")[i].getAttribute("local").replace("/", objSystem.separator));
                }
            }
        }
    }
}

// Error received when doing an update check.
function CheckForUpdateOnError(e)
{
    alert("Error " + e.target.status + " occured while checking for an update.");
}

// Downloads the file from the url to the local path.
function DownloadFile(url, localPath)
{
    var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    var uri = ioservice.newURI(url, null, null);
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    var persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Components.interfaces.nsIWebBrowserPersist);
    file.initWithPath(localPath);
    
    var progressListener = { 
        stateIsRequest:false,
        QueryInterface : function(aIID) {
            if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
                aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
                aIID.equals(Components.interfaces.nsISupports))
                    return this;
            throw Components.results.NS_NOINTERFACE;
        },
        onStateChange : function(aProgress,aRequest,aFlag,aStatus){return 0;},

        onLocationChange : function(aProgress,aRequest,aLocation){return 0;},
        onProgressChange : function(aProgress,aRequest,aCurSelfProgress,aMaxSelfProgress,aCurTotalProgress,aMaxTotalProgress)
        {
            if(aCurTotalProgress == aMaxTotalProgress)
            {
                intUpdate--;
                StatusNotification(intUpdate + " file(s) left to download...");
                if(intUpdate == 0)
                {
                    StatusNotification("Update complete.");
                    var check = {value: false};
                    var flags = Prompts.BUTTON_POS_0 * Prompts.BUTTON_TITLE_IS_STRING + Prompts.BUTTON_POS_1 * Prompts.BUTTON_TITLE_IS_STRING;
                    var button = Prompts.confirmEx(window, Element("TeleKastProperties").getString("CONFIRM_RESTART_TITLE"), Element("TeleKastProperties").getString("CONFIRM_RESTART"), flags, Element("TeleKastProperties").getString("CONFIRM_YES"), Element("TeleKastProperties").getString("CONFIRM_NO"), null, null, check);
                    if(button == 0)
                    {
                        var nsIAppStartup = Components.interfaces.nsIAppStartup;
                        Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(nsIAppStartup).quit(nsIAppStartup.eForceQuit | nsIAppStartup.eRestart);
                    }
               }
            }
            return 0;
        },
        onStatusChange : function(a,b,c,d){},
        onSecurityChange : function(a,b,c){},
        onLinkIconAvailable : function(a){} 
    };
    persist.progressListener = progressListener;
    
    persist.saveURI(uri, null, null, null, null, file);
} 

// Returns a DOM element by the given id.
function Element(id)
{
    return document.getElementById(id);
}

// Returns a newly created DOM element with the given tag name.
function CreateElement(tag)
{
    return document.createElement(tag);
}

// Returns a newly created DOM attribute with the given name and value.
function CreateAttribute(name, value)
{
    var objAttribute = document.createAttribute(name);
    objAttribute.nodeValue = value;
    return objAttribute;
}
