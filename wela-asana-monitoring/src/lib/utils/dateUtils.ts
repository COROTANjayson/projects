export const FormatDateInWords = (dateString: string) => {
	const date = new Date(dateString);
	const options = { month: 'long', day: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions;
	const formattedDate = date.toLocaleDateString('en-US', options);
	return formattedDate;
};

export const getFormattedDate = () => {
	const today = new Date();
	const year = today.getFullYear();
	let month: any = today.getMonth() + 1;
	let day: any = today.getDate();
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
};
export const getCurrentDateFormatted = () => {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const today = new Date();
	const dayOfWeek = days[today.getDay()];
	const month = months[today.getMonth()];
	const day = today.getDate();

	const formattedDate = `${dayOfWeek}, ${month} ${day}`;

	return formattedDate;
};
export const getDateAt1159PM = (date: any) => {
	const currentDate = new Date(date);
	currentDate.setHours(23);
	currentDate.setMinutes(59);
	currentDate.setSeconds(59);
	currentDate.setMilliseconds(999);

	return currentDate;
};
export const getDateAtMidnight = (date: any) => {
	const currentDate = new Date(date);

	currentDate.setHours(0);
	currentDate.setMinutes(0);
	currentDate.setSeconds(0);
	currentDate.setMilliseconds(0);
	return currentDate;
};
export const getCurrentDateAt1159PM = () => {
	const currentDate = new Date();
	currentDate.setHours(23);
	currentDate.setMinutes(59);
	currentDate.setSeconds(59);
	currentDate.setMilliseconds(999);
	return currentDate;
};

export const getCurrentDateAtMidnight = () => {
	const currentDate = new Date();
	currentDate.setHours(0);
	currentDate.setMinutes(0);
	currentDate.setSeconds(0);
	currentDate.setMilliseconds(0);
	return currentDate;
};
export const getDateByWeeks = (spanOption: 'prev' | 'next', weeksAgo: number) => {
	// const currentDate = new Date();
	const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000; // Number of milliseconds in a week
	let date: any;
	if (spanOption === 'prev') {
		const currentDate = getCurrentDateAtMidnight();

		date = new Date(currentDate.getTime() - weeksAgo * millisecondsInWeek);
	}
	if (spanOption === 'next') {
		const currentDate = getCurrentDateAt1159PM();

		date = new Date(currentDate.getTime() + weeksAgo * millisecondsInWeek);
	}
	return date;
};
// Func

export const getDateByDays = (spanOption: 'prev' | 'next', daysAgo: number) => {
	// const currentDate = new Date();
	let date: any;

	if (spanOption === 'prev') {
		const currentDate = getCurrentDateAtMidnight();

		date = new Date(currentDate.getTime() - (daysAgo + 1) * 24 * 60 * 60 * 1000);
	}
	if (spanOption === 'next') {
		const currentDate = getCurrentDateAt1159PM();
		date = new Date(currentDate.getTime() + daysAgo * 24 * 60 * 60 * 1000);
	}
	return date;
};
// Function to get the first date of a given month
export const getFirstDateOfMonth = (year: number, month: number) => {
	return new Date(year, month, 1);
};

// Function to get the current month and two previous months' first dates
export const getDateByMonth = (dateSpanNumber: number, spanOption: 'prev' | 'next') => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	// Calculate the first dates of the previous two months
	let date: any;
	if (spanOption === 'prev') {
		date = getFirstDateOfMonth(currentYear, currentMonth - dateSpanNumber);
	}
	if (spanOption === 'next') {
		date = getFirstDateOfMonth(currentYear, currentMonth + (dateSpanNumber + 1));
	}

	return date.toISOString();
};
