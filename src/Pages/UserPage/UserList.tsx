import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type User = {
  username: string; // Sửa thành username
  emailAddress: string; // Sửa thành emailAddress
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('/v3/api/user');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDetail = (username: string) => {
    navigate(`/user/${username}`);
  };

  const handleUpdate = (username: string) => {
    navigate(`/user/update/${username}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="border rounded-lg shadow-md p-4 bg-white">
        {users.map(user => (
          <li key={user.username} className="flex justify-between items-center border-b py-2">
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-600">{user.emailAddress}</p>
            </div>
            <div>
              {/* <button
                onClick={() => handleDetail(user.username)}
                className="bg-blue-500 text-black py-1 px-3 rounded-lg hover:bg-blue-600 mr-2"
              >
                Detail
              </button> */}
              <button
                onClick={() => handleUpdate(user.username)}
                className="bg-yellow-500 text-black py-1 px-3 rounded-lg hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
