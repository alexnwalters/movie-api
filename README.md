# Box Office Brawl - Movie API Project
---
Allows users to compare the ratings of two movies based on their Internet Movie Database (IMDb), Rotten Tomatoes, and Metacritic Scores.

**Live Demo:** [Box Office Brawl](https://alexnwalters.github.io/movie-api/)

### Concept
---
The inspiration for this project came about over a debate between and a friend and myself over which of two movies was better and therefore worth watching.  Instead of us needing to go to several popular movie sites and searching for each movie at each site, the idea was to bring several rating systems into one quick view. After displaying some general information about the two films, including *plot, rating, poster and trailer*, the app would reveal the winner based on which movie has the higher score for each of the three movie sites: *IMDb, Rotten Tomatoes, and Metacritic*.  The app makes use of both The Movie Database (TMDb) API and the Open Movie Database (OMDb) API.

### Usage
---
Right from the main page, the user will be able to first input two movies to search for.  I added the search feature midway through my design after one user pointed out that many movies have remakes or the same title as a completely different film.  Here is where we make our first API call using the query parameter available through TMDb API.

![Search Screen](https://github.com/alexnwalters/movie-api/blob/master/images/movie-api-search.png "Search Form")

Once the user submits the search inputs if the movies return any search results they will be selectable in a select input dropdown.  If no results are found the user will be alerted to which movie input return 0 results and the app will reload to the search form. If the user agrees if the returned results they can elect to move on the display screen or start over.  This confirmation step allowed us to confirm the movie the user would like to compare and pull its IMDb Id, this Id is used by both TMDb API and the OMDb API.

![Search Results Screen](https://github.com/alexnwalters/movie-api/blob/master/images/movie-api-select.png "Results Form")

At this point the two movies will be displayed, allowing the user to compare their movie posters, audience rating, runtime, plot and even an embedded movie trailer if available. The OMDb API returns better information for the movies and is used first, but the TMDb API has a trailer search feature, so we then go back to that to pull the youtube video id to be displayed.

![Display Screen](https://github.com/alexnwalters/movie-api/blob/master/images/movie-api-info.png "Display")

Once the user is satisfied with reviewing the movie's description they can reveal the scorecard and display winning results.  The winning movies’ scores will be revealed larger and the winner will be announced at the bottom of the scorecard.  At this point, the user can continue to review the information or choose to start another comparison. The OMDd API has the scores from each available site for most movies so it is where we pull the scores from.

![Scorecard](https://github.com/alexnwalters/movie-api/blob/master/images/movie-api-scorecard.png "Scorecard")

### Future Additions
---
Although this was just a project to test using APIs, there are more potential features for this application.  Some of the user feedback I received when testing the app was a request for the users to be able to give a rating.  A feature for the future could include user logins and the ability for Box Office Brawl users ratings to be collected and even compared.

### Tools
---
- HTML
- CSS
- Javascript
- JQuery

### Thanks
---
The Movie Database
The Open Movie Database
