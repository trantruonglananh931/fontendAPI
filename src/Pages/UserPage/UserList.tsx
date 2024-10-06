import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

type User = {
  username: string;
  emailAddress: string;
  password: string; 
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editEmailAddress, setEditEmailAddress] = useState<string>("");

  const navigate = useNavigate();

  
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/v3/api/user');
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


  const handleEdit = (username: string, emailAddress: string) => {
    setEditUserId(username);
    setEditUsername(username);
    setEditEmailAddress(emailAddress);
  };

  
  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditUsername("");
    setEditEmailAddress("");
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
        password: "********" 
      });
      setEditUserId(null);
      setEditUsername("");
      setEditEmailAddress("");
      alert("User updated successfully!");
      fetchUsers(); 
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-4">
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.username} className="flex justify-between items-center border rounded-lg shadow-md p-4 bg-white">
              {editUserId === user.username ? (
                <div className="flex space-x-4">
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
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold">{user.username}</h2>
                  <p className="text-gray-600">{user.emailAddress}</p>
                 
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
                      onClick={() => handleEdit(user.username, user.emailAddress)}
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
