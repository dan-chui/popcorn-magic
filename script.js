var API_KEY = config.MY_API;

const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=' +
  API_KEY;

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + '&query="';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const redseatsEl = document.getElementById('redseats');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

// Get initial movies
async function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add('disabled');
          next.classList.remove('disabled');
        } else if (currentPage >= totalPages) {
          prev.classList.remove('disabled');
          next.classList.add('disabled');
        } else {
          prev.classList.remove('disabled');
          next.classList.remove('disabled');
        }

        redseatsEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
}

getMovies(API_URL);

function showMovies(movies) {
  main.innerHTML = '';

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const rounded = Math.round(vote_average * 10) / 10;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(rounded)}">${rounded}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
        `;
    main.appendChild(movieEl);
  });
}

// Movie rating
function getClassByRate(vote) {
  if (vote >= 7.5) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

// Submit function
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== '') {
    getMovies(SEARCH_API + searchTerm);

    search.value = '';
    closeNav();
  } else {
    window.location.reload();
    closeNav();
  }
});

// Pagination
prev.addEventListener('click', () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener('click', () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

// Query function
function pageCall(page) {
  let urlSplit = lastUrl.split('?');
  let queryPar = urlSplit[1].split('&');
  let address = queryPar[queryPar.length - 1].split('=');
  if (address[0] != 'page') {
    let url = lastUrl + '&page=' + page;
    getMovies(url);
  } else {
    address[1] = page.toString();
    let firstPart = address.join('=');
    queryPar[queryPar.length - 1] = firstPart;
    let secondPart = queryPar.join('&');
    let url = urlSplit[0] + '?' + secondPart;
    getMovies(url);
  }
}

// Open the sidenav
function openNav() {
  document.getElementById('mySidenav').style.width = '100%';
}

// Close/hide the sidenav
function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}
