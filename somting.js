const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8085;

let movies = [];

app.use(express.json());

fs.readFile('./movies.json', (err, data) => {
    if (err) {
        console.error('Error: ', err)
    }
    movies = JSON.parse(data);
    console.log('Welcome to ARC XXI');

    app.get('/movies', (req, res) => {
        res.send(movies);
    });

    app.get('/movies/:imdbId', (req, res) => {
        const imdbId = req.params.imdbId;
        const movie = movies.find(movie => movie.imdbID === imdbId);
        if (movie) {
            res.send(movie);
        } else {
            res.status(404).send('missing movie sir');
        }
    });
    
    app.get('/search', (req, res) => {
        const searchMovie = req.query.name;
        if (!searchMovie) {
            res.status(400).send('search name missing');
            return;
        }
        const filteredMovies = movies.filter(movie =>
            movie.Title.toLowerCase().includes(searchMovie.toLowerCase())
        );
        if (filteredMovies.length > 0) {
            res.send(filteredMovies);
        } else {
            res.status(404).send('No movies found');
        }
    });
});

app.post('/movies', (req, res) => {
    const newMovie = req.body;
    movies.push(newMovie);
    saveJSON()
    res.send('Movie added successfully');
});

app.delete('/movies/:imdbId', (req, res) => {
    const imdbId = req.params.imdbId;
    const index = movies.findIndex(movie => movie.imdbId === imdbId);
    if (index !== -1) {
        movies.splice(index, 1);
        saveJSON()
        res.status(200).send('Movie deleted successfully');
    }
});

app.put('/movies/:imdbId', (req, res) => {
    const imdbId = req.params.imdbId;
    const updatedMovie = req.body;
    const index = movies.findIndex(movie => movie.imdbId === imdbId);
    if (index !== -1) {
        movies[index] = updatedMovie;
        saveJSON();
        res.status(200).send('Movie updated successfully');
    } else {
        res.status(404).send('Movie not found');
    }
});

//JSON stringify buat sesuain json
function saveJSON() {
    fs.writeFile('./movies.json', JSON.stringify(movies, null, 2), (err) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('saved to file');
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});