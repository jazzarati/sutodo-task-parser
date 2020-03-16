const test = require('ava');
const parseTask = require('../build/sutodo-task-parser')

function formatDueDate(date) {
	return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}

test('stores initial description', t => {
    const desc = "Do this"
	t.deepEqual(parseTask(desc), {
		desc,
		tags: [],
		due: null
	})
})

test('stores a tag', t => {
	const desc = "This #first one"
	t.deepEqual(parseTask(desc), {
		desc,
		tags: ["first"],
		due: null
	})
})

test('detects multiple tags', t => {
	const desc = "#first one #then the #second"
	t.deepEqual(parseTask(desc), {
		desc,
		tags: ["first", "then", "second"],
		due: null
	})
})

test("detects due calendar date by dd/mm", t => {
	const desc = "buy by 22/11"
	t.deepEqual(parseTask(desc), {
		desc,
		tags: [],
		due: '22/11/' + new Date().getFullYear()
	})
})

test("detects due calendar date by dd/mm next year", t => {
	const desc = "buy by 1/1"
	const nextYear = new Date(new Date().getFullYear() + 1, 1, 1);
	t.deepEqual(parseTask(desc), {
		desc,
		tags: [],
		due: '1/1/' + nextYear.getFullYear()
	})
})

const toShortName = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
test("detects due calendar date by casual day name same as day means next week", t => {
	const intialDay = new Date().getDay();
	for (let currentDay = intialDay; currentDay < intialDay + 7; currentDay++) {
		const day = toShortName[currentDay > 6 ? currentDay - 7 : currentDay];
		const desc = "buy by " + day

		const targetDate = new Date();
		const daysToAdd = currentDay - intialDay;
		targetDate.setDate(targetDate.getDate() + daysToAdd);
		t.deepEqual(parseTask(desc), {
			desc,
			tags: [],
			due: formatDueDate(targetDate)
		})
	}
})

test("detects due date by today", t => {
	const desc = "buy by today"
	const targetDate = new Date();
	t.deepEqual(parseTask(desc), {
		desc,
		tags: [],
		due: formatDueDate(targetDate)
	})
})

test("detects due date by tomorrow", t => {
	const desc = "buy by tomorrow"

	const targetDate = new Date();
	targetDate.setDate(targetDate.getDate() + 1);
	t.deepEqual(parseTask(desc), {
		desc,
		tags: [],
		due: formatDueDate(targetDate)
	})
})
