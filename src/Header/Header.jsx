import './Header.css';
import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "/Logo.svg";
import { useNavigate } from "react-router-dom"; // React Router for navigation

export default function Header() {
    const [showExportOptions, setShowExportOptions] = useState(false);
    const dropdownRef = useRef(null); // Reference for dropdown menu
    const navigate = useNavigate(); // React Router navigation hook

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowExportOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Export options handler
    const handleExportOptionClick = (format) => {
        const gridElement = document.querySelector(".board"); // Select the grid container

        if (!gridElement) {
            alert("Grid element not found!");
            return;
        }

        if (format === "json") {
            const gridData = window.grid || {}; // Assuming global grid data
            if (Object.keys(gridData).length === 0) {
                alert("No grid data available to export.");
                return;
            }

            const blob = new Blob([JSON.stringify(gridData)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "grid.json";
            link.click();
        } else {
            html2canvas(gridElement).then((canvas) => {
                if (format === "png") {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = "grid.png";
                    link.click();
                } else if (format === "pdf") {
                    const pdf = new jsPDF();
                    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 190, 100);
                    pdf.save("grid.pdf");
                }
            });
        }

        setShowExportOptions(false); // Hide dropdown
    };

    return (
        <div className="header">
            <div className="header-container">
                {/* Logo Button */}
                <button className="header-btn logo-btn" onClick={() => navigate('/')}>
                    <img src={Logo} alt="Logo" className="logo-image
" />
                </button>

                {/* Heading */}
                <h1 className="app-heading">Path Finder Viz</h1>

                {/* Other Buttons */}
                <div className="header-btns">
                    {/* Export Dropdown */}
                    <div className="export-dropdown" ref={dropdownRef}>
                        <button
                            className="header-btn"
                            onClick={() => setShowExportOptions(!showExportOptions)}
                        >
                            Export Grid
                        </button>
                        {showExportOptions && (
                            <div className="dropdown-menu">
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleExportOptionClick("png")}
                                >
                                    Export as PNG
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleExportOptionClick("pdf")}
                                >
                                    Export as PDF
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleExportOptionClick("json")}
                                >
                                    Export as JSON
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Print Metrics Button */}
                    <button className="header-btn" onClick={() => alert("Metrics feature coming soon!")}>
                        Print Metrics
                    </button>

                    {/* User Guide Button */}
                    <button className="header-btn" onClick={() => navigate('/user-guide')}>
                        User Guide
                    </button>
                </div>
            </div>
        </div>
    );
}
