var intCurrentTop = 0;
var intInterval = [speed];
var blnScrolling = false;

function Element(id)
{
    return document.getElementById(id);
}

function Startup()
{
    this.onkeypress = OnKeyPress;
    this.onkeyup = OnKeyUp;
}

function OnKeyPress(key)
{
    if (!key)
    {
        key = event;
    }
    // alert(key.keyCode);
    switch (key.keyCode)
    {
        case 27: // escape
            window.close();
            break;
        case 13: // enter
            if (blnScrolling)
            {
                blnScrolling = false;
            }
            else
            {
                blnScrolling = true;
                DoScroll();
            }
            break;
        case 33: // page up
            blnScrolling = false;
            intCurrentTop -= 768;
            Element("ScriptSegments").style.top = intCurrentTop + "px";
            break;
        case 34: // page down
            blnScrolling = false;
            intCurrentTop += 768;
            Element("ScriptSegments").style.top = intCurrentTop + "px";
            break;
        case 37: // left arrow
            if (intInterval > -9)
                intInterval -= 1;
            break;
        case 38: // up arrow
            blnScrolling = false;
            intCurrentTop -= 50;
            Element("ScriptSegments").style.top = intCurrentTop + "px";
            break;
        case 39: // right arrow
            if (intInterval < 9)
                intInterval += 1;
            break;
        case 40: // down arrow
            blnScrolling = false;
            intCurrentTop += 50;
            Element("ScriptSegments").style.top = intCurrentTop + "px";
            break;
    }
}

function OnKeyUp(key)
{
    if (!key)
    {
        key = event;
    }
    // alert(key.keyCode);
    switch (key.keyCode)
    {
        case 32: // spacebar
            if (blnScrolling)
            {
                blnScrolling = false;
            }
            else
            {
                blnScrolling = true;
                DoScroll();
            }
            break;
        case 48: // 0
        case 96: // 0
            blnScrolling = false;
            break;
        case 49: // 1
        case 97: // 1
            intInterval = 1;
            break;
        case 50: // 2
        case 98: // 2
            intInterval = 2;
            break;
        case 51: // 3
        case 99: // 3
            intInterval = 3;
            break;
        case 52: // 4
        case 100: // 4
            intInterval = 4;
            break;
        case 53: // 5
        case 101: // 5
            intInterval = 5;
            break;
        case 54: // 6
        case 102: // 6
            intInterval = 6;
            break;
        case 55: // 7
        case 103: // 7
            intInterval = 7;
            break;
        case 56: // 8
        case 104: // 8
            intInterval = 8;
            break;
        case 57: // 9
        case 105: // 9
            intInterval = 9;
            break;
        case 61: // plus
        case 107: // plus
            if(intInterval < 0)
              intInterval *= -1;
            break;
        case 109: // minus
            if(intInterval > 0)
              intInterval *= -1;
            break;
    }
}

function DoScroll()
{
    setTimeout("Scroll();", 1);
}

function Scroll()
{
    intCurrentTop -= intInterval;
    Element("ScriptSegments").style.top = intCurrentTop + "px";
    if (blnScrolling) DoScroll();
}
