import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditPassword from '../../../screens/profile/EditPassword'; // Adjust this import according to the actual location
import { updateUserPassword } from '../../../api/userApi';
import { getUserInfo, getJWT } from '../../../services/StorageService';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../../api/userApi', () => ({
  updateUserPassword: jest.fn(),
}));

jest.mock('../../../services/StorageService', () => ({
  getUserInfo: jest.fn(),
  getJWT: jest.fn(),
}));

describe('EditPassword Component', () => {
  const mockUserInfo = { id: '12345' };
  const mockJWT = 'mockJWTToken';

  beforeEach(() => {
    getUserInfo.mockResolvedValue(mockUserInfo);
    getJWT.mockResolvedValue(mockJWT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<EditPassword />);
    expect(getByText('Alterar senha')).toBeTruthy();
  });
});
