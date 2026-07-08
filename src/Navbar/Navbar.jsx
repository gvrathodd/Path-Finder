import React, { useState } from 'react';
import './Navbar.css';
import { useParams } from '../context/context';
import { func1, func2, func3, func4 } from '../utils/algorithms';

export default function Navbar() {
    const { mode, setmode, algo, setalgo, setres, setrun, clearBoard, grid, start, end, setgrid } = useParams();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const algorithms = [
        { id: 'BFS', label: 'BFS', func: func1 },
        { id: 'Dijkstra', label: 'Dijkstra', func: func2 },
        { id: 'AStar', label: 'A*', func: func3 },
        { id: 'BDS', label: 'BDS', func: func4 },
    ];

    const handleRunClick = () => {
        console.log("Run button clicked");
        if (algo.length === 0) {
            alert('Please select at least one algorithm!');
            return;
        }
    
        // Validate start and end nodes
        if (!start.current || !end.current || start.current.x === undefined || start.current.y === undefined || end.current.x === undefined || end.current.y === undefined) {
            alert("Please set valid start and end nodes!");
            return;
        }
    
        // Create a deep copy of the grid
        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    
        algo.forEach((selectedAlgo) => {
            const algorithm = algorithms.find((a) => a.id === selectedAlgo);
            if (algorithm) {
                const hashmap = {};
                const prevmap = {};
                const result = algorithm.func(newGrid, hashmap, prevmap, start.current, end.current);
    
                if (result && result.path) {
                    console.log(`${selectedAlgo} found a path:`, result.path);
                    result.path.forEach((node, index) => {
                        setTimeout(() => {
                            const { x, y } = node;
                            newGrid[y][x].isPath = true; // Mark path on grid
                            newGrid[y][x].pathColor = getPathColor(selectedAlgo); // Set path color based on algorithm
                            setgrid([...newGrid]); // Trigger re-render
                        }, index * 50);
                    });
                } else {
                    console.log(`${selectedAlgo} did not find a path.`);
                }
            }
        });
    };

    const getPathColor = (algorithm) => {
        switch (algorithm) {
            case 'BFS':
                return 'blue';
            case 'Dijkstra':
                return 'red';
            case 'AStar':
                return 'purple';
            case 'BDS':
                return 'green';
            default:
                return 'blue';
        }
    };

    const toggleAlgorithm = (algorithmId) => {
        if (algo.includes(algorithmId)) {
            setalgo(algo.filter((a) => a !== algorithmId)); // Remove algorithm if already selected
        } else {
            setalgo([...algo, algorithmId]); // Add algorithm if not selected
        }
        console.log("Selected Algorithms:", algo); // Debug log
    };

    return (
        <div className="navbar">
            <div className="container">
                {/* Buttons for setting start, target, bricks, weight, erase, reset */}
                <div className="button-with-label">
                    <button
                        type="button"
                        className={['btn', 'btn-primary', mode === 'setstart' ? 'selected' : ''].join(' ')}
                        onClick={() => setmode(mode === 'setstart' ? null : 'setstart')}
                    >
                        <i className="bi bi-geo-alt"></i>
                    </button>
                    <span className="button-label">Start</span>
                </div>

                <div className="button-with-label">
                    <button
                        type="button"
                        className={['btn', 'btn-primary', mode === 'settarget' ? 'selected' : ''].join(' ')}
                        onClick={() => setmode(mode === 'settarget' ? null : 'settarget')}
                    >
                        <i className="bi bi-geo"></i>
                    </button>
                    <span className="button-label">Target</span>
                </div>

                <div className="button-with-label">
                    <button
                        type="button"
                        className={['btn', 'btn-primary', mode === 'addbricks' ? 'selected' : ''].join(' ')}
                        onClick={() => setmode(mode === 'addbricks' ? null : 'addbricks')}
                    >
                        <i className="bi bi-bricks"></i>
                    </button>
                    <span className="button-label">Bricks</span>
                </div>

                <div className="button-with-label">
                    <button
                        type="button"
                        className={['btn', 'btn-primary', mode === 'addweight' ? 'selected' : ''].join(' ')}
                        onClick={() => setmode(mode === 'addweight' ? null : 'addweight')}
                    >
                        <i className="bi bi-virus"></i>
                    </button>
                    <span className="button-label">Weight</span>
                </div>

                <div className="button-with-label">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setmode("erase")}
                    >
                        <i className="bi bi-eraser"></i>
                    </button>
                    <span className="button-label">Erase</span>
                </div>

                <div className="button-with-label">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={clearBoard}
                    >
                        <i className="bi bi-arrow-counterclockwise"></i>
                    </button>
                    <span className="button-label">Reset</span>
                </div>

                {/* Button to run the algorithm */}
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleRunClick}
                    >
                        <i className="bi bi-caret-right"></i>
                    </button>
                    <span className="button-label">Run</span>
                </div>

                {/* Custom Dropdown for Algorithm Selection */}
                <div className="dropdown">
                    <button
                        className="dropdown-toggle"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Select Algorithm
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {algorithms.map((algorithm) => (
                                <div
                                    key={algorithm.id}
                                    className="dropdown-item"
                                    onClick={() => toggleAlgorithm(algorithm.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={algo.includes(algorithm.id)}
                                        readOnly
                                    />
                                    <span>{algorithm.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}