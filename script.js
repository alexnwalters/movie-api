'Use Strict';

const omdbKey = 'ca762609';
const omdbURL = 'https://www.omdbapi.com/?';

const tmdbKey = '572565d80f61af6afed1df98562c0e06';
const findURL = 'https://api.themoviedb.org/3/find/';
const trailerURL = 'https://api.themoviedb.org/3/movie/';

const movieScores1 = [];
const movieScores2 = [];
const title1 = [];
const title2 = [];

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
    createScoreButton(); 
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
        .then(responseJson => displayResults(responseJson, movieDivId1, movieScores1, title1))
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
        .then(responseJson => displayResults(responseJson, movieDivId2, movieScores2, title2))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });   
}

function displayResults(responseJson, movieDiv, scores, title) {
    console.log(responseJson);
    $('#js-error-message').empty();
    handleMovieDetails(responseJson, movieDiv);
    handleMoviesRatings(responseJson, movieDiv);  
    storeRatings(responseJson, scores);
    runTmdbFindGet(responseJson, movieDiv);
    storeTitles(responseJson, title);
}

function storeTitles(responseJson, title) {
    title.length = 0;
    title.push(responseJson.Title);
    return title;
}

function storeRatings(responseJson, scores) {
    scores.length = 0;
    for(let i = 0; i < responseJson.Ratings.length; i++) {
        if (responseJson.Ratings[i].Source == 'Internet Movie Database') {
            scores.push(parseFloat(responseJson.Ratings[i].Value));
        }
        else if (responseJson.Ratings[i].Source == 'Rotten Tomatoes') {
            if (responseJson.Ratings.length == 2) {
                scores.push(parseFloat(responseJson.Ratings[i].Value));
                scores.push(0);
            }
            else {
                scores.push(parseFloat(responseJson.Ratings[i].Value));
            }
        }
        else {
            if (responseJson.Ratings.length == 2) {
                scores.push(0);
                scores.push(parseFloat(responseJson.Ratings[i].Value));
            }
            else {
                scores.push(parseFloat(responseJson.Ratings[i].Value));
            }
        }
    }
    console.log(scores);
    return scores;
}

function handleMovieDetails(responseJson, movieDiv) {
    $(movieDiv).empty();
    
    $(movieDiv).append(
        `<h2 class='js-movie-title'>${responseJson.Title}</h2>
        <p>${responseJson.Year}</p>
        <img src='${responseJson.Poster}' class='js-movie-poster' alt='Movie Poster'>
        <ul class='js-movie-rating hidden'>`
    );
}

function handleMoviesRatings(responseJson, movieDiv) {
    if (responseJson.Ratings.length == 2) {
        $(movieDiv + ' .js-movie-rating').append(
            `<li>${responseJson.Ratings[0].Source}: ${responseJson.Ratings[0].Value}</li>`
        );

        if (responseJson.Ratings[1].Source == "Rotten Tomatoes") {
            $(movieDiv + ' .js-movie-rating').append(
                `<li>${responseJson.Ratings[1].Source}: ${responseJson.Ratings[1].Value}</li>
                <li>Metacritic: No Score</li>`
            );
        }
        else {
            $(movieDiv + ' .js-movie-rating').append(
                `<li>Rotten Tomatoes: No Score</li>
                <li>${responseJson.Ratings[1].Source}: ${responseJson.Ratings[1].Value}</li>`
            );
        }
    }
    else {
        for (let i = 0; i < responseJson.Ratings.length; i++) {
            $(movieDiv + ' .js-movie-rating').append(
                `<li>${responseJson.Ratings[i].Source}: ${responseJson.Ratings[i].Value}</li>`
            );
        }
    }
}

function runTmdbFindGet(omdbResponse, movieDiv) {
    const tmdbParamFind = {
        api_key: tmdbKey,
        language: 'en-US',
        external_source: 'imdb_id',
    }

    const tmdbFindURL = findURL + omdbResponse.imdbID + '?' + formatParams(tmdbParamFind);

    getUseImdbIdtoFindTmdbId(tmdbFindURL, movieDiv);
}

function getUseImdbIdtoFindTmdbId(tmdbFindURL, movieDiv) {
    fetch(tmdbFindURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => runTmdbTrailerGet(responseJson, movieDiv))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function runTmdbTrailerGet(responseJson, movieDiv) {
    const tmdbParamTrailer = {
        api_key: tmdbKey,
        language: 'en-US',
    }

    const tmdbTrailerURL = trailerURL + responseJson.movie_results[0].id + '/videos?' + formatParams(tmdbParamTrailer);

    getUseTmdbIdtofindYoutubeId(tmdbTrailerURL, movieDiv);
}

function getUseTmdbIdtofindYoutubeId(tmdbTrailerURL, movieDiv) {
    fetch(tmdbTrailerURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => displayYoutubeById(responseJson, movieDiv))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayYoutubeById(responseJson, movieDiv) {            
    for(let i = 0; i < responseJson.results.length; i++) {
        if (responseJson.results[i].type == "Trailer") {
            $(movieDiv).append(
                `<iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${responseJson.results[i].key}"
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen><iframe>`
            );

           break;
        }
    }
}

function createScoreButton() {
    $('section').append('<button class="score-button" type="button">show score</button>');
}

function hideScoresList() {
    $('section').find('.js-movie-rating').toggleClass('hidden');
}

function hideScoreButton() {
    $('section').find('.score-button').toggleClass('hidden');
}

function compareMovieRatings(movieScores1, movieScores2, title1, title2) {
    let winsMovie1 = 0;
    let winsMovie2 = 0;

    for (let i = 0; i < movieScores1.length; i++) {
        if (movieScores1[i] > movieScores2[i]) {
            winsMovie1++;
        }
        else if (movieScores1[i] < movieScores2[i]) {
            winsMovie2++;
        }
        else {
            return;
        }
    }

    if (winsMovie1 > winsMovie2) {
        $('section').append(`<h3>The Winner Is ${title1}!</h3>`);
    }
    else if (winsMovie1 < winsMovie2) {
        $('section').append(`<h3>The Winner Is ${title2}!</h3>`);
    }
    else {
        $('section').append(`<h3>It's A Draw!</h3>`)
    }

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

    $('section').on('click', '.score-button', function(event) {
        hideScoresList();
        hideScoreButton();
        compareMovieRatings(movieScores1, movieScores2, title1, title2);
    });
}

$(watchForm);