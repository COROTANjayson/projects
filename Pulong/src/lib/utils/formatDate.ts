export const formatInputDate = (date: Date) => {
	let year = date.getFullYear();
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let day = date.getDate().toString().padStart(2, '0');

	let formattedDate = year + '-' + month + '-' + day;
	return formattedDate;
};
export const getCurrentDate = () => {
	let currentDate = new Date();

	let year = currentDate.getFullYear();
	let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	let day = currentDate.getDate().toString().padStart(2, '0');

	let formattedDate = year + '-' + month + '-' + day;
	return formattedDate;
};
export const getDaysOfWeek = () => {
	const daysOfWeek = [
		{ id: 'Monday', name: 'Monday' },
		{ id: 'Tuesday', name: 'Tuesday' },
		{ id: 'Wednesday', name: 'Wednesday' },
		{ id: 'Thursday', name: 'Thursday' },
		{ id: 'Friday', name: 'Friday' },
		{ id: 'Saturday', name: 'Saturday' },
		{ id: 'Sunday', name: 'Sunday' }
	];
	return daysOfWeek;
};

export const generateTimeIntervals = () => {
	const times = [];
	const interval = 15; // Interval in minutes
	const startTime = 0; // Start time in minutes (12:00 AM)
	const endTime = 1440; // End time in minutes (12:00 AM next day)

	for (let minutes = startTime; minutes < endTime; minutes += interval) {
		const hours24 = Math.floor(minutes / 60);
		const mins = minutes % 60;
		const hours12 = hours24 % 12 || 12; // Convert to 12-hour format, ensuring 0 is shown as 12
		const period = hours24 < 12 ? 'AM' : 'PM';

		const id = `${String(hours24).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
		const name = `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;

		times.push({ id, name });
	}

	return times;
};

export const getDatesByDay = (dayOfWeek: any, pastMonths = 2, futureWeeks = 1) => {
	const dayMap: any = {
		sunday: 0,
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6
	};

	const dayNum = dayMap[dayOfWeek.toLowerCase()];
	if (dayNum === undefined) throw new Error('Invalid day of the week');

	const today = new Date();
	const currentDayNum = today.getDay();
	const currentDayDifference = (dayNum - currentDayNum + 7) % 7;
	const currentTargetDay = new Date(today);
	currentTargetDay.setDate(today.getDate() + currentDayDifference);

	// Calculate the start date (the same specified day two months ago)
	const startDate = new Date(currentTargetDay);
	startDate.setMonth(startDate.getMonth() - pastMonths);
	// Adjust the start date to ensure it's aligned to the specified day of the week
	const startDayDifference = (dayNum - startDate.getDay() + 7) % 7;
	startDate.setDate(startDate.getDate() + startDayDifference);

	// Calculate the end date (the same specified day one week in the future)
	const endDate = new Date(currentTargetDay);
	endDate.setDate(endDate.getDate() + 7 * futureWeeks);

	let dates: any = [];
	for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
		dates.push(new Date(date));
	}

	dates = dates.map((date: any) => ({
		date: date.toISOString().split('T')[0]
	}));
	return dates;
};

export const convertTo12Hour = (time: string): string => {
	const [hour, minute] = time.split(':');
	let hourNum = parseInt(hour);
  
	const suffix = hourNum >= 12 ? 'PM' : 'AM';
  
	hourNum = hourNum % 12 || 12; 

	return `${hourNum}:${minute} ${suffix}`;
  };