export const getInitials = (str: string) => {
	// Remove leading and trailing whitespaces and split the string into words
	const words = str.trim().split(' ');

	// Retrieve the first letter of the first word
	const firstLetterFirstWord = words[0][0];

	// Retrieve the first letter of the last word
	const lastWordIndex = words.length - 1;
	const firstLetterLastWord = words[lastWordIndex][0];

	return firstLetterFirstWord + firstLetterLastWord;
};
