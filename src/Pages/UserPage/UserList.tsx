import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Cập nhật kiểu dữ liệu User để bao gồm cả trường image và birthDay
type User = {
  username: string;
  emailAddress: string;
  password: string; 
  image: string | null;
  birthDay: string | null;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editEmailAddress, setEditEmailAddress] = useState<string>("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [editBirthDay, setEditBirthDay] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW50cnVvbmdsYW5hbmgwQGdtQUlMLkNPTSIsImdpdmVuX25hbWUiOiJzdHJpbmcxMiIsIm5iZiI6MTcyOTIzMjU3MywiZXhwIjoxNzI5ODM3MzczLCJpYXQiOjE3MjkyMzI1NzMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTI0NiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTI0NiJ9.9PCXyZrBKxF_GFvllrK7O7f9TfCxaXFEwvhU7XJ1nzqJMYLMEfwDAxD_Gs9bLABcXXnyivISsx3ySXfnUoJmvg";

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
        console.error("Data is not an array:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      alert("All fields are required for update!");
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
      alert("User updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="container mx-auto p-4">
     
      <ul className="space-y-4">
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.username} className="flex justify-between items-center border rounded-lg shadow-md p-4 bg-white">
              {editUserId === user.username ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-48 py-2 px-4 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    value={editEmailAddress}
                    onChange={(e) => setEditEmailAddress(e.target.value)}
                    className="w-96 py-2 px-4 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editImage || ""}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="date"
                    value={editBirthDay || ""}
                    onChange={(e) => setEditBirthDay(e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold">{user.username}</h2>
                  <p className="text-gray-600">{user.emailAddress}</p>
                  {user.image && <img src={user.image} alt={`${user.username}'s avatar`} className="w-16 h-16 rounded-full" />}
                  <p className="text-gray-600">{user.birthDay ? `Birthday: ${user.birthDay}` : "Birthday: N/A"}</p>
                </div>
              )}
              <div className="space-x-2">
                {editUserId === user.username ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                    >
                      Update
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default UserList;
