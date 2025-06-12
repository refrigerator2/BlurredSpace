import "./mainPage.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainPage = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [threadsFilter, setThreadsFilter] = useState("all");
    const navigate = useNavigate();

    //////////////
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await axios.get("http://localhost:4000/threads");
                let data = response.data;

                if (threadsFilter === "popular") {
                    data = [...data].sort((a, b) => b.message_count - a.message_count);
                } else if (threadsFilter === "recent") {
                    data = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                } else if (threadsFilter === "oldest") {
                    data = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else if (threadsFilter !== "all") {
                    data = data.filter(t => t.topic === threadsFilter);
                }

                setThreads(data);
            } catch (error) {
                console.error("Ошибка при получении тредов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, [threadsFilter]);

    const handleThreadClick = (id) => {
        navigate(`/thread/${id}`);
    };

    /////////////////
    const handleFilterChange = (filter) => {
        setThreadsFilter(filter);
        setIsMobileSidebarOpen(false); // закрываем меню после выбора
    };

    return (
        <>
            <Header />
            <button className="filter-toggle" onClick={() => setIsMobileSidebarOpen(true)}>
                ☰ Filters
            </button>

            <div className={`mobile-sidebar ${isMobileSidebarOpen ? "active" : ""}`}>
                <button className="close-btn" onClick={() => setIsMobileSidebarOpen(false)}>×</button>
                <p>Filters</p>
                <button onClick={() => handleFilterChange("all")}>All</button>
                <button onClick={() => handleFilterChange("popular")}>By Popularity</button>
                <button onClick={() => handleFilterChange("recent")}>Recent</button>
                <button onClick={() => handleFilterChange("oldest")}>Oldest</button>
                <hr />
                <p>Topics:</p>
                <button onClick={() => handleFilterChange("sports")}>Sports</button>
                <button onClick={() => handleFilterChange("technology")}>Technology</button>
                <button onClick={() => handleFilterChange("animals")}>Animals</button>
                <button onClick={() => handleFilterChange("movies")}>Movies</button>
                <button onClick={() => handleFilterChange("music")}>Music</button>
            </div>

            <div className="mainPage">
                <div className="sidebar">
                    <p>Filters</p>
                    <button onClick={() => setThreadsFilter("all")}>All</button>
                    <button onClick={() => setThreadsFilter("popular")}>By Popularity</button>
                    <button onClick={() => setThreadsFilter("recent")}>Recent</button>
                    <button onClick={() => setThreadsFilter("oldest")}>Oldest</button>
                    <hr />
                    <p>Topics:</p>
                    <button onClick={() => setThreadsFilter("sports")}>Sports</button>
                    <button onClick={() => setThreadsFilter("technology")}>Technology</button>
                    <button onClick={() => setThreadsFilter("animals")}>Animals</button>
                    <button onClick={() => setThreadsFilter("movies")}>Movies</button>
                    <button onClick={() => setThreadsFilter("music")}>Music</button>
                </div>

                <div className="main">
                    {loading ? (
                        <p className="loading">Loading...</p>
                    ) : threads.length === 0 ? (
                        <p className="zero-threads">No threads yet</p>
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
                                    <p className="createdBy">Author: {thread.created_by}</p>
                                    <p className="createdAt">Created: {new Date(thread.created_at).toLocaleString()}</p>
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
