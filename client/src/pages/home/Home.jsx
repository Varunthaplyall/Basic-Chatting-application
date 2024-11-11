import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import axios from 'axios';
import './Home.css';

const socket = io('http://localhost:3030', { autoConnect: false });

const Home = () => {
    const [showUsers, setShowUsers] = useState([]);
    const [input, setInput] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [user, setUser] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [publicMessage, setPublicMessage] = useState([]);
    const [privateMessage, setPrivateMessage] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) navigate('/login');
            try {
                await axios.get('http://localhost:3030/api/v1/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (error) {
                if (error.response.status === 401) navigate('/login');
            }
        };
        isAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3030/api/v1/users');
                setShowUsers(res.data.user);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            const token = localStorage.getItem('token');
            if (token) socket.emit('user-data', token);
        });

        socket.on('user', ({ username, userId }) => {
            setUser({ username, userId });
        });

        socket.on('receive-message', (data) => {
            if (data.isPrivate) {
                setPrivateMessage((prev) => [...prev, data]);
            } else {
                setPublicMessage((prev) => [...prev, data]);
            }
        });

        socket.on('active-users', (data) => {
            setActiveUsers(data.filter(activeUser => activeUser.socketId !== socket.id));
        });

        return () => {
            socket.off('connect');
            socket.off('user');
            socket.off('receive-message');
            socket.off('active-users');
            socket.disconnect();
        };
    }, []);

    const handlePrivateMessageSend = () => {
        if (input.trim()) {
            const messageData = {
                message: input,
                userId: user.userId,
                username: user.username,
                isPrivate: true,
                to: selectedUser.socketId,
            };
            socket.emit('send-message', messageData);
            setInput('');
        }
    };

    const handlePublicMessageSend = () => {
        if (input.trim()) {
            const messageData = {
                message: input,
                userId: user.userId,
                username: user.username,
                isPrivate: false,
            };
            socket.emit('send-message', messageData);
            setInput('');
        }
    };

    const handleUserSelect = (targetUser) => {
        setSelectedUser(targetUser); 
    };

    const handleExitPrivateChat = () => {
        setSelectedUser(null); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <h1 className="navbar-brand">ChatApp</h1>
                <div className="user-info">
                    <span>Welcome, {user.username}</span>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </nav>

            <div className="chat-container">
                {!selectedUser && (
                    <div className="public-chat">
                        <h3>Public Chat</h3>
                        <div className="messages">
                            {publicMessage.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.userId === user.userId ? 'sent-message' : 'received-message'}`}
                                >
                                    <p><strong>{msg.username}</strong>: {msg.message}</p>
                                </div>
                            ))}
                        </div>
                        <div className="send-message-box">
                            <input
                                type="text"
                                placeholder="Type your message"
                                className="message-input"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                            />
                            <button onClick={handlePublicMessageSend} className="send-button">Send</button>
                        </div>
                    </div>
                )}

               
                {selectedUser && (
                    <div className="private-chat">
                        <h3>Private Chat with {selectedUser.username}</h3>
                        <button onClick={handleExitPrivateChat} className="exit-private-chat">Exit Private Chat</button>
                        <div className="messages">
                            {privateMessage.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.userId === user.userId ? 'sent-message' : 'received-message'}`}
                                >
                                    <p><strong>{msg.username}</strong>: {msg.message}</p>
                                </div>
                            ))}
                        </div>
                        <div className="send-message-box">
                            <input
                                type="text"
                                placeholder="Type your message"
                                className="message-input"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                            />
                            <button onClick={handlePrivateMessageSend} className="send-button">Send</button>
                        </div>
                    </div>
                )}

                
                <div className="user-list">
                    <h3>Users List</h3>
                    {showUsers.length > 0 ? (
                        showUsers.map((user) => (
                            <div key={user._id} className="user-item">
                                {user.userName}
                            </div>
                        ))
                    ) : (
                        <p>No Users Available</p>
                    )}
                    <div className="active-users">
                        <h3>Active Users</h3>
                        {activeUsers.length > 0 ? (
                            activeUsers.map((user, index) => (
                                <div key={index} onClick={() => handleUserSelect(user)} className="active-user-item">
                                    {user.username}
                                </div>
                            ))
                        ) : (
                            <p>No Active Users</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
