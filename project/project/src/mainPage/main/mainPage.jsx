import "./mainPage.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import {useState} from "react";

const MainPage = () => {
    return (
        <>
            <Header />
            <div className="mainPage">
                <div className="main">
                    Blablabla
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MainPage;