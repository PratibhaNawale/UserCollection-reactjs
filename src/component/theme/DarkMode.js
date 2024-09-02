import React, { useEffect, useState } from 'react';
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import "./DarkMode.css";

function DarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setDarkMode();
        } else {
            setLightMode();
        }
    }, []);

    const setDarkMode = () => {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        setIsDarkMode(true);
    };

    const setLightMode = () => {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        setIsDarkMode(false);
    };

    const toggleTheme = () => {
        if (isDarkMode) {
            setLightMode();
        } else {
            setDarkMode();
        }
    };

    return (
        <div className='dark_mode'>
            <FontAwesomeIcon
                icon={isDarkMode ? faToggleOn : faToggleOff}
                onClick={toggleTheme}
                className='toggle-icon cursor'
            />
            {isDarkMode ? <Moon /> : <Sun />}
        </div>
    );
}

export default DarkMode;
