/** Utility functions used in Explore and Course screens **/
import * as StorageService from '../services/StorageService.js';
import * as userApi from '../api/userApi.js';

/**
 * Converts a numeric difficulty level to a human-readable label.
 * @param {number} lvl - The difficulty level of the course.
 * @returns {string} The corresponding difficulty label in Portuguese.
 */
export function getDifficultyLabel(lvl) {
	switch (lvl) {
	case 1:
		return 'Iniciante';
	case 2:
		return 'Intermediário';
	case 3:
		return 'Avançado';
	default:
		return 'Iniciante';
	}
}

/**
 * Converts milliseconds to time in the format 'MM:SS'.
 * @param ms - The number of milliseconds to convert.
 * @returns {string} - The time in the format 'MM:SS'.
 */
export const convertMsToTime = (ms) => {

	if (ms < 0) {
		return '00:00';
	}

	let seconds = Math.floor((ms / 1000) % 60);
	let minutes = Math.floor(ms / (1000 * 60));

	seconds = seconds < 10 ? '0' + seconds : seconds;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	return `${minutes}:${seconds}`;
};

/**
 * Maps an English course category to its Portuguese equivalent.
 * @param category - The category of the course in English.
 * @returns {string} - The translated category label in Portuguese.
 */
export function determineCategory(category) {
	switch (category) {
	case 'personal finance':
		return 'Finanças pessoais';
	case 'health and workplace safety':
		return 'Saúde e segurança no trabalho';
	case 'sewing':
		return 'Costura';
	case 'electronics':
		return 'Eletrônica';
	default: 'other';
		return 'Outro';
	}
}

/**
 * Determines the appropriate icon name for a given course category.
 * @param {string} category - The category of the course.
 * @returns {string} The icon name corresponding to the given category.
 */
export function determineIcon(category) {
	switch (category) {
	case 'personal finance':
		return 'finance';
	case 'health and workplace safety':
		return 'medical-bag';
	case 'sewing':
		return 'scissors-cutting';
	case 'electronics':
		return 'laptop';
	default:
		return 'bookshelf';
	}
}

/**
 * Formats a date string into a standardized date format.
 * @param {string} courseDate - The date the course was last updated in ISO format.
 * @returns {string} The formatted date in 'YYYY/MM/DD' format.
 */
export function getUpdatedDate(courseDate) {

	const date = new Date(courseDate);

	// Get the year, month, day, hours, and minutes from the Date object
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const day = date.getDate().toString().padStart(2, '0');

	// Format the date and time in the desired format
	return `${year}/${month}/${day}`;
}

/**
* Determines if the two arrays of courses are different and require an update.
* @param {Array} courses1 - The first array of courses, typically representing the current state.
* @param {Array} courses2 - The second array of courses, typically representing the new fetched data.
* @returns {boolean} - Returns true if the two arrays are different and an update is required, otherwise false.
*/
export function shouldUpdate(courses1, courses2) {
	// If both arrays are empty, they are equal, but should still update
	if (courses1.length === 0 && courses2.length === 0) {
		return true;
	}

	// If the lengths are different, they are not equal
	if (courses1.length !== courses2.length) {
		return true;
	}

	// If the IDs are different, they are not equal
	for (let i = 0; i < courses1.length; i++) {
		if (courses1[i].id !== courses2[i].id) {
			return true;
		}
	}
	return false;
}

/**
 * Returns a string with the number and the correct form of "Hora/Horas" in Portuguese.
 * @param {number} number - The number of hours.
 * @returns {string} A string combining the number and either "Hora" (singular) or "Horas" (plural). Returns "- Hora" for non-numeric or negative inputs.
 */
export function formatHours(number) {
	// Checking if it is not a number and if it is negative
	if (typeof number !== 'number' || isNaN(number) || number <= 0) {
		return '- Hora';
	}

	if (number <= 1) {
		return `${number} Hora`;
	} else {
		return `${number} Horas`;
	}
}

export async function completeComponent(comp, courseId, isComplete) {
	// Retrieve the user info object and parse it from JSON
	const studentInfo = await StorageService.getStudentInfo();
	const sectionId = comp.parentSection;

	if (!getComponent(studentInfo, courseId, sectionId, comp._id)) {
		throw new Error('Component not found');
	}

	// Retrieve the user info object and parse it from JSON
	const userInfo = await StorageService.getUserInfo();
	const loginToken = await StorageService.getLoginToken();

	const isFirstAttempt = isFirstAttemptExercise(studentInfo, comp._id);
	const isCompComplete = isComponentCompleted(studentInfo, comp._id);

	// If the exercise is present, but it's field "isComplete" is false, it means the user has answered wrong before and only gets 5 points.
	const points = isFirstAttempt && !isCompComplete && isComplete ? 10 : (!isFirstAttempt && !isCompComplete && isComplete ? 5 : 0);

	const updatedStudent = await userApi.completeComponent(userInfo.id, comp, isComplete, points, loginToken);

	if (!updatedStudent) {
		throw new Error('Error completing component');
	}

	StorageService.updateStudentInfo(updatedStudent);

	return { points, updatedStudent };
}

export function isCourseCompleted(student, courseId) {
	return student.courses.some(course => course.courseId == courseId);
}

export function isSectionCompleted(student, sectionId) {
	return student.courses.some(course =>
		course.sections.some(section =>
			section.sectionId == sectionId && section.isComplete
		)
	);
}

export function isComponentCompleted(student, compId) {
	return student.courses.some(course =>
		course.sections.some(section =>
			section.components.some(component =>
				component.compId === compId && component.isComplete
			)
		)
	);
}



function isFirstAttemptExercise(student, compId) {
	return student.courses.some(course =>
		course.sections.some(section =>
			section.components.some(component =>
				component.compId === compId && component.isFirstAttempt
			)
		)
	);
}

// Returns the students progress of a course in percentage, and also returns completed and total components
export async function checkProgressCourse(courseId) {
	try {
		const student = await StorageService.getStudentInfo();
		const sections = await StorageService.getSectionList(courseId);

		let totalComponents = 0;
		let progress = 0;

		for (let i = 0; i < sections.length; i++) {
			totalComponents += sections[i].components.length;
			for (let j = 0; j < sections[i].components.length; j++) {
				if (isComponentCompleted(student, sections[i].components[j].compId)) {
					progress++;
				}
			}
		}

		let progressProcent = (progress / totalComponents) * 100;
		progressProcent = Math.floor(progressProcent); // Round down to the nearest integer
		return [progressProcent, progress, totalComponents];
	} catch (e) {
		return [0, 0, 0];
	}
}

// Returns the students progress of a section
export async function checkProgressSection(sectionId) {
	const student = await StorageService.getStudentInfo();
	const section = await StorageService.getSection(sectionId);

	if (section.components !== 0) {
		const totalComponents = section.components.length;
		let progress = 0;

		for (let i = 0; i < totalComponents; i++) {
			if (isComponentCompleted(student, section.components[i].compId)) {
				progress++;
			}
		}

		return progress;
	} else {
		return 0;
	}
}

export function findCompletedCourse(student, courseId) {
	return student.courses.find(course => course.courseId == courseId);
}

export function findCompletedSection(student, courseId, sectionId) {
	const course = findCompletedCourse(student, courseId);

	return course?.sections.find(section => section.sectionId == sectionId);
}

function getComponent(student, courseId, sectionId, componentId) {
	const course = student.courses.find(course => course.courseId == courseId);
	const section = course?.sections.find(section => section.sectionId == sectionId);

	return section?.components.find(component => component.compId == componentId);
}

export function findIndexOfUncompletedComp(student, courseId, sectionId) {
	const course = student.courses.find(course => course.courseId === courseId);

	if (!course) {
		console.error(`Course with ID ${courseId} not found for the student.`);
		return -1; // or any other appropriate value to indicate not found
	}

	const section = course.sections.find(section => section.sectionId === sectionId);

	if (!section) {
		console.error(`Section with ID ${sectionId} not found in course ${courseId}.`);
		return -1; // or any other appropriate value to indicate not found
	}

	if (!section.components || section.components.length === 0) {
		console.warn(`Section ${sectionId} in course ${courseId} has no components.`);
		return -1; // or any other appropriate value to indicate no components
	}

	return section.components.findIndex(component => !component.isComplete);
}

export async function handleLastComponent(comp, course, navigation) {

	// For future reference 
	// const student = await StorageService.getStudentInfo();
	// const isComplete = isSectionCompleted(student, comp.parentSection);

	navigation.reset({
		index: 0,
		routes: [
			{
				name: 'CompleteSection',
				params: {
					parsedCourse: course,
					sectionId: comp.parentSection
				}
			},
		],
	});

	// For future reference
	// if (isComplete) { 
	// Code above with naviagtion
	// } else {
	//   console.log('Section not complete - navigate to retry exercises TBD');
	// }
}
