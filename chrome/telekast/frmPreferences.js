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

// OnLoad
function OnLoad()
{
    init();
}

// Closes the color picker that is showing.
function CloseColorPicker(e)
{
    switch(e.target.id)
    {
        case "tpbgcolorpicker":
            Element("tpbgcolor").hidePopup();
            break;
        case "tpforecolorpicker":
            Element("tpforecolor").hidePopup();
            break;
        case "tpsegnumcolorpicker":
            Element("tpsegnumcolor").hidePopup();
            break;
    }
}
