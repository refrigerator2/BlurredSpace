import MainPage from "./mainPage/main/mainPage";
import Footer from "./mainPage/footer/footer";
import Header from "./mainPage/header/header";
import React from "react";
import {Login} from "./mainPage/Login/Login"
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import {Registration} from "./mainPage/Registration/registration";
import {ThreadCreator} from "./mainPage/ThreadCreater/ThreadCreator";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/threadcreate" element={<ThreadCreator />}/>
        </Routes>
    );
}

export default App;