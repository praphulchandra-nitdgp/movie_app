document.addEventListener("DOMContentLoaded", function() {
    const navbarMenuBtn = document.querySelector('.navbar-menu-btn');
    const closeBtn = document.querySelector('.navbar-menu-close-btn');
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    navbarMenuBtn.addEventListener('click', function() {
        navbarMenuBtn.style.display = 'none';
        closeBtn.style.display = 'block';
        header.classList.add('active');
        nav.classList.add('active');
    });

    closeBtn.addEventListener('click', function() {
        closeBtn.style.display = 'none';
        navbarMenuBtn.style.display = 'block';
        header.classList.remove('active');
        nav.classList.remove('active');
    });

    // Initializing the existing page
    fetchPopularMovies()
        .then(displayPopularMovies)
        .catch(error => console.error('Error fetching and displaying popular movies:', error));
});



const searchForm = document.querySelector('.navbar-form');
const searchInput = document.querySelector('.navbar-form-search');
const searchResultsContainer = document.querySelector('.movies-grid');

function handleFormSubmit(event) {
    event.preventDefault();
    
    const query = searchInput.value.trim();

    if (query) {
        searchMovies(query)
        .then(movies => {
            // to clear the existing search results
            searchResultsContainer.innerHTML = '';

            // to display the search results directly into original container
            movies.forEach(movie => {
                const rating = movie.vote_average;
                const rating_round = Math.round(rating * 10) / 10;
                const movieHTML = `
                <a href="#overview1"><div class="movies-card" value="${movie.id}">
                    <div class="card-head">
                    <img src="https://image.tmdb.org/t/p/w1280/${movie.poster_path}" alt="${movie.title}" class="card-img">
                
                        <div class="card-overlay">
                            <div class="rating">
                                <i class="fa-solid fa-star"></i>
                                <span>${rating_round}</span>
                            </div>                        
                        </div>
                        <h3 class="card-title">${movie.title}</h3>
                    </div>
                </div></a>
                `;
                searchResultsContainer.insertAdjacentHTML('beforeend', movieHTML);
            });
        })
        .catch(error => console.error('Error searching movies:', error));
    }
}

searchForm.addEventListener('submit', handleFormSubmit);

const SearchAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const POP_APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280'; // W1280 size poster
    
// Function to fetch popular movies with poster images
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${POP_APIURL}`);
        const data = await response.json();
        const moviesWithImages = data.results.map(movie => ({
            ...movie,
            poster_path: `${IMAGE_BASE_URL}${movie.poster_path}` 
        }));
        return moviesWithImages;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
} 

// Function to display popular movies in the existing feed
function displayPopularMovies(movies) {

    searchResultsContainer.innerHTML = '';
    movies.forEach(movie => {
        const rating = movie.vote_average;
        const rating_round = Math.round(rating * 10) / 10;
        const movieHTML = `
        <a href="#overview1"><div class="movies-card" value="${movie.id}">
            <div class="card-head">
                <img src="https://image.tmdb.org/t/p/w1280/${movie.poster_path}" alt="${movie.title}" class="card-img">
                
                <div class="card-overlay">
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${rating_round}</span>
                    </div>                        
                </div>
                <h3 class="card-title">${movie.title}</h3>
            </div>
        </div></a>
        `;
        searchResultsContainer.insertAdjacentHTML('beforeend', movieHTML);
    });
}

// Function to search movies with poster images
async function searchMovies(query) {
    try {
        const response = await fetch(`${SearchAPI}${query}`);
        const data = await response.json();
        const moviesWithImages = data.results.map(movie => ({
            ...movie,
            poster_path: `${IMAGE_BASE_URL}${movie.poster_path}` 
        }));
        return moviesWithImages;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

//for genre
document.addEventListener("DOMContentLoaded", function() {
    const genreSelect = document.querySelector('.genre');

    genreSelect.addEventListener('change', function() {
        const selectedGenre = genreSelect.value;
        displayMoviesByGenre(selectedGenre);
    });
});
async function fetchMoviesByGenre(genre) {
    try {
        const apiKey = '04c35731a5ee918f014970082a0088b1'; 
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(`Error fetching movies for genre:`, error);
        return [];
    }
}


async function displayMoviesByGenre(genre) {
    const genres = await fetchMoviesByGenre(genre);
    const genreContainer = document.querySelector('.movies-grid');

    genreContainer.innerHTML = '';
    genres.results.forEach(movie => {
        const rating = movie.vote_average;
        const rating_round = Math.round(rating * 10) / 10;

        const movieHTML = `
        <a href="#overview1"><div class="movies-card" value="${movie.id}">
            <div class="card-head">
                <img src="https://image.tmdb.org/t/p/w1280/${movie.poster_path}" alt="${movie.title}" class="card-img">
                
                <div class="card-overlay">
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${rating_round}</span>
                    </div>                        
                </div>
                <h3 class="card-title">${movie.title}</h3>
            </div>
        </div></a>
        `;

        genreContainer.insertAdjacentHTML('beforeend', movieHTML);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    const moviesGrid = document.querySelector('.movies-grid');

    // Add event listener to movie card links
    

    moviesGrid.addEventListener('click', async function(event) {
        const clickedLink = event.target.closest('.movies-card');
        if (clickedLink) {
            const movieValue = clickedLink.getAttribute('value');

            try {
                await displayMovieById(movieValue);
            } catch (error) {
                console.error(`Error displaying movie:`, error);
            }
        }
    });
});

async function displayMovieById(movieValue) {
    try {
        const apiKey = '04c35731a5ee918f014970082a0088b1'; 
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieValue}?api_key=${apiKey}`;
        const response = await fetch(apiUrl);
        const movie = await response.json();

        // Check if the movie container is present
        const movieContainer = document.querySelector('.movie-card');
        if (movieContainer) {
            movieContainer.innerHTML = '';
            const rating = movie.vote_average;
            const rating_round = Math.round(rating * 10) / 10;
            const movieHTML = `
                    <div class= "card-image"><img src="https://image.tmdb.org/t/p/w1280/${movie.poster_path}" alt=""></div>
                    <div class="card-body">
                        <h2 class="title">${movie.title}</h2>
                        <div class="card-rating">
                            <i class="fa-solid fa-star"></i>
                            <span> ${rating_round}</span>
                        </div>
                        <p class="info"><span>Release Date: </span>${movie.release_date}</p>
                        <h1 class="overview-title">Overview: </h1>
                        <p class="card-description"><br>${movie.overview}</p>        
                    </div>
                
            `;
            movieContainer.insertAdjacentHTML('beforeend', movieHTML);
            
            document.querySelector('.card-container').style.display = 'flex';

        } 
        
    } catch (error) {
        console.error(`Error displaying movie:`, error);
    }
}
