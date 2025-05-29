import './ThreadPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../mainPage/header/header";
import axios from "axios";

export const ThreadPage = () => {
    const navigate = useNavigate();
    const [res, setRes] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchThreadData = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/thread/${id}`);
                if (res.status === 200) {
                    setRes(res.data);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const fetchThreadMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/thread/${id}/allmessages`);
                if (res.status === 200) {
                    setMessages(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchThreadData();
        fetchThreadMessages();
    }, [id]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const username = sessionStorage.getItem("username") || "Guest";

        try {
            const res = await axios.post(`http://localhost:4000/thread/${id}/message`, {
                content: message,
                username,
                id,
            });
            if (res.status === 200) {
                setMessages((prev) => [...prev, res.data]);
                setMessage("");
            }
        } catch (e) {
            console.error("Failed to send message:", e);
        }
    };

    return (
        <>
            <Header />
            <div className="thread-page-wrapper">
                <div className="thread-page-container">
                    {res ? (
                        <div className="thread-box">
                            <div className="thread-header">
                                <h1>{res.title}</h1>
                                <p className="created-by">Author: {res.created_by}</p>
                                <p className="thread-description">{res.description}</p>
                            </div>

                            <div className="thread-messages">
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div key={index} className="message-item">
                                            <strong>{msg.User?.nickname || 'Unknown'}</strong>: {msg.content}
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-messages">No messages yet...</p>
                                )}
                            </div>

                            <div className="message-input-box">
                                <input
                                    type="text"
                                    placeholder="Write your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </div>
                    ) : (
                        <p className="loading">Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
};
