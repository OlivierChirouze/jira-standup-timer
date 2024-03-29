// ==UserScript==
// @name         JIRA stand-up timer
// @namespace    https://github.com/OlivierChirouze/jira-standup-timer/
// @version      1.2
// @update       https://github.com/OlivierChirouze/jira-standup-timer/raw/master/JIRA%20standup%20timer.user.js
// @description  Add a timer to JIRA board
// @author       OlivierChirouze
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

// Labels
let startHour;
let endHour;
let zoomId;
let autoOpenZoom;
let autoOpenDelayMin;
let useZoom;
let alignRight;

const tick = 200;

const notEmpty = (val) => val !== undefined && val !== "";
const configOk = () => notEmpty(startHour) && notEmpty(endHour); // TODO could do better validation! (like end > start)
const zoomUrl = () => 'https://zoom.us/j/' + zoomId;
const withHour = (date, hour) => new Date(Date.parse(date.toDateString() + " " + hour));
const plusMillisec = (date, minutesToAdd) => new Date(date.valueOf() + minutesToAdd);
const plusMin = (date, minutesToAdd) => plusMillisec(date, minutesToAdd * 60000);
let getDate = () => new Date();

function getConfigValue(name, defaultValue, promptText, forceUpdate = false) {
    let value = GM_getValue(name);

    if (value === undefined || forceUpdate) {
        value = prompt(promptText, value === undefined ? defaultValue : value);
        if (value === null) {
            return undefined;
        }
        GM_setValue(name, value);
    }

    return value;
}

function getBoolConfigValue(name, promptText, forceUpdate = false) {
    let value = GM_getValue(name);

    if (value === undefined || forceUpdate) {
        value = confirm(promptText);
        GM_setValue(name, value);
    }

    return value;
}

function buildConfig(reset = false) {
    startHour = getConfigValue("startHour", "9:45", "At what time does your stand-up START? (hh:mm)", reset);
    endHour = getConfigValue("endHour", "10:00", "At what time does your stand-up END? (hh:mm)", reset);
    alignRight = getBoolConfigValue("alignRight", "Align timer right? (otherwise align left)", reset);
    useZoom = getBoolConfigValue("useZoom", "Do you want to integrate Zoom link?", reset);

    if (useZoom) {
        zoomId = getConfigValue("zoomId", "", "Enter the Zoom id of your stand-up", reset);
        autoOpenZoom = getBoolConfigValue("autoOpenZoom", "Do you want the Zoom meeting to open automatically when stand-up starts?", reset);
        autoOpenDelayMin = getConfigValue("autoOpenDelayMin", "", "How many minutes before the meeting starts, do you want Zoom to open?", reset);
    } else {
        zoomId = undefined;
        autoOpenDelayMin = undefined;
        autoOpenZoom = false;
    }
}

function addTimer() {
    'use strict';

    const now = new Date();

    const meetingStart = withHour(now, startHour);
    const zoomOpening = plusMin(meetingStart, -autoOpenDelayMin);
    const meetingEnd = withHour(now, endHour);
    let blinked = false;
    let meetingOpened = false;

    function getColors(value) {
        // value from 0 to 1
        if (value === 0) {
            return {
                background: "white",
                font: "black"
            };
        }
        let hue = ((1 - value) * 120).toString(10);
        return {
            background: ["hsl(", hue, ",100%,50%)"].join(""),
            font: value <= 0.8 ? "black" : "white"
        };
    }

    let checkTime = (i) => (i < 10) ? "0" + i : i;

    let isOver = false;

    function updateTime() {
        setTimeout(updateTime, tick);

        // If user is currently hovering the div, don't update
        if (isOver)
            return;

        const now = getDate();
        const h = now.getHours();
        const m = checkTime(now.getMinutes());
        //const s = checkTime(now.getSeconds());

        const timer = document.querySelector('#standupTimer');
        timer.innerHTML = h + ":" + m; //+ ":" + s;


        if (autoOpenZoom && !meetingOpened
            && now > zoomOpening && now < meetingEnd) {
            window.open(zoomUrl());
            meetingOpened = true;
        }

        if (now > meetingStart) {
            let timeSpent = (now - meetingStart) / (meetingEnd - meetingStart);

            if (timeSpent > 1) {
                if (timeSpent < 1.2) {
                    // Blink red on overdue, up to 20% overdue
                    timeSpent = blinked ? 1 : 0;
                    blinked = !blinked;
                } else {
                    timeSpent = 0;
                    // Make sure to reset flag for open meeting (in case the page stays open 24h!)
                    meetingOpened = true;
                }
            }

            let colors = getColors(timeSpent);
            timer.style.backgroundColor = colors.background;
            timer.style.color = colors.font;
        }
    }

    const standupId = 'standupTimer';

    const timerDiv = document.createElement('div');
    removeIfExists(standupId);

    timerDiv.setAttribute('id', standupId);
    timerDiv.setAttribute('class', 'js-quickfilter-button');
    timerDiv.setAttribute('style', 'font-size: 14pt; float: ' + (alignRight ? 'right' : 'left') + '; padding: 2px 5px 2px 5px; margin: 0 50px 0 0; border-radius: 3.01px; color: black');
    timerDiv.onclick = () => {
        buildConfig(true);
        run();
    };

    const prefSpan = document.createElement('span');
    prefSpan.setAttribute('class', 'aui-icon aui-icon-small aui-iconfont-configure');

    timerDiv.onmouseover = () => {
        timerDiv.innerHTML = startHour + " - " + endHour;
        timerDiv.appendChild(prefSpan);
        isOver = true;
    };

    timerDiv.onmouseout = () => {
        isOver = false;
    };

    document.querySelector('#ghx-controls-work').appendChild(timerDiv);

    updateTime()
}

function removeIfExists(elementId) {
    if (document.querySelector('#' + elementId) !== null)
        document.querySelector('#' + elementId).remove();
}

function addZoomLink() {
    'use strict';

    const zoomId = 'zoomLink';

    removeIfExists(zoomId);

    const link = document.createElement('a');
    link.setAttribute('id', zoomId);
    link.setAttribute('href', zoomUrl());
    link.setAttribute('target', 'zoom');
    const bjImg = document.createElement('img');
    bjImg.setAttribute('src', 'https://zoom.us/zoom.ico');
    bjImg.setAttribute('width', '16');
    bjImg.setAttribute('height', '16');
    link.appendChild(bjImg);

    document.querySelector('#js-work-quickfilters').appendChild(link);
}

function run() {
    if (useZoom) {
        // Leave some time for the page to load
        setTimeout(addZoomLink, 1000);
    }

    if (configOk()) {
        // Leave some time for the page to load
        setTimeout(addTimer, 1000);
    }
}

buildConfig();
run();
