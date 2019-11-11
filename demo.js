// Demo mode: showing the complete meeting time, accelerated.
// To be copied in main file for demo
const demoDay = getDate();
// Start one minute before
const demoStart = plusMin(withHour(demoDay, startHour), -1);
// End 2 minutes after
const demoEnd = plusMin(withHour(demoDay, endHour), 3);
const nbMillisec = demoEnd.valueOf() - demoStart.valueOf();

const demoTimes = [];
for (let timeToAdd = 0, i = 0; timeToAdd < nbMillisec; timeToAdd = timeToAdd + 60000 * tick / 1000) {
    demoTimes[i++] = plusMillisec(demoStart, timeToAdd);
}

let originalGetDate = getDate;
let demoI = -10;

getDate = () => {
    if (demoI < 0) {
        demoI++;
        return originalGetDate();
    }

    if (demoI > demoTimes.length) {
        // Demo finished!
        getDate = () => originalGetDate();
        return originalGetDate();
    }
    return demoTimes[demoI++];
};