import React from 'react';
import './Navbar/Navbar.css';

const UserGuide = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
            <h1>User Guide</h1>
            <hr />

            <h2>Start</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-geo-alt"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                    Sets the starting point on the grid where the pathfinding algorithm begins.
                </span>
            </div>
            <hr />

            <h2>Target</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-geo"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                    Sets the target point on the grid where the pathfinding algorithm ends.
                </span>
            </div>
            <hr />

            <h2>Bricks</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-bricks"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                    Adds obstacles or walls to the grid. The algorithm will avoid these during pathfinding.
                </span>
            </div>
            <hr />

            <h2>Weight</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-virus"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                    Adds weighted cells to the grid, making them harder to traverse and influencing the path.
                </span>
            </div>
            <hr />

            <h2>Erase</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-eraser"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                    Erases any added elements like bricks or weights from the grid.
                </span>
            </div>
            <hr />

            <h2>Reset</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-arrow-counterclockwise"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                    Clears the entire grid, resetting it to its initial state.
                </span>
            </div>
            <hr />

            <h2>Run</h2>
            <div className="button-with-label">
                <button type="button" className="btn btn-primary">
                    <i className="bi bi-caret-right"></i>
                </button>
                <span className="button-label" style={{ color: 'black' }}>
                     Executes the selected pathfinding algorithm and visualizes the process.
                </span>
            </div>
            <hr />

            <h2>Choose your algorithm</h2>
            <div>
                <select className="form-select" aria-label="Default select example">
                    <option value="">Choose your algorithm</option>
                    <option value="Dijkstra">Dijkstra</option>
                    <option value="AStar">AStar</option>
                    <option value="BDS">BDS</option>
                    <option value="BFS">BFS</option>
                </select>
                <p className="button-label" style={{ color: 'black' }}>
                     Allows you to select the algorithm to use for pathfinding, such as Dijkstra or A*.
                </p>
            </div>
        </div>
    );
};

export default UserGuide;
