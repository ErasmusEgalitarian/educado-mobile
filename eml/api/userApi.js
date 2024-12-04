import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { URL } from '@env';

/* Commented out to avoid linting errors 
 * TODO: move IP address to .env file !!!
const prod = 'http://educado.somethingnew.dk';
const test = 'http://172.30.211.110:8888'; // Change this to your LOCAL IP address when testing.
const local = 'http://localhost:8888';
const digitalOcean = 'http://207.154.213.68:8888';
*/


const url = URL;// Change this to your LOCAL IP address when testing.

/**
 * This is the client that will be used to make requests to the backend.
 */
export const client = axios.create({
	baseURL: url,
	withCredentials: true,
	responseType: 'json',
	timeout: 30000,
});

/**
 * Sends a request to the backend to register a new user.
 * @param {Object} obj Should contain the following properties:
 * - firstName
 * - lastName
 * - email
 * - password
 */
export const registerUser = async (obj) => {
	console.log(`User trying to register:
    firstName: ${obj.firstName ?? 'undefined'}
    lastName: ${obj.lastName ?? 'undefined'}
    email: ${obj.email ?? 'undefined'}`);

	try {
		const res = await client.post('/api/auth/signup', obj);
		console.log('User successfully registered');
		return res.data;
	} catch (e) {
		console.log(e.message);
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

/**
 * Sends a request to the backend to log in an existing user.
 * @param {Object} obj should contain the following properties:
 * - email
 * - password
 */
export const loginUser = async (obj) => {
	try {
		const res = await client.post('/api/auth/login', obj);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const deleteUser = async (user_id, token) => {
	try {
		const res = await client.delete('/api/users/' + user_id, {
			headers: {
				'Content-Type': 'application/json',
				'token': token, // Include the token in the headers
			},
		});
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const updateUserFields = async (user_id, obj, token) => {
	try {
		const res = await client.patch(`/api/users/${user_id}`, obj, {
			headers: {
				'Content-Type': 'application/json',
				'token': token, // Include the token in the headers
			},
		});
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const updateUserPassword = async (user_id, oldPassword, newPassword, token) => {
	try {
		const res = await axios.patch(url + `/api/users/${user_id}/password`, {
			oldPassword: oldPassword,
			newPassword: newPassword,
		}, {
			headers: {
				'Content-Type': 'application/json',
				'token': token, // Include the token in the headers
			},
		});

		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const completeComponent = async (user_id, comp, isComplete, points, token) => {
	try {
		const res = await client.patch('/api/students/' + user_id + '/complete', { comp: comp, isComplete: isComplete, points: points }, {
			headers: {
				'Content-Type': 'application/json',
				'token': token, // Include the token in the headers
			},
		});

		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const getStudentInfo = async (user_Id) => {
	try {
		const res = await client.get('/api/students/' + user_Id + '/info');
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};



export const addCourseToStudent = async (user_Id, course_Id, token) => {
	try {
		const res = await client.patch('/api/students/' + user_Id + '/courses/' + course_Id + '/enroll',
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					'token': token, // Include the token in the headers
				},
			}
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

export const uploadPhoto = async (user_id, photo, token) => {
	try {
		const formData = new FormData();

		const file = await FileSystem.getInfoAsync(photo);

		if (!file.exists) {
			throw new Error('File does not exist');
		}

		formData.append('file', {
			uri: file.uri,          // The URI from expo-file-system
			type: 'image/jpeg',         // You can adjust this to the actual file type
			name: 'photo.jpg'           // File name
		});

		const res = await client.put('/api/students/' + user_id + '/photo', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'accept': 'application/json',
				'token': token,
			}
		});

		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

export const deletePhoto = async (user_id, token) => {
	try {
		const res = await client.delete('/api/students/' + user_id + '/photo', {
			headers: {
				'Content-Type': 'application/json',
				'token': token,
			}
		});

		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};

/**
 * Function to send mail to user with code to reset password
 * @param {Object} email should contain an email, to receive a reset password message
*/
export const sendResetPasswordEmail = async (email) => {
	try {
		const res = await client.post('/api/auth/reset-password-request', email);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};


/**
 * function to validate the code sent to the user 
 * @param {Object} obj should contain the following properties:
 * - email
 * - token
*/
export const validateResetPasswordCode = async (obj) => {
	try {
		const res = await client.post('/api/auth/reset-password-code', obj);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}

};

/**
 * When user enters a new password it should update the password of the user
 * @param {Object} obj should contain the following properties:
 * - email
 * - token
 * - newPassword
*/
export const enterNewPassword = async (obj) => {
	try {
		const res = await client.patch('/api/auth/reset-password', obj);
		return res.data;
	} catch (e) {
		if (e?.response?.data != null) {
			throw e.response.data;
		} else {
			throw e;
		}
	}
};