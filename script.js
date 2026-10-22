
const movies = [
    {
        id: 1,
        title: "Interstellar",
        genre: "Sci-Fi",
        year: 2014,
        rating: 8.7,
        description: "A journey beyond the stars.",
        symbol: "INTERSTELLAR"
    },
    {
        id: 2,
        title: "The Dark Knight",
        genre: "Action",
        year: 2008,
        rating: 9.0,
        description: "A city needs a hero.",
        symbol: "DARK KNIGHT"
    },
    {
        id: 3,
        title: "Inception",
        genre: "Sci-Fi",
        year: 2010,
        rating: 8.8,
        description: "Dreams within dreams.",
        symbol: "INCEPTION"
    },
    {
        id: 4,
        title: "The Pursuit of Happyness",
        genre: "Drama",
        year: 2006,
        rating: 8.0,
        description: "Never stop believing.",
        symbol: "HAPPYNES"
    },
    {
        id: 5,
        title: "Joker",
        genre: "Thriller",
        year: 2019,
        rating: 8.3,
        description: "A different kind of story.",
        symbol: "JOKER"
    },
    {
        id: 6,
        title: "Spider-Man: Into the Spider-Verse",
        genre: "Animation",
        year: 2018,
        rating: 8.4,
        description: "More than one can wear the mask.",
        symbol: "SPIDER-VERSE"
    },
    {
        id: 7,
        title: "Avengers: Endgame",
        genre: "Action",
        year: 2019,
        rating: 8.4,
        description: "One final battle.",
        symbol: "ENDGAME"
    },
    {
        id: 8,
        title: "The Martian",
        genre: "Sci-Fi",
        year: 2015,
        rating: 8.0,
        description: "Survival against the odds.",
        symbol: "THE MARTIAN"
    },
    {
        id: 9,
        title: "Coco",
        genre: "Animation",
        year: 2017,
        rating: 8.4,
        description: "A story about family and music.",
        symbol: "COCO"
    }
];

const movieGrid = document.getElementById("movie-grid");
const watchlistGrid = document.getElementById("watchlist-grid");

const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");

const movieCount = document.getElementById("movie-count");
const watchlistCount = document.getElementById("watchlist-count");

const emptyMessage = document.getElementById("empty-message");
const watchlistEmpty = document.getElementById("watchlist-empty");

let watchlist = [];

try {
    const savedWatchlist = JSON.parse(
        localStorage.getItem("cinescope-watchlist")
    );

    if (Array.isArray(savedWatchlist)) {
        watchlist = [
            ...new Set(
                savedWatchlist.filter(
                    id => Number.isInteger(id) &&
                    movies.some(movie => movie.id === id)
                )
            )
        ];
    }
} catch {
    watchlist = [];
}

function saveWatchlist() {
    try {
        localStorage.setItem(
            "cinescope-watchlist",
            JSON.stringify(watchlist)
        );

        return true;
    } catch {
        alert("Unable to save your watchlist in this browser.");
        return false;
    }
}

function createMovieCard(movie) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const poster = document.createElement("div");
    poster.className = "poster";

    const posterTitle = document.createElement("span");
    posterTitle.textContent = movie.symbol;

    const posterLabel = document.createElement("small");
    posterLabel.textContent = "CINESCOPE ORIGINAL COLLECTION";

    poster.append(posterTitle, posterLabel);

    const info = document.createElement("div");
    info.className = "movie-info";

    const meta = document.createElement("div");
    meta.className = "movie-meta";

    const genre = document.createElement("span");
    genre.textContent = `${movie.genre} · ${movie.year}`;

    const rating = document.createElement("span");
    rating.className = "rating";
    rating.textContent = `★ ${movie.rating}`;

    meta.append(genre, rating);

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const description = document.createElement("p");
    description.textContent = movie.description;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "watch-btn";

    const isSaved = watchlist.includes(movie.id);

    button.classList.toggle("saved", isSaved);
    button.textContent = isSaved
        ? "♥ Saved to watchlist"
        : "+ Add to watchlist";

    button.addEventListener("click", () => {
        const previousWatchlist = [...watchlist];

        if (watchlist.includes(movie.id)) {
            watchlist = watchlist.filter(id => id !== movie.id);
        } else {
            watchlist.push(movie.id);
        }

        if (!saveWatchlist()) {
            watchlist = previousWatchlist;
            return;
        }

        renderMovies();
        renderWatchlist();
    });

    info.append(meta, title, description, button);
    card.append(poster, info);

    return card;
}

function renderMovies() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedGenre = genreFilter.value;

    const filteredMovies = movies.filter(movie => {
        const matchesSearch =
            movie.title.toLowerCase().includes(searchTerm);

        const matchesGenre =
            selectedGenre === "All" ||
            movie.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    movieGrid.replaceChildren();

    filteredMovies.forEach(movie => {
        movieGrid.appendChild(createMovieCard(movie));
    });

    movieCount.textContent =
        `${filteredMovies.length} ${
            filteredMovies.length === 1 ? "movie" : "movies"
        }`;

    emptyMessage.hidden = filteredMovies.length !== 0;
}

function renderWatchlist() {
    watchlistGrid.replaceChildren();

    const savedMovies = movies.filter(movie =>
        watchlist.includes(movie.id)
    );

    savedMovies.forEach(movie => {
        watchlistGrid.appendChild(createMovieCard(movie));
    });

    watchlistCount.textContent =
        `${savedMovies.length} saved`;

    watchlistEmpty.hidden = savedMovies.length !== 0;
}

searchInput.addEventListener("input", renderMovies);

genreFilter.addEventListener("change", renderMovies);

renderMovies();
renderWatchlist();
