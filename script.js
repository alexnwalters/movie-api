'Use Strict';

const omdbKey = 'ca762609';
const omdbURL = 'https://www.omdbapi.com/?';

const tmdbKey = '572565d80f61af6afed1df98562c0e06';
const findURL = 'https://api.themoviedb.org/3/find/';
const trailerURL = 'https://api.themoviedb.org/3/movie/'

function formatParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function runMoviesGets(movie1, movie2) {
    const omdbParams1 = {
        apikey: omdbKey,
        t: movie1
    };

    const omdbParams2 = {
        apikey: omdbKey,
        t: movie2
    };

    const searchMovie1String = formatParams(omdbParams1);
    const searchMovie1URL = omdbURL + searchMovie1String;
    const searchMovie2String = formatParams(omdbParams2);
    const searchMovie2URL = omdbURL + searchMovie2String;  

    getMoviesForDisplay(searchMovie1URL, searchMovie2URL);
}

const movieScores1 = [];
const movieScores2 = [];

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
        .then(responseJson => displayResults(responseJson, movieDivId1, movieScores1))
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
        .then(responseJson => displayResults(responseJson, movieDivId2, movieScores2))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

    console.log(movieScores1, movieScores2);
}

function displayResults(responseJson, movieDiv, scores) {
    console.log(responseJson);

    $('#js-error-message').empty();

    $(movieDiv).empty();
    
    $(movieDiv).append(
        `<h2 class='js-movie-title'>${responseJson.Title}</h2>
        <p>${responseJson.Year}</p>
        <img src='${responseJson.Poster}' class='js-movie-poster' alt='Movie Poster'>
        <ul class='js-movie-rating'>`
    );

    if (responseJson.Ratings.length == 2) {
        $(movieDiv).append(
            `<li>${responseJson.Ratings[0].Source}: ${responseJson.Ratings[0].Value}</li>`
        );

        if (responseJson.Ratings[1].Source == "Rotten Tomatoes") {
            $(movieDiv).append(
                `<li>${responseJson.Ratings[1].Source}: ${responseJson.Ratings[1].Value}</li>
                <li>Metacritic: No Score</li>`
            );
        }
        else {
            $(movieDiv).append(
                `<li>Rotten Tomatoes: No Score</li>
                <li>${responseJson.Ratings[1].Source}: ${responseJson.Ratings[1].Value}</li>`
            );
        }
    }
    else {
        for (let i = 0; i < responseJson.Ratings.length; i++) {
            $(movieDiv).append(
                `<li>${responseJson.Ratings[i].Source}: ${responseJson.Ratings[i].Value}</li>`
            );
        }
    }

    $(movieDiv).append(
        '</ul>'
    );
        
    storeRatings(responseJson, scores)
    
    console.log(scores);

    runTmdbFindGet(responseJson);
}

function storeRatings(responseJson, scores) {
    scores.length = 0;

    for (let i = 0; i < responseJson.Ratings.length; i++) {	    
        scores.push(responseJson.Ratings[i]);
    };
    return scores;
}

function runTmdbFindGet(omdbResponse) {
    const tmdbParamFind = {
        api_key: tmdbKey,
        language: 'en-US',
        external_source: 'imdb_id',
    }

    const tmdbFindURL = findURL + omdbResponse.imdbID + '?' + formatParams(tmdbParamFind);

    getUseImdbIdtoFindTmdbId(tmdbFindURL);
}

function getUseImdbIdtoFindTmdbId(tmdbFindURL) {
    fetch(tmdbFindURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => runTmdbTrailerGet(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function runTmdbTrailerGet(responseJson) {
    const tmdbParamTrailer = {
        api_key: tmdbKey,
        language: 'en-US',
    }

    const tmdbTrailerURL = trailerURL + responseJson.movie_results[0].id + '/videos?' + formatParams(tmdbParamTrailer);

    console.log(tmdbTrailerURL);
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