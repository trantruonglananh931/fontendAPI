import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type User = {
  username: string;
  emailAddress: string;
  password: string; // Bao gồm password để hiển thị
};

const UserUpdate: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newEmailAddress, setNewEmailAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(`/v3/api/user/${name}`);
        setUser(response.data);
        setNewUsername(response.data.username);
        setNewEmailAddress(response.data.emailAddress);
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, [name]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.put(`/v3/api/user/${name}`, {
        username: newUsername,
        emailAddress: newEmailAddress,
        password: user?.password // Gửi mật khẩu hiện tại để đáp ứng API
      });
      setMessage("User updated successfully!");
      navigate("/user");
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Failed to update user.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            value={newEmailAddress}
            onChange={(e) => setNewEmailAddress(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value="***************" 
            readOnly
            className="w-full py-2 px-4 border border-gray-300 rounded-lg bg-gray-200"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Update User
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default UserUpdate;
