import MainPage from "./mainPage/main/mainPage";
import React from "react";
import {Login} from "./mainPage/Login/Login"
import { Routes, Route } from 'react-router-dom';
import {Registration} from "./mainPage/Registration/registration";
import {ThreadCreator} from "./mainPage/ThreadCreater/ThreadCreator";
import {ThreadPage} from "./ThreadPage/ThreadPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/threadcreate" element={<ThreadCreator />}/>
            <Route path="/thread/:id" element={<ThreadPage />} />
        </Routes>
    );
}

export default App;