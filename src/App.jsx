import React from 'react';
import './App.css';
import Grid from './components/Grid/Grid';
import Navbar from './Navbar/Navbar';
import Header from './Header/Header';
import { useParams } from './context/context'; // Assuming useParams is your context hook
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserGuide from './UserGuide.jsx';

function MainApp() {
    // Get values from context
    const { grid, setgrid, mode, setmode, setres, start, end, editing, seteditFlag, run, algo, setrun, setalgo } = useParams();

    return (
        <div>
            <Header />
            <Navbar />
            <Grid
                grid={grid}
                setgrid={setgrid}
                mode={mode}
                start={start}
                end={end}
                editing={editing}
                seteditFlag={seteditFlag}
                run={run} // Pass `run` to Grid
                algo={algo} // Pass `algo` to Grid
                setrun={setrun}
                setalgo={setalgo}
                setmode={setmode}
                setres={setres}
                // Uncomment these if needed:
                // weightedCells={weightedCells}
                // setWeightedCells={setWeightedCells}
                // handleCellClick={handleCellClick}
                // toggleAddWeightMode={toggleAddWeightMode}
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainApp />} />
                <Route path="/user-guide" element={<UserGuide />} />
            </Routes>
        </Router>
    );
}

export default App;