const express = require('express');
const app = express();
app.use(express.json());

let flights = [];

const createFlight = (req, res) => {
    const flight = req.body;
    flights.push(flight);
    res.status(201).send(flight);
};

const readFlights = (req, res) => {
    res.send(flights);
};

const readFlight = (req, res) => {
    const flight = flights.find(f => f.id === parseInt(req.params.id));
    if (!flight) return res.status(404).send('Flight not found');
    res.send(flight);
};

const updateFlight = (req, res) => {
    const flight = flights.find(f => f.id === parseInt(req.params.id));
    if (!flight) return res.status(404).send('Flight not found');

    Object.assign(flight, req.body);
    res.send(flight);
};

const deleteFlight = (req, res) => {
    const flightIndex = flights.findIndex(f => f.id === parseInt(req.params.id));
    if (flightIndex === -1) return res.status(404).send('Flight not found');

    const deletedFlight = flights.splice(flightIndex, 1);
    res.send(deletedFlight);
};

app.post('/flights', createFlight);
app.get('/flights', readFlights);
app.get('/flights/:id', readFlight);
app.put('/flights/:id', updateFlight);
app.delete('/flights/:id', deleteFlight);

module.exports = {
    createFlight,
    readFlights,
    readFlight,
    updateFlight,
    deleteFlight
};

if (require.main === module) {
    const port = 3000;
    app.listen(port, () => {
        console.log(`Flight app listening at http://localhost:${port}`);
    });
}
