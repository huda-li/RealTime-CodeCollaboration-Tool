import React from 'react'
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

  const handleJoin = () => {
    if(!roomId || !username){
        toast.error("RoomID & Username is required");
        return;
    }
    navigate(`/editor/${roomId}`, {
        state: {
            username,
        }
    })
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new room');
  }
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 vw-100"
      style={{
        background: "linear-gradient(135deg, #dbeafe,#3b82f6, #1e3a8a)",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "24rem",
          borderRadius: "15px",
          background: "white",
        }}
      >
        {/* Logo */}
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2920/2920326.png"
            alt="Logo"
            className="mb-3"
            style={{ width: "60px" }}
          />
        </div>

        {/* Title */}
        <h3 className="text-center text-primary fw-bold">Sync Lab</h3>
        <p className="text-center text-muted">Realtime Collaboration</p>

        {/* Input Fields */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ borderRadius: "10px" }} //i didnt complete till 2:40 10min is left okay is now everything fine till nowe? backend server start?
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ borderRadius: "10px" }}
          />
        </div>

        {/* Join Button */}
        <button
          className="btn btn-primary w-100 fw-bold"
          onClick={handleJoin}
          style={{
            backgroundColor: "#155cd0",
            border: "none",
            borderRadius: "10px",
          }}
        >
          Join
        </button>

        {/* New Room Link */}
        <p className="text-center mt-3 text-muted">
          If you don’t have an invite, create a{" "}
          <a href="#" className="text-primary fw-bold" onClick={createNewRoom}>new room</a>.
        </p>

        {/* Footer */}
        <p className="text-center text-muted mt-3">
          Built with 💙 by <a href="#" className="text-primary fw-bold">developer</a>
        </p>
      </div>
    </div>
  );
};

export default HomePage
