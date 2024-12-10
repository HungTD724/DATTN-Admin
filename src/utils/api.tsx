// utils/api.ts
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:3001/v1/api"; // Thay đổi URL cơ sở của bạn

const fetchApi = async (endpoint: string, method: string = "GET", body: any = null) => {
  const token = Cookies.get("token"); // Lấy token từ cookie
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Thêm token vào headers nếu có
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers, // Thêm headers vào yêu cầu
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage); // Ném lỗi nếu không thành công
  }

  return response.json(); // Trả về dữ liệu JSON nếu thành công
};

export default fetchApi;
