import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EditorPage.css";
import toast from "react-hot-toast";
import Client from "../Components/Client";
import { initSocket } from "../socket";//where is this?
import ACTIONS from "../../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../Components/CodeEditor";

const EditorPage = () => {

  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef();
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('Socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
        if (username !== location.state?.username){
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        })
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter(client => client.socketId != socketId);
        })
      })

    }
    init();
    return () => {
      if (socketRef.current){
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
      
    }
  }, []);

  const [clients, setClients] = useState([
  ]);

  async function copyRoom(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied");
    }catch (error){
      toast.error("Could not copy thr room ID")
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  if (!location.state){
    return <Navigate to='/' />
  }

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Toggle Dark Mode
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Apply Theme Changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
    document.body.style.overflow = "hidden"; // Disable scrolling
  }, [darkMode]);

  return (
    <div className={`d-flex vh-100 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>

      {/* Sidebar */}
      <div className={`sidebar p-4 h-100 d-flex flex-column ${darkMode ? "sidebar-dark" : "sidebar-light"}`}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img 
            src={darkMode ? "/logo-dark.png" : "/logo-light.png"} 
            alt="Sync Lab Logo" 
            className="img-fluid" 
            style={{ width: "150px" }} 
          />
        </div>

        <h4 className="fw-bold">Sync Lab</h4>
        <p className="text-secondary">Realtime Collaboration</p>

        {/* User Profile */}
        <div>
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username}/>
          ))}
        </div>

        {/* Push Buttons to Bottom */}
        <div className="mt-auto">
          {/* Theme Toggle Button */}
          <button className="btn btn-outline-primary w-100 mb-2" onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Copy Room ID Button */}
          <button style={{ backgroundColor: "rgba(201, 196, 196, 0.65)" }} className="btn text-dark w-100 mb-2" onClick={copyRoom}>
            <i className="bi bi-clipboard"></i> Copy ROOM ID
          </button>

          {/* Leave Button */}
          <button className="btn btn-danger w-100" onClick={leaveRoom}>
            <i className="bi bi-box-arrow-right"></i> Leave
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <CodeEditor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
    </div>
  );
};

export default EditorPage;
