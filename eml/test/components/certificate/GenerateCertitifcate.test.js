import axios from 'axios';
import { generateCertificate } from '../../../api/api.js';
import { mockDataAPI } from '../../mockData/mockDataAPI';
import { URL, CERTIFICATE_URL } from '@env';

const backendUrl = URL;
const certificateUrl = CERTIFICATE_URL;

jest.mock('axios');

describe('generateCertificate', () => {
    const mockData = mockDataAPI();
    const courseData = mockData.courseData;
    const studentData = mockData.userData; // Assuming userData is used as studentData
    const userData = mockData.userData;
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws an error if courseId is missing', async () => {
        await expect(generateCertificate(null, studentData, userData)).rejects.toThrow('Course ID is required');
    });

    it('throws an error if studentData is missing', async () => {
        await expect(generateCertificate('course123', null, userData)).rejects.toThrow('Student data is required');
    });

    it('throws an error if userData is missing', async () => {
        await expect(generateCertificate('course123', studentData, null)).rejects.toThrow('User data is required');
    });

    it('calls axios.put with correct URL and payload when all arguments are provided', async () => {
        // Mock getCourse response


        axios.get.mockResolvedValue({ data: courseData }); // Mock axios.get response for getCourse
        axios.put.mockResolvedValue({ data: { message: 'Certificate generated successfully' } }); // Mock axios.put for generateCertificate

        const result = await generateCertificate(courseData._id, studentData, userData);

        expect(axios.get).toHaveBeenCalledWith(`${backendUrl}/api/courses/${courseData._id}`, { timeout: 1200 });
        expect(axios.put).toHaveBeenCalledWith(`${certificateUrl}/api/student-certificates`, {
            courseName: courseData.title,
            courseId: courseData._id,
            studentId: studentData._id,
            studentFirstName: userData.firstName,
            studentLastName: userData.lastName,
            courseCreator: courseData.creator,
            estimatedCourseDuration: courseData.estimatedDuration || 0,
            dateOfCompletion: new Date().toISOString().split('T')[0],
            courseCategory: courseData.category,
        });
        expect(result).toEqual({ message: 'Certificate generated successfully' });
    });
    it('logs an error and rethrows if axios.put fails', async () => {
        axios.get.mockResolvedValue({ data: courseData });
        const errorMessage = 'Network Error';
        axios.put.mockRejectedValue(new Error(errorMessage));

        // Mock console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        await expect(generateCertificate(courseData._id, studentData, userData)).rejects.toThrow(errorMessage);
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error generating certificate:'), errorMessage);

        // Restore console.error after the test
        consoleErrorSpy.mockRestore();
    });

});

