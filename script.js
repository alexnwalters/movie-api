'Use Strict';

const omdbKey = 'ca762609';
const omdbURL = 'http://www.omdbapi.com/?';

function formatParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function runMoviesGets(movie1, movie2) {
    const params1 = {
        apikey: omdbKey,
        t: movie1
    };

    const params2 = {
        apikey: omdbKey,
        t: movie2
    };

    const searchMovie1String = formatParams(params1);
    const searchMovie1URL = omdbURL + searchMovie1String;
    const searchMovie2String = formatParams(params2);
    const searchMovie2URL = omdbURL + searchMovie2String;

    getMoviesForDisplay(searchMovie1URL, searchMovie2URL);
    getMoviesRatings(searchMovie1URL, searchMovie2URL);
}

function getMoviesForDisplay(searchMovie1URL, searchMovie2URL) {
    const movieDivId1 = '#js-movie-one';
    const movieDivId2 = '#js-movie-two';
    
    fetch(searchMovie1URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, movieDivId1))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

    fetch(searchMovie2URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, movieDivId2))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResults(responseJson, movieDiv) {
    console.log(responseJson);

    $('#js-error-message').empty();

    $(movieDiv).empty();
    
    $(movieDiv).append(
        `<h2 class='js-movie-title'>${responseJson.Title}</h2>
        <p>${responseJson.Year}</p>
        <img src='${responseJson.Poster}' class='js-movie-poster' alt='Movie Poster'>
        <ul class='js-movie-rating'>`
    );

    for (let i = 0; i < responseJson.Ratings.length; i++) {
        $(movieDiv).append(
            `<li>${responseJson.Ratings[i].Source}: ${responseJson.Ratings[i].Value}</li>`
        );
    };

    $(movieDiv).append(
        '</ul>'
    );
}

function getMoviesRatings (searchMovie1URL, searchMovie2URL) { 
    const movie1Scores = [];
    const movie2Scores = [];

    fetch(searchMovie1URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => storeRatings(responseJson, movie1Scores))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

    fetch(searchMovie2URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => storeRatings(responseJson, movie2Scores))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

    console.log(movie1Scores);
} 

function storeRatings(responseJson, scores) {
    scores = responseJson.Ratings;
    
    console.log(scores);
    return scores;
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        console.log('Ran watchForm');
        const movie1 = $('#movie-one').val();
        const movie2 = $('#movie-two').val();
        console.log(movie1, movie2);
        runMoviesGets(movie1, movie2);
    });
}

$(watchForm);