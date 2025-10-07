import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditPasswordScreen from "../../../screens/Profile/EditPasswordScreen"; // Adjust this import according to the actual location
import { updateUserPassword } from "../../../api/user-api";
import { getUserInfo, getJWT } from "../../../services/storage-service";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("../../../api/user-api", () => ({
  updateUserPassword: jest.fn(),
}));

jest.mock("../../../services/storage-service", () => ({
  getUserInfo: jest.fn(),
  getJWT: jest.fn(),
}));

describe("EditPassword Component", () => {
  const mockUserInfo = { id: "12345" };
  const mockJWT = "mockJWTToken";

  beforeEach(() => {
    getUserInfo.mockResolvedValue(mockUserInfo);
    getJWT.mockResolvedValue(mockJWT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<EditPasswordScreen />);
    expect(getByText("Alterar senha")).toBeTruthy();
  });
});
