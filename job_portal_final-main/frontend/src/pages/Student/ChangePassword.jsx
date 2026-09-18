// ChangePassword.jsx

import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Password changed!");
    } catch {
      alert("Error changing password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Old Password"
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button>Change Password</button>
    </form>
  );
}