import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../Models/User"
import { useAuth } from "../../Context/useAuth";


const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editEmailAddress, setEditEmailAddress] = useState<string>("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [editBirthDay, setEditBirthDay] = useState<string | null>(null);
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

  const handleEdit = (user: User) => {
    setEditUserId(user.username);
    setEditUsername(user.username);
    setEditEmailAddress(user.emailAddress);
    setEditImage(user.image);
    setEditBirthDay(user.birthDay);
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditUsername("");
    setEditEmailAddress("");
    setEditImage(null);
    setEditBirthDay(null);
  };

  const handleUpdate = async () => {
    if (!editUsername.trim() || !editEmailAddress.trim()) {
      alert("Tất cả các trường đều cần thiết để cập nhật!");
      return;
    }
    try {
      await axios.put(`/v3/api/user/${editUserId}`, {
        username: editUsername,
        emailAddress: editEmailAddress,
        password: "********",
        image: editImage,
        birthDay: editBirthDay
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        }
      });
      setEditUserId(null);
      setEditUsername("");
      setEditEmailAddress("");
      setEditImage(null);
      setEditBirthDay(null);
      alert("Người dùng đã được cập nhật thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Cập nhật người dùng không thành công.");
    }
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
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.username} className="border-b hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {editUserId === user.username ? (
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span className="font-bold">{user.username}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editUserId === user.username ? (
                    <input
                      type="email"
                      value={editEmailAddress}
                      onChange={(e) => setEditEmailAddress(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span>{user.emailAddress}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {user.image ? (
                    <img src={user.image} alt={`${user.username}'s avatar`} className="w-16 h-16 rounded-full" />
                  ) : (
                    "Không có"
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editUserId === user.username ? (
                    <input
                      type="date"
                      value={editBirthDay || ""}
                      onChange={(e) => setEditBirthDay(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span>{user.birthDay ? user.birthDay : "N/A"}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">Không tìm thấy người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default UserList;
