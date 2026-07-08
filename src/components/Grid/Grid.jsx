import React, { useState, useRef, useEffect } from 'react';
import './Grid.css';
import { BFS, BDS, Dijkstra, AStar } from '../../utils/algorithms';

const Grid = ({ grid, setgrid, mode, start, end, editing, seteditFlag, run, algo, setrun }) => {
    const [refArray, setRefArray] = useState(getRefArray(grid));
    const [warning, setWarning] = useState('');
    const [weightedCells, setWeightedCells] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentCell, setCurrentCell] = useState(null);
    const [newWeight, setNewWeight] = useState('');

    const pathColors = {
        BFS: 'blue',
        BDS: 'green',
        Dijkstra: 'red',
        AStar: 'purple',
    };

    
    const handleCellClick = (row, col) => {
        const cellKey = `${row}-${col}`;
        const currentWeight = weightedCells[cellKey];
    
        console.log('Clicked on cell:', row, col, 'Current Weight:', currentWeight);  // Debug log
    
        if (currentWeight !== undefined || currentWeight > 1) {
            // Only show the prompt to change the weight if the current weight is greater than 1
            const newWeight = prompt(`Add weight for cell (${row}, ${col}):`, "Infinity");
            // const newWeight = prompt(`Change weight for cell (${row}, ${col}):`, currentWeight);
            if (newWeight !== null && !isNaN(newWeight)) {
                const updatedWeight = parseInt(newWeight, 10);
                setWeightedCells((prev) => ({
                    ...prev,
                    [cellKey]: updatedWeight,
                }));
                // Update the grid visually if needed
                updateGridWithNewWeight(row, col, updatedWeight);
            }
        } else {
            // If the cell has no weight or the weight is the default (1), prompt to add or update it
            // const initialWeight = prompt(`Add weight for cell (${row}, ${col}):`, "Infinity");
            // if (initialWeight !== null && !isNaN(initialWeight)) {
            //     const parsedWeight = initialWeight === "Infinity" ? Number.MAX_SAFE_INTEGER : parseInt(initialWeight, 10);
            //     addWeightToCell(row, col, parsedWeight);
            // }
        }
    };
    
    // Assuming updateGridWithNewWeight updates the grid visually
    const updateGridWithNewWeight = (row, col, weight) => {
        const newGrid = [...grid];
        newGrid[row][col] = { ...newGrid[row][col], weight };
        setgrid(newGrid);
    };
    
    
    
    
    
    
    
    
    const getWeightForCell = (y, x) => {
        const cellKey = `${y}-${x}`;
        return weightedCells[cellKey] || 1; // Retrieve the weight from weightedCells
    };

    // Toggle the Add Weight mode
    const toggleAddWeightMode = () => {
        setmode((prevMode) => (prevMode === "addWeight" ? null : "addWeight"));
    };
    
    
    
    const handleWeightChange = () => {
        if (newWeight !== null && !isNaN(newWeight)) {
            const cellKey = `${currentCell.row}-${currentCell.col}`;
    
            // Update weightedCells with the new weight
            setWeightedCells((prev) => ({
                ...prev,
                [cellKey]: parseInt(newWeight, 10),
            }));
    
            // Update the grid with the new weight
            const updatedGrid = grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (rowIndex === currentCell.row && colIndex === currentCell.col) {
                        return { ...cell, weight: parseInt(newWeight, 10) };
                    }
                    return cell;
                })
            );
    
            setgrid(updatedGrid); // Trigger re-render with updated weight
            setShowModal(false); // Close the modal after updating
        }
    };
    
    
    
    
      const renderModal = () => {
        if (!showModal || !currentCell) return null;
        return (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Cell Weight</h3>
              <p>
                Cell: ({currentCell.row}, {currentCell.col})
              </p>
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="modal-input"
              />
              <div className="modal-actions">
                <button onClick={handleWeightChange} className="btn btn-primary">
                  Save
                </button>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      };


    // Function to generate refs for each cell
    function getRefArray(grid) {
        let array = [];
        grid.forEach((row) => {
            row.forEach(() => {
                array.push(useRef());
            });
        });
        return array;
    }

    // Handle mouse down/up for grid interaction
    const handleMouseDown = () => seteditFlag(true);
    const handleMouseUp = () => seteditFlag(false);

    const handleMouseMove = (e, x, y) => {
        if (!editing) return;
        const current = grid[y][x];
        if (current.isstart || current.istarget) return;

        let newGrid = grid.slice();

        switch (mode) {
            case 'erase':
                eraseCell(x, y);
                break;

            case 'setstart':
                const updatedStartGrid = grid.map(row =>
                    row.map(cell => ({ ...cell, isstart: false })));
                updatedStartGrid[y][x] = { ...updatedStartGrid[y][x], isstart: true, istarget: false, weight: 1, iswall: false };
                start.current = { x, y };
                setgrid(updatedStartGrid);
                break;

            case 'settarget':
                newGrid = grid.map((row) =>
                    row.map((cell) => (cell.istarget ? { ...cell, istarget: false } : cell))
                );
                newGrid[y][x] = { ...newGrid[y][x], isstart: false, istarget: true, weight: 1, iswall: false };
                end.current = { x, y };
                setgrid(newGrid);
                break;

            case 'addbricks':
                newGrid[y][x] = { ...newGrid[y][x], iswall: true, weight: 1 };
                setgrid(newGrid);
                break;

            case 'removewall':
                newGrid[y][x] = { ...newGrid[y][x], iswall: false };
                setgrid(newGrid);
                break;

            case 'addweight':
                newGrid[y][x] = { ...newGrid[y][x], weight: 100, iswall: false };
                setgrid(newGrid);
                break;

            default:
                return;
        }
    };

    // Erase wall in a cell
    const eraseCell = (x, y) => {
        if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return;

        const newGrid = grid.slice();
        newGrid[y][x] = { ...newGrid[y][x], iswall: false, weight: 1 }; // Reset the cell
        setgrid(newGrid); // Update the state
    };

    useEffect(() => {
        if (!run) return;
    
        if (!algo || algo.length === 0) {
            console.error("No algorithm selected.");
            setrun(false);
            return;
        }
    
        algo.forEach((selectedAlgo) => {
            let hashmap = {};
            let prevmap = {};
    
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[0].length; x++) {
                    hashmap[`${x}-${y}`] = false;
                    prevmap[`${x}-${y}`] = null;
                }
            }
    
            let result = null;
            if (selectedAlgo === 'BFS') {
                result = BFS(grid, hashmap, prevmap, start.current, end.current);
            } else if (selectedAlgo === 'BDS') {
                result = BDS(grid, hashmap, prevmap, start.current, end.current);
            } else if (selectedAlgo === 'Dijkstra') {
                result = Dijkstra(grid, hashmap, prevmap, start.current, end.current);
            } else if (selectedAlgo === 'AStar') {
                result = AStar(grid, hashmap, prevmap, start.current, end.current);
            }
    
            if (result) {
                const { path, traversed } = result;
    
                // Visualize traversal
traversed.forEach((cell, index) => {
    setTimeout(() => {
        const ref = refArray[cell.y * grid[0].length + cell.x]?.current;
        if (ref) {
            ref.classList.add('traversal', selectedAlgo.toLowerCase()); // Add algorithm-specific class
        }
    }, index * 20);
});

// Visualize optimal path
setTimeout(() => {
    path.forEach((cell, index) => {
        const ref = refArray[cell.y * grid[0].length + cell.x]?.current;
        if (ref) {
            ref.classList.remove('traversal');
            ref.classList.add('path', selectedAlgo.toLowerCase()); // Add algorithm-specific class
        }
    });
}, traversed.length * 20);
            } else {
                console.error(`${selectedAlgo} failed to find a path.`);
            }
        });
    
        setrun(false);
    }, [run, algo, grid, start, end, refArray]);
    
    // Helper functions to get unique colors for each algorithm
    const getTraversalColor = (algo) => {
        switch (algo) {
            case 'BFS': return 'lightblue';
            case 'Dijkstra': return 'lightgreen';
            case 'AStar': return 'lightpink';
            case 'BDS': return 'lightyellow';
            default: return 'lightgray';
        }
    };
    
    const getPathColor = (algo) => {
        switch (algo) {
            case 'BFS': return 'blue';
            case 'Dijkstra': return 'green';
            case 'AStar': return 'purple';
            case 'BDS': return 'orange';
            default: return 'gray';
        }
    };

    return (
        <div className="board-container">
            {/* Warning Message */}
            {warning && <div className="warning">{warning}</div>}

            {/* Grid Board */}
            <div className="board">
                {refArray.map((ref, index) => {
                    const yIndex = Math.floor(index / grid[0].length);
                    const xIndex = index % grid[0].length;
                    const cell = grid[yIndex][xIndex];

                    let classList = ['cell'];
                    if (cell.iswall) classList.push('wall');
                    if (cell.isstart) classList.push('start');
                    if (cell.istarget) classList.push('target');
                    if (cell.weight > 1) classList.push('weighted');

                    return (
                        <div
                            key={`${index}`}
                            ref={ref}
                            className={classList.join(' ')}
                            onMouseDown={() => handleMouseDown(xIndex, yIndex)}
                            onMouseUp={handleMouseUp}
                            onMouseMove={(e) => handleMouseMove(e, xIndex, yIndex)}
                            onClick={() => handleCellClick(yIndex, xIndex)}  // Ensure this calls the weight change function
                        >
                            {cell.weight !== undefined && cell.weight > 1 && <i className="bi bi-virus"></i>}  {/* Show virus icon if weight exists */}
                            {cell.isstart && <i className="bi bi-geo-alt"></i>} {/* Show start icon */}
                            {cell.istarget && <i className="bi bi-geo"></i>} {/* Show target icon */}
                        </div>
                    );
                })}
            </div>

            {/* Modal for editing weight */}
            {renderModal()}
        </div>
    );
};

export default Grid;
