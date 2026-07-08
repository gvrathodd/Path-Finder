// BFS Algorithm
export function BFS(grid, hashmap, prevmap, start, end) {
    if (!start || !end || start.x === undefined || start.y === undefined || end.x === undefined || end.y === undefined) {
        console.error("Invalid start or end node:", { start, end });
        return null;
    }

    const queue = [];
    const directions = [
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
    ];
    const traversed = [];

    queue.push(start);
    hashmap[`${start.x}-${start.y}`] = true;

    while (queue.length > 0) {
        const current = queue.shift();
        traversed.push(current); // Track traversal

        if (current.x === end.x && current.y === end.y) {
            const path = [];
            let node = current;

            while (node) {
                path.push(node);
                grid[node.y][node.x].isPath = true;
                node = prevmap[`${node.x}-${node.y}`];
            }
            return { updatedGrid: grid, path: path.reverse(), traversed }; // Include traversed nodes
        }

        for (let direction of directions) {
            const neighborX = current.x + direction.x;
            const neighborY = current.y + direction.y;

            if (
                neighborX >= 0 &&
                neighborX < grid[0].length &&
                neighborY >= 0 &&
                neighborY < grid.length
            ) {
                const neighbor = grid[neighborY][neighborX];
                if (neighbor.iswall || hashmap[`${neighborX}-${neighborY}`]) {
                    continue;
                }

                queue.push(neighbor);
                hashmap[`${neighborX}-${neighborY}`] = true;
                prevmap[`${neighborX}-${neighborY}`] = current;
            }
        }
    }

    console.error("No path found!");
    return { updatedGrid: grid, path: [], traversed }; // Return empty path if no path found
}





// Dijkstras Algorithm
export function Dijkstra(grid, hashmap, prevmap, start, end) {
    if (!start || !end || start.x === undefined || start.y === undefined || end.x === undefined || end.y === undefined) {
        console.error("Invalid start or end node:", { start, end });
        return null;
    }

    const directions = [
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
    ];
    const traversed = [];
    const distanceMap = {};
    const priorityQueue = [];

    // Initialize distance map with infinity for all nodes
    for (let row of grid) {
        for (let node of row) {
            distanceMap[`${node.x}-${node.y}`] = Infinity;
        }
    }

    // Set the starting node distance to 0
    distanceMap[`${start.x}-${start.y}`] = 0;
    priorityQueue.push(start);

    while (priorityQueue.length > 0) {
        // Sort priority queue by distance
        priorityQueue.sort((a, b) => distanceMap[`${a.x}-${a.y}`] - distanceMap[`${b.x}-${b.y}`]);
        const current = priorityQueue.shift();
        traversed.push(current);

        // Debug current node
        console.log("Visiting node:", current);

        // Check if we reached the end node
        if (current.x === end.x && current.y === end.y) {
            const path = [];
            let node = current;

            while (node) {
                path.push(node);
                grid[node.y][node.x].isPath = true;
                node = prevmap[`${node.x}-${node.y}`];
            }
            return { updatedGrid: grid, path: path.reverse(), traversed };
        }

        // Explore neighbors
        for (let direction of directions) {
            const neighborX = current.x + direction.x;
            const neighborY = current.y + direction.y;

            if (
                neighborX >= 0 &&
                neighborX < grid[0].length &&
                neighborY >= 0 &&
                neighborY < grid.length
            ) {
                const neighbor = grid[neighborY][neighborX];
                if (neighbor.iswall || hashmap[`${neighborX}-${neighborY}`]) {
                    continue;
                }

                // Debug neighbor's weight
                console.log(`Neighbor (${neighborX}, ${neighborY}) weight: ${neighbor.weight}`);

                // Include the neighbor's weight in the new distance
                const newDistance = distanceMap[`${current.x}-${current.y}`] + (neighbor.weight || 1);

                if (newDistance < distanceMap[`${neighborX}-${neighborY}`]) {
                    distanceMap[`${neighborX}-${neighborY}`] = newDistance;
                    prevmap[`${neighborX}-${neighborY}`] = current;

                    // Debug distance update
                    console.log(`Updated distance for (${neighborX}, ${neighborY}): ${newDistance}`);

                    priorityQueue.push(neighbor);
                }
            }
        }

        hashmap[`${current.x}-${current.y}`] = true;
    }

    console.error("No path found!");
    return { updatedGrid: grid, path: [], traversed };
}





// A* Algorithm
export function AStar(grid, hashmap, prevmap, start, end) {
    if (!start || !end || start.x === undefined || start.y === undefined || end.x === undefined || end.y === undefined) {
        console.error("Invalid start or end node:", { start, end });
        return null;
    }

    const directions = [
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
    ];
    const traversed = [];
    const gScore = {};
    const fScore = {};
    const priorityQueue = [];

    const heuristic = (node, goal) => Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);

    for (let row of grid) {
        for (let node of row) {
            gScore[`${node.x}-${node.y}`] = Infinity;
            fScore[`${node.x}-${node.y}`] = Infinity;
        }
    }

    gScore[`${start.x}-${start.y}`] = 0;
    fScore[`${start.x}-${start.y}`] = heuristic(start, end);
    priorityQueue.push(start);

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => fScore[`${a.x}-${a.y}`] - fScore[`${b.x}-${b.y}`]);
        const current = priorityQueue.shift();
        traversed.push(current);

        if (current.x === end.x && current.y === end.y) {
            const path = [];
            let node = current;

            while (node) {
                path.push(node);
                grid[node.y][node.x].isPath = true;
                node = prevmap[`${node.x}-${node.y}`];
            }
            return { updatedGrid: grid, path: path.reverse(), traversed };
        }

        for (let direction of directions) {
            const neighborX = current.x + direction.x;
            const neighborY = current.y + direction.y;

            if (
                neighborX >= 0 &&
                neighborX < grid[0].length &&
                neighborY >= 0 &&
                neighborY < grid.length
            ) {
                const neighbor = grid[neighborY][neighborX];
                if (neighbor.iswall || hashmap[`${neighborX}-${neighborY}`]) {
                    continue;
                }

                const tentativeGScore = gScore[`${current.x}-${current.y}`] + 1;

                if (tentativeGScore < gScore[`${neighborX}-${neighborY}`]) {
                    gScore[`${neighborX}-${neighborY}`] = tentativeGScore;
                    fScore[`${neighborX}-${neighborY}`] = tentativeGScore + heuristic(neighbor, end);
                    prevmap[`${neighborX}-${neighborY}`] = current;
                    priorityQueue.push(neighbor);
                }
            }
        }

        hashmap[`${current.x}-${current.y}`] = true;
    }

    console.error("No path found!");
    return { updatedGrid: grid, path: [], traversed };
}





// Bidirectional Search (BDS) Algorithm
export function BDS(grid, hashmap, prevmap, start, end) {
    if (!start || !end || start.x === undefined || start.y === undefined || end.x === undefined || end.y === undefined) {
        console.error("Invalid start or end node:", { start, end });
        return null;
    }

    const directions = [
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
    ];
    const startQueue = [];
    const endQueue = [];
    const startVisited = {};
    const endVisited = {};
    const startPrev = {};
    const endPrev = {};
    const traversed = [];

    // Initialize queues and visited maps
    startQueue.push(start);
    endQueue.push(end);
    startVisited[`${start.x}-${start.y}`] = true;
    endVisited[`${end.x}-${end.y}`] = true;

    const findIntersection = () => {
        for (let key in startVisited) {
            if (endVisited[key]) return key;
        }
        return null;
    };

    const bfsStep = (queue, visited, otherVisited, prev, isStart) => {
        if (queue.length === 0) return null;

        const current = queue.shift();
        traversed.push(current);

        for (let direction of directions) {
            const neighborX = current.x + direction.x;
            const neighborY = current.y + direction.y;

            if (
                neighborX >= 0 &&
                neighborX < grid[0].length &&
                neighborY >= 0 &&
                neighborY < grid.length
            ) {
                const neighbor = grid[neighborY][neighborX];
                if (neighbor.iswall || visited[`${neighborX}-${neighborY}`]) {
                    continue;
                }

                visited[`${neighborX}-${neighborY}`] = true;
                prev[`${neighborX}-${neighborY}`] = current;
                queue.push(neighbor);

                // Check for intersection
                if (otherVisited[`${neighborX}-${neighborY}`]) {
                    return { intersection: `${neighborX}-${neighborY}`, isStart };
                }
            }
        }
        return null;
    };

    while (startQueue.length > 0 && endQueue.length > 0) {
        const resultStart = bfsStep(startQueue, startVisited, endVisited, startPrev, true);
        if (resultStart) return constructPath(resultStart.intersection);

        const resultEnd = bfsStep(endQueue, endVisited, startVisited, endPrev, false);
        if (resultEnd) return constructPath(resultEnd.intersection);
    }

    console.error("No path found!");
    return { updatedGrid: grid, path: [], traversed };

    function constructPath(intersectionKey) {
        const [ix, iy] = intersectionKey.split("-").map(Number);
        let path = [];
        let node = { x: ix, y: iy };

        // Trace path back to the start
        while (node) {
            path.push(node);
            grid[node.y][node.x].isPath = true;
            node = startPrev[`${node.x}-${node.y}`];
        }
        path.reverse();

        // Trace path to the end
        node = endPrev[`${ix}-${iy}`];
        while (node) {
            path.push(node);
            grid[node.y][node.x].isPath = true;
            node = endPrev[`${node.x}-${node.y}`];
        }

        return { updatedGrid: grid, path, traversed };
    }
}


// utils/algorithms.js

// BFS Algorithm
export const func1 = (grid, hashmap, prevmap, start, end) => {
    console.log("Running BFS...");
    const result = BFS(grid, hashmap, prevmap, start, end);
    console.log("BFS Result:", result);
    return result; // Return the full result object
};

// Dijkstra Algorithm
export const func2 = (grid, hashmap, prevmap, start, end) => {
    console.log("Running Dijkstra...");
    const result = Dijkstra(grid, hashmap, prevmap, start, end);
    console.log("Dijkstra Result:", result);
    return result; // Return the full result object
};

// A* Algorithm
export const func3 = (grid, hashmap, prevmap, start, end) => {
    console.log("Running A*...");
    const result = AStar(grid, hashmap, prevmap, start, end);
    console.log("A* Result:", result);
    return result; // Return the full result object
};

// BDS Algorithm
export const func4 = (grid, hashmap, prevmap, start, end) => {
    console.log("Running BDS...");
    const result = BDS(grid, hashmap, prevmap, start, end);
    console.log("BDS Result:", result);
    return result; // Return the full result object
};