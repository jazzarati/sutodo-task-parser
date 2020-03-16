const tagRegex = /#(\w+)/g
function extractTags(desc) {
    return (desc.match(tagRegex) || []).map(m => m.replace('#', ''))
}

function formatDate(date) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const dueddmmRegex = /by (\d+)\/(\d+)/

const dueDayOfWeekRegex = /by (mon|tue|wed|thu|thur|fri|sat|sun)/
const shortNameToDayNumber = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'thur': 4,
    'fri': 5,
    'sat': 6
};

const nonDateRegex = /by (today|tomorrow)/

function extractDueDate(desc) {
    const matchesDueddmm = desc.match(dueddmmRegex)

    if (matchesDueddmm != null) {
        const targetDate = new Date(new Date().getFullYear(), matchesDueddmm[2], matchesDueddmm[1])
        if (targetDate.getMonth() < new Date().getMonth()
            || targetDate.getMonth() == new Date().getMonth() && targetDate.getDate() < new Date().getDate()) {
                targetDate.setFullYear(targetDate.getFullYear() + 1);
            }
        return formatDate(targetDate)
    }

    const matchesDayOfWeek = desc.match(dueDayOfWeekRegex)
    if (matchesDayOfWeek != null) {
        const currentDayOfWeek = new Date().getDay();
        const targetDayOfWeekNumber = shortNameToDayNumber[matchesDayOfWeek[1]];
        let daysToAdd = targetDayOfWeekNumber - currentDayOfWeek;
        daysToAdd = daysToAdd < 0 ? daysToAdd + 7 : daysToAdd;
        return formatDate(addDays(new Date(), daysToAdd));
    }

    const matchesNonDate = desc.match(nonDateRegex);
    if (matchesNonDate != null) {
        switch (matchesNonDate[1]) {
            case 'today':
                return formatDate(new Date());
            case 'tomorrow':
                return formatDate(addDays(new Date(), 1));
            default:
                throw `Unexpected desc ${matchesNonDate[1]}`;
        }
    }

    return null;
}

function parseTask(desc) {

    return {
        desc,
        tags: extractTags(desc),
        due: extractDueDate(desc)
    }
}

module.exports = parseTask;
