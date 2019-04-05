'Use Strict';

const omdbKey = 'ca762609';
const omdbURL = 'https://www.omdbapi.com/?';

const tmdbKey = '572565d80f61af6afed1df98562c0e06';
const findURL = 'https://api.themoviedb.org/3/find/';
const searchURL = 'https://api.themoviedb.org/3/search/movie';
const movieURL = 'https://api.themoviedb.org/3/movie/';

const imdbId1 = [];
const imdbId2 = [];
const movieScores1 = [];
const movieScores2 = [];
const title1 = [];
const title2 = [];


function formatParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

//create the API string and call the TMDb API search
function runtmdbMovieSearchGets(movie1, movie2) {
    const tmdbSearchParam1 = {
        api_key: tmdbKey,
        language: 'en-US',
        query: movie1
    }
    
    const tmdbSearchParam2 = {
        api_key: tmdbKey,
        language: 'en-US',
        query: movie2
    }
    
    const searchTMDBMovie1String = formatParams(tmdbSearchParam1);
    const searchTMDBMovie2String = formatParams(tmdbSearchParam2);
    const searchMovie1URL = searchURL + '?' + searchTMDBMovie1String;
    const searchMovie2URL = searchURL + '?' + searchTMDBMovie2String; 

    getSearchTmdbMovies(searchMovie1URL, searchMovie2URL);
}

//make requests to TMDb API search/movie endpoint
function getSearchTmdbMovies(searchMovie1URL, searchMovie2URL) {
    const movie1Results = '#js-search-one';
    const movie2Results = '#js-search-two';
    const errorMovie1 = 'Movie 1';
    const errorMovie2 = 'Movie 2';
   
    fetch(searchMovie1URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => testForSearchReturn(responseJson, errorMovie1))
        .then(responseJson => displayFoundMovieOptions(responseJson, movie1Results))
        .catch(err => {
            $('#js-error-message').append(`Something went wrong: ${err.message}<br>`);
        });
    fetch(searchMovie2URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => testForSearchReturn(responseJson, errorMovie2))
        .then(responseJson => displayFoundMovieOptions(responseJson, movie2Results))
        .catch(err => {
            $('#js-error-message').append(`Something went wrong: ${err.message}<br>`);
        });
        
    handleReadyButton();
    handleSearchRestart();
}

//test for succussful movie search
function testForSearchReturn(responseJson, movieError) {
    if(responseJson.results.length !== 0) {
        return responseJson;
    }
    else {
        if(!alert(`${movieError} was not found. Please search Again.`)){window.location.reload();}
    };
}

//create the select input options for search results
function displayFoundMovieOptions(responseJson, movieResultsList) {
    for (let i = 0; i < responseJson.results.length && i < 10; i++) {
        $(movieResultsList).append(
            `<option value='${responseJson.results[i].id}'>
            ${responseJson.results[i].title}  (${responseJson.results[i].release_date})
            </option>`
        );
    }
}

//create the API string and call the TMDb API Movie details
function runTmdbMovieDetailsGets() {
    const idMovie1 = 'js-search-one';
    const idMovie2 = 'js-search-two';  
    
    const tmdbDetailsParam = {
        api_key: tmdbKey,
        language: 'en-US',
    }
        
    const TMDBMovieDetailsString = formatParams(tmdbDetailsParam);
    const details1MovieURL = movieURL + document.getElementById(idMovie1).value + '?' + TMDBMovieDetailsString;
    const details2MovieURL = movieURL + document.getElementById(idMovie2).value + '?' + TMDBMovieDetailsString;

    getDetailsTmdbMovies(details1MovieURL, details2MovieURL);
}

//make requests to TMDb API movie endpoint
function getDetailsTmdbMovies(details1MovieURL, details2MovieURL) {
    const movieDivId1 = '#js-movie-one';
    const movieDivId2 = '#js-movie-two';
    const scoreDivId1 = '#js-score-one';
    const scoreDivId2 = '#js-score-two';
       
    fetch(details1MovieURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => useTmdbIdtoGetImdbId(responseJson, movieDivId1, scoreDivId1, movieScores1, title1))
        .catch(err => {
            $('#js-error-message').append(`Something went wrong: ${err.message}<br>`);
        });

    fetch(details2MovieURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => useTmdbIdtoGetImdbId(responseJson, movieDivId2, scoreDivId2, movieScores2, title2))
        .catch(err => {
            $('#js-error-message').append(`Something went wrong: ${err.message}<br>`);
        });
}

//pull the IMDb Id from the TMDb movie details response
function useTmdbIdtoGetImdbId(responseJson, movieDiv, scoreDiv, scores, title) {
    let imdbId = responseJson.imdb_id;
    
    runOmdbMovieInfoGets(imdbId, movieDiv, scoreDiv, scores, title);
}

//create the API string and call the OMDb API Movie details
function runOmdbMovieInfoGets(imdbId, movieDiv, scoreDiv, scores, title) {
    const omdbParams = {
        apikey: omdbKey,
        i: imdbId
    };

    const omdbMovieString = formatParams(omdbParams);
    const searchOmdbMovieURL = omdbURL + omdbMovieString;

    getMoviesForDisplay(searchOmdbMovieURL, movieDiv, scoreDiv, scores, title);
}

//make requests to OMDb API imdId endpoint
function getMoviesForDisplay(searchOmdbMovieURL, movieDiv, scoreDiv, scores, title) {

    fetch(searchOmdbMovieURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => testForFoundMovie(responseJson))
        .then(responseJson => displayResults(responseJson, movieDiv, scoreDiv, scores, title))
        .catch(err => {
            $('#js-error-message').append(`Something went wrong: ${err.message}<br>`);
        });
}

//test OMDb response for returned movie
function testForFoundMovie(responseJson) { 
    if (responseJson.Response == 'False') {
        $('form').append(`<p class='not-found'>${responseJson.Error}<br></p>`);
        $('section').addClass('hidden');
        $('form').removeClass('hidden');
    }
    else {
        showScoreButton();
        return responseJson;
    }    
}

//run functions that will build out display of movie details and scores
function displayResults(responseJson, movieDiv, scoreDiv, scores, title) {
    $('#js-error-message').empty(); 
    handleMovieDetails(responseJson, movieDiv);
    handleMoviesRatings(responseJson, scoreDiv);  
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
    return scores;
}

//add html for movies to be displayed
function handleMovieDetails(responseJson, movieDiv) {
    $(movieDiv).empty();
    
    $(movieDiv).append(
        `<h2 class='js-movie-title'>${responseJson.Title}</h2>
        <div class='js-movie-details'>
            <div class='js-movie-text'>
                <p class='js-movie-info'>${responseJson.Year} | ${responseJson.Rated} | ${responseJson.Runtime}.</p>
                <p class='js-movie-plot'>${responseJson.Plot}</p>
            </div>
            <div class='js-poster-container'>
                <img src='${responseJson.Poster}' class='js-movie-poster' alt='Movie Poster'>
            </div>
        </div>`
    );
}

//add html for scores display
function handleMoviesRatings(responseJson, scoreDiv) {
    $(scoreDiv).append(`<ul class='js-movie-rating hidden'></ul>`);

    if (responseJson.Ratings.length == 2) {
        $(scoreDiv + ' .js-movie-rating').append(
            `<li>${responseJson.Ratings[0].Value}</li>`
        );

        if (responseJson.Ratings[1].Source == 'Rotten Tomatoes') {
            $(scoreDiv + ' .js-movie-rating').append(
                `<li>${responseJson.Ratings[1].Value}</li>
                <li>N/A</li>`
            );
        }
        else {
            $(scoreDiv + ' .js-movie-rating').append(
                `<li>N/A</li>
                <li>${responseJson.Ratings[1].Value}</li>`
            );
        }
    }
    else if (responseJson.Ratings.length == 1) {
        $(scoreDiv + ' .js-movie-rating').append(
            `<li>${responseJson.Ratings[0].Value}</li>
            <li>N/A</li>
            <li>N/A</li>`
        );
    }
    else {
        for (let i = 0; i < responseJson.Ratings.length; i++) {
            $(scoreDiv + ' .js-movie-rating').append(
                `<li>${responseJson.Ratings[i].Value}</li>`
            );
        }
    }
}

//create the API string and call the TMDb API again using IMDbId
function runTmdbFindGet(omdbResponse, movieDiv) {
    const tmdbParamFind = {
        api_key: tmdbKey,
        language: 'en-US',
        external_source: 'imdb_id',
    }

    const tmdbFindURL = findURL + omdbResponse.imdbID + '?' + formatParams(tmdbParamFind);

    getUseImdbIdtoFindTmdbId(tmdbFindURL, movieDiv);
}

//make requests to TMDb API find endpoint
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

//create the API string and call the TMDb API for trailers
function runTmdbTrailerGet(responseJson, movieDiv) {
    const tmdbParamTrailer = {
        api_key: tmdbKey,
        language: 'en-US',
    }

    const tmdbTrailerURL = movieURL + responseJson.movie_results[0].id + '/videos?' + formatParams(tmdbParamTrailer);

    getUseTmdbIdtofindYoutubeId(tmdbTrailerURL, movieDiv);
}

//make request to TMDb API videos endpoint
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
            $('#js-error-message').append(`Something went wrong: ${err.message} at 252<br>`);
    });
}

//embed the movie trailers
function displayYoutubeById(responseJson, movieDiv) {        
    for(let i = 0; i < responseJson.results.length; i++) {
        if (responseJson.results[i].type == 'Trailer') {
            $(movieDiv).append(
                `<div class='js-trailer-container'>
                    <iframe class="js-movie-trailer" 
                    src="https://www.youtube.com/embed/${responseJson.results[i].key}"
                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen><iframe>
                </div>`
            );

           break;
        }
    }
}

function addTitleToScorecard(title1, title2) {
    $('#score-titles').removeClass('hidden')
    $('#score-titles').append(
        `<li class='champion-color'>${title1}</li>
        <li>VS.</li>
        <li class='contender-color'>${title2}</li>`
    );
}

//compare the array of scores and determine the winner
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
        else {}
    }

    if (winsMovie1 > winsMovie2) {
        $('#scorecard').append(`<h3>TKO! <span class='champion-color'>${title1}</span> Wins!</h3>`);
        $('#js-score-one').addClass('winner champion-color');
    }
    else if (winsMovie1 < winsMovie2) {
        $('#scorecard').append(`<h3>The New Champion Is <span class='contender-color'>${title2}</span>!</h3>`);
        $('#js-score-two').addClass('winner contender-color');
    }
    else {
        $('#scorecard').append("<h3>It's A Draw!</h3>")
    }
}

function showScoresList() {
    $('#scores').find('ul').removeClass('hidden');
    $('.js-movie-rating').addClass('js-movie-rating-flex');
    $('#scorecard').addClass('score-full-screen');
}

function showScoreButton() {
    $('#scorecard').removeClass('hidden');
    $('#scorecard').addClass('js-score-flex');
}

function hideScoreButton() {
    $('#score-button').addClass('hidden');
}

function showNavbar() {
    $('nav').removeClass('hidden');
    $('header h1').addClass('hidden');
    $('.tagline').addClass('hidden')
    handleNavRestart();
}

function hideResultsForm() {
    $('#results-form').addClass('hidden');
}

function changeBackgroundImage() {
    $('body').removeClass('gloves-background');
    $('body').addClass('cage-background');
}

function readyDisplay() {
    $('#movie-display').removeClass('hidden');
    $('.not-found').remove();
    $('#form-container').addClass('hidden');
    $('#results-form').removeClass('hidden');
}

function handleReadyButton() {
    $('#ready-button').on('click', event => {
        event.preventDefault();        
        runTmdbMovieDetailsGets();
        hideResultsForm();
        showNavbar();
        changeBackgroundImage();
    });
}

function handleScoreButton(){
    $('.score-button').on('click', function(event) {
        showScoresList();
        hideScoreButton();
        addTitleToScorecard(title1, title2)
        compareMovieRatings(movieScores1, movieScores2, title1, title2);
        handleRestartButton();
        window.scrollBy(0, 2000);
    });    
}

function handleRestartButton() {
    $('#scorecard').append("<div id='restart-button'><button class='restart-button' type='button'>Here Comes A New Challenger!</button></div>")
    $('.restart-button').on('click', function(event) {
        location.href = location.href
    });
}

function handleNavRestart() {
    $('#nav-restart').on('click', function(event) {
        location.reload();
    });
}

function handleSearchRestart() {
    $('#search-again').on('click', function(event) {
        location.reload();
    });
}

function handleScrollPastNav() {
    $('a.nav-scroll').on('click', function(event) {
        event.preventDefault(); 
        let target = $($(this).attr('href'));
        let scroll = $(target).offset().top - 80;
        $('body, html').animate({'scrollTop': scroll }, 50);
    });
}

function handleStartButton() {
    readyDisplay();
    const movie1 = $('#movie-one').val();
    const movie2 = $('#movie-two').val();
    runtmdbMovieSearchGets(movie1, movie2);
}

function watchForm() {
    handleScoreButton();
    handleScrollPastNav();
}

$(watchForm);