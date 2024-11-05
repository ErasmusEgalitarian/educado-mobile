import axios from 'axios';
import { Buffer } from 'buffer';
import { URL, CERTIFICATE_URL } from '@env';

const timeoutInMs = 1200;


// move these to .env file next sprint
const url = URL; // Change this to your LOCAL IP address when testing.
const certificateUrl = CERTIFICATE_URL;

/* Commented out for avoiding linting errors :))
 * TODO: move IP address to .env file !!!
const testUrl = 'http://localhost:8888';
const testExpo = 'http://172.30.211.57:8888'; 
const digitalOcean = 'http://207.154.213.68:8888';
*/

/*** COURSE, SECTIONS AND EXERCISES ***/

// Get components for a specific section
export const getComponents = async (sectionId) => {
	try {
		const res = await axios.get(url + '/api/courses/sections/' + sectionId + '/components');
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const getSectionById = async (sectionId) => {
	try {
		const res = await axios.get(url + '/api/sections/' + sectionId);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}

	}
};

// Get specific course

export const getCourse = async (courseId) => {
	try {
		const res = await axios.get(url + '/api/courses/' + courseId, { timeout: timeoutInMs });
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

// Get all courses
export const getCourses = async () => {
	try {
		const res = await axios.get(url + '/api/courses');
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

// Get all sections for a specific course
export const getAllSections = async (courseId) => {
	try {
		const res = await axios.get(url + '/api/courses/' + courseId + '/sections', { timeout: timeoutInMs });
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

// Get specific section
// ************* same as getSectionById *************
export const getSection = async (courseId, sectionId) => {
	try {
		const res = await axios.get(
			url + '/api/courses/' + courseId + '/sections/' + sectionId
		);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};


// Get all lectures in a specific section:
export const getLecturesInSection = async (sectionId) => {
	try {
		const res = await axios.get(
			url + '/api/lectures/section/' + sectionId
			, { timeout: timeoutInMs });
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

/*** SUBSCRIPTION ***/

// Get user subscriptions
export const getSubscriptions = async (userId) => {
	try {
		// maybe not best practise to pass user ID as request query
		// but this is the only format where it works
		// passing user ID as request body for get request gives error
		const res = await axios.get(
			url + '/api/students/' + userId + '/subscriptions',
			{ timeout: 1200 });

		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

// Subscribe to course
export const subscribeToCourse = async (userId, courseId) => {
	try {
		await axios.post(
			url + '/api/courses/' + courseId + '/subscribe',
			{
				user_id: userId,
			}
		);
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

// Unsubscribe to course
export const unSubscribeToCourse = async (userId, courseId) => {
	try {
		await axios.post(
			url + '/api/courses/' + courseId + '/unsubscribe',
			{
				user_id: userId,
			}
		);
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};


// Get certificates from student
export const fetchCertificates = async (userId) => {
	try {
		if (userId == null) {
			throw 'User ID is null';
		}
		const res = await axios.get(certificateUrl + '/api/student-certificates/student/' + userId);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};


/* Generates a certificate for a student.
 * @param {string} courseId - The ID of the course.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} - The response from the server.
 */
export const generateCertificate = async (courseId, studentData, userData) => {

	if (!courseId) {
		throw new Error('Course ID is required');
	}
	if (!studentData) {
		throw new Error('Student data is required');
	}
	if (!userData) {
		throw new Error('User data is required');
	}
	// Fetch course data
	const courseData = await getCourse(courseId);

	// Call the endpoint to generate the certificate

	try {
		const response = await axios.put(certificateUrl + '/api/student-certificates', {
			courseName: courseData.title,
			courseId: courseData._id,
			studentId: studentData._id,
			studentFirstName: userData.firstName,
			studentLastName: userData.lastName,
			courseCreator: courseData.creator,
			estimatedCourseDuration: courseData.estimatedDuration || 0,
			dateOfCompletion: new Date().toISOString().split('T')[0], // current date
			courseCategory: courseData.category,
		});
		return response.data;
	} catch (error) {
		console.error('Error generating certificate:', error.response?.data || error.message);
		throw error;
	}
};



//CREATED BY VIDEO STREAM TEAM
/*This will be improved in next pull request to handle getting different resolutions properly 
with our new video streaming service in go.
*/

export const getVideoStreamUrl = (fileName, resolution) => {
	let resolutionPostfix;
	switch (resolution) {
	case '360':
		resolutionPostfix = '_360x640';
		break;
	case '480':
		resolutionPostfix = '_480x854';
		break;
	case '720':
		resolutionPostfix = '_720x1280';
		break;
	case '1080':
		resolutionPostfix = '_1080x1920';
		break;
	default:
		resolutionPostfix = '_360x640';
	}

	return `${url}/api/bucket/stream/${fileName}${resolutionPostfix}.mp4`;
};

export const getLectureById = async (lectureId) => {
	try {
		const res = await axios.get(url + '/api/lectures/' + lectureId);
		return res.data;
	} catch (err) {
		if (err?.response?.data != null) {
			throw err.response.data;
		} else {
			throw err;
		}
	}

};


export const getBucketImage = async (fileName) => {
	try {
		const res = await axios.get(
			`${url}/api/bucket/${fileName}`,
			{
				responseType: 'arraybuffer',
				accept: 'image/jpeg',
			});

		let fileType = fileName.split('.').pop();

		if (fileType === 'jpg') {
			fileType = 'jpeg';
		} else if (!fileType) { // Default to png
			fileType = 'png';
		}

		// Convert the image to base64
		const image = `data:image/${fileType};base64,${Buffer.from(res.data, 'binary').toString('base64')}`;
		return image;
	} catch (err) {
		if (err?.response?.data != null) {
			throw err.response.data;
		} else {
			throw err;
		}
	}
};

