import './ThreadCreator.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const createThread = async (username, title, description, topic) => {
    try {
        const response = await axios.post('http://localhost:4000/newthread', {
            title,
            description,
            username,
            topic,
        });

        if (response.status === 201) return response;
        if (response.status === 400) return 1;
        return null;
    } catch (err) {
        console.error('Error while creating topic:', err);
        return null;
    }
};

export const ThreadCreator = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topic, setTopic] = useState('');
    const [error, setError] = useState(null);

    const username = sessionStorage.getItem('username') || 'Guest';

    const handleClick = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!topic) {
            setError('Please select a topic');
            return;
        }

        const res = await createThread(username, title, description, topic);
        if (res === null) {
            setError('Failed to create thread');
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <div className="thread-creator-page-wrapper">
                <div className="thread-creator-page">
                    <div className="thread-creator-box">
                        <span className="thread-creator-logo">🐝</span>
                        <div className="thread-creator-header">
                            <h1>Create New Thread</h1>
                        </div>
                        <div className="thread-creator-form">
                            <input
                                className="title-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Thread Title"
                            />
                            <textarea
                                className="description-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                            />
                            <select
                                className="topic-select"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            >
                                <option value="">Select topic</option>
                                <option value="sports">Sports</option>
                                <option value="technology">Technology</option>
                                <option value="animals">Animals</option>
                                <option value="movies">Movies</option>
                                <option value="music">Music</option>
                            </select>

                            <button onClick={handleClick}>Create</button>
                            {error && <div className="error">{error}</div>}
                        </div>
                        <div className="thread-creator-footer">
                            <div className="nav-link" onClick={() => navigate('/')}>
                                Back to Home
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="footer-in-thread-creator">
                    <div className="footer-links-in-thread-creator">
                        <a href="#">Terms and rules</a>
                        <a href="#">Privacy policy</a>
                        <a href="#">Help</a>
                        <a href="#">Home</a>
                    </div>
                </footer>
            </div>
        </>
    );
};
