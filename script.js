'Use Strict';

const omdbKey = 'ca762609';
const omdbURL = 'http://www.omdbapi.com/?';


function formatParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getMovie(movie1) {
    const params = {
        apikey: omdbKey,
        t: movie1,
    };

    const searchString = formatParams(params);
    const SearchMovie1URL = omdbURL + searchString;

    console.log(SearchMovie1URL);

    fetch(SearchMovie1URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
} 

function displayResults(responseJson) {
    console.log(responseJson);
    
    $('#js-movie-one').append(
        `<h2 class='js-movie-title'>${responseJson.Title}</h2>
        <p>${responseJson.Year}</p>
        <img src='${responseJson.Poster}' class='js-movie-poster' alt='Movie Poster'>
        <ul class='js-movie-rating'>
        <li>${responseJson.Ratings[0].Source}: ${responseJson.Ratings[0].Value}</li>
        <li>${responseJson.Ratings[1].Source}: ${responseJson.Ratings[1].Value}</li>
        <li>${responseJson.Ratings[2].Source}: ${responseJson.Ratings[2].Value}</li>
        </ul>`
    );
}


function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        console.log('Ran watchForm');
        const movie1 = $('#movie-one').val();
        const movie2 = $('#movie-two').val();
        console.log(movie1, movie2);
        getMovie(movie1);
    });
}


$(watchForm);