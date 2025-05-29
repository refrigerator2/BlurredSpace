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
        const ThreadData = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/thread/${id}`);
                if (res.status === 200) {
                    setRes(res.data);
                }
            } catch (e) {
                if (e.response?.status === 404) {
                    console.log("Thread not found");
                } else {
                    console.log("Server issue", e);
                }
            }
        };
        const ThreadMessages = async () => {
            try{
                const res = await axios.get(`http://localhost:4000/thread/${id}/allmessages`);
                if (res.status === 200) {
                    setMessages(res.data);
                }else{
                    console.log("Server issue");
                }
            }catch(err){
                console.log(err);
            }
        }
        ThreadData();
        ThreadMessages();
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
            console.log("Failed to send message:", e);
        }
        setMessage("");
    };
    console.log(messages);
    return (
        <>
            <Header />
            <div className="threadPage">
                {res ? (
                    <div className="threadContent">
                        <div className="threadContainer">
                            <h1>{res.title}</h1>
                            <p className="createdBy">Author: {res.created_by}</p>
                            <p className="description">{res.description}</p>
                        </div>

                        <div className="discussionContainer">
                            <div className="messagesList">
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div key={index} className="messageItem">
                                            <strong>{msg.User?.nickname || 'Unknown'}</strong>: {msg.content}
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages yet...</p>
                                )}
                            </div>

                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                {/* Инпут внизу */}
                <div className="messageInputBox">
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
        </>
    );
};
