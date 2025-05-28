import "./mainPage.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useEffect, useState } from "react";

const MainPage = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await fetch("http://localhost:4000/threads");
                const data = await response.json();
                setThreads(data);
            } catch (error) {
                console.error("Ошибка при получении тредов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, []);

    return (
        <>
            <Header />
            <div className="mainPage">
                <div className="main">
                    {loading ? (
                        <p>Загрузка тредов...</p>
                    ) : threads.length === 0 ? (
                        <p>Тредов пока нет.</p>
                    ) : (
                        threads.map((thread) => (
                            <div key={thread.id} className="threadCard">
                                <h2>{thread.title}</h2>
                                <p>{thread.description}</p>
                                <p className="createdBy">Автор: {thread.created_by}</p>
                                <p className="createdAt">Создан: {new Date(thread.created_at).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MainPage;
