import React, { createContext, useContext, useState } from 'react';
import { theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    const toggleTheme = (checked) => {
        setIsDarkMode(checked);
        localStorage.setItem('theme', checked ? 'dark' : 'light');
    };

    const themeAlgorithm = isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeAlgorithm }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
