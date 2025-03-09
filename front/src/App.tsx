import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './component/landingPage/LadingPage';
import ExpeditionPage from './component/expeditionPage/ExpeditionPage';


const App: React.FC = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/expedition" element={<ExpeditionPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};


export default App;
