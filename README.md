# JIRA stand-up timer

This little script does only two things on your favorite JIRA board, but it does it (relatively) well:

- display a timer that turns from green to red when you get closer to the end of the stand-up meeting.
Blink red for some time when you pass the end of the meeting
- (optional) add a link to a related Zoom meeting (for those doing remote stand-ups)
- (optional) automatically open that link just before the stand-up starts

![](./timer-screenshot.png)

## Installation
This script is meant to be used with Tampermonkey *browser extension*, available for both Firefox and Chrome.

Then add this script as a user script and follow the "configuration" instructions.

## Configuration

### 1. Define user match

- To use the script on the *current sprint* of your team, copy the URL you use to access it
and in the query string, replace everything that is not the project key by `* `.

Example:

From:
```
https://jira.mycompany.com/secure/RapidBoard.jspa?rapidView=2984&projectKey=CA&view=detail&selectedIssue=CA-28
```
..you would keep
```
https://jira.mycompany.com/secure/RapidBoard.jspa?*projectKey=CA*
```

- Visit the _parameters_ section of the script in Tampermonkey and paste this URL in the user's match section.

## 2. Configure the stand-up times and zoom integration

First time the script will launch (ie. when you access your board)
you will be prompted to enter the times of start and end of the stand-up meeting
and -assuming you wish to integrate with Zoom meetings- some Zoom information.

You may also wish to enter this information yourself as a JSON in the _storage_ section, it should look like this:

```json
{
    "startHour": "9:45",
    "endHour": "10:00",
    "useZoom": true,
    "zoomId": "12345678",
    "autoOpenZoom": true
}
```

## Usage

The timer and link to Zoom will be displayed as soon as your Jira board (current sprint) is loaded.

Note that you might have to refresh the current sprint page in case you navigated to the backlog and back.

The only thing worth mentioning is configuration can be updated by *clicking on the timer* itself.

All the rest should work magically!

## Limitations / possible improvements

Many things could be improved, on the top of my head come:
- make sure it remains after navigating in JIRA
- make it better looking
- use Typescript and auto compilation as a github action
- nicer configuration panel
- add a progress circle, similar to https://loading.io/progress/
- allow for "per user" timer (split time by the number of people on the board).
This is tricky because you want to keep some flexibility.
- support multiple boards with different configuration