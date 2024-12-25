import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useAuth } from "../../Context/useAuth";
import { User } from "../../Models/User";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();  
  const token = user?.token;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/v3/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error("Dữ liệu không phải là một mảng:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto rounded-sm">
      <table className="min-w-full border-collapse border border-gray-300 ">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Tên người dùng</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Hình ảnh</th>
            <th className="border border-gray-300 p-2">Ngày sinh</th>
            <th className="border border-gray-300 p-2">Số điện thoại</th>
            <th className="border border-gray-300 p-2">Địa chỉ</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.username} className="border-b hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  <span className="font-bold">{user.username}</span>
                </td>
                <td className="border border-gray-300 p-2">
                  <span>{user.emailAddress}</span>
                </td>
                <td className="border border-gray-300 p-2">
                  {user.image ? (
                    <img src={user.image} alt={`${user.username}'s avatar`} className="w-16 h-16 rounded-full" />
                  ) : (
                    "Không có"
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <span>{formatDate(user.birthDay)}</span>
                </td>
                <td className="border border-gray-300 p-2">
                  <span>{user.phone}</span>
                </td>
                <td className="border border-gray-300 p-2">
                  <span>{user.address}</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">Đang tải ...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
