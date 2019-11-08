# JIRA stand-up timer

This little script does only two things on your favorite JIRA board, but it does it well:

- display a timer that turns from green to red when you get closer to the end of the stand-up meeting.
Blink red for some time when you pass the end of the meeting
- (optional) allow you to quickly open a related Zoom meeting (for those doing remote stand-ups)

## Installation
This script is meant to be used with Greasemonkey / Tampermonkey *browser extension*.
Install either one depending on your browser (Firefox / Chrome).

Then add this script as a user script and follow the "configuration" instructions.

## Configuration

### 1. Define user match

Since you will want to use this on _your own JIRA board_, you will need to configure it to "match" that board URL.
Visit the _parameters_ section of the script (in your favorite extension) and paste the board URL in the user's match section.

## 2. Configure your meeting and zoom integration

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

The only thing worth mentioning is that you can change configuration
by clicking on the timer itself.

All the rest should work magically!

## Improvements

Many things could be improved, on the top of my head come:
- make it better looking
- use Typescript and auto compilation as a github action
- nicer configuration panel
- add a progress circle, similar to https://loading.io/progress/
- allow for "per user" timer (split time by the number of people on the board).
This is tricky because you want to keep some flexibility
- support multiple boards with different configuration