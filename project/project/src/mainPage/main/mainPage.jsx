import "./mainPage.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainPage = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await axios.get("http://localhost:4000/threads");
                setThreads(response.data);
            } catch (error) {
                console.error("Ошибка при получении тредов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, []);

    const handleThreadClick = (id) => {
        navigate(`/thread/${id}`);
    };

    return (
        <>
            <Header />
            <div className="mainPage">
                <div className="main">
                    {loading ? (
                        <p className="loading">Загрузка...</p>
                    ) : threads.length === 0 ? (
                        <p className="zero-threads">Тредов пока нет</p>
                    ) : (
                        <ul className="threadList">
                            {threads.map((thread) => (
                                <li
                                    key={thread.id}
                                    className="threadItem"
                                    onClick={() => handleThreadClick(thread.id)}
                                >
                                    <h2>{thread.title}</h2>
                                    {thread.description && <p>{thread.description}</p>}
                                    <p className="createdBy">Автор: {thread.created_by}</p>
                                    <p className="createdAt">Создан: {new Date(thread.created_at).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MainPage;
