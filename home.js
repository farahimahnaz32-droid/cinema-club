// accessing my html data
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("movie-search");
const movieBox = document.querySelector(".movie-box");
const sortMovies = document.getElementById("sortMovies");
const filterTabs = document.querySelector(".filter-tabs");
const sideBarTags = document.querySelector(".tags");

if (!themeToggle || !searchInput || !movieBox || !sortMovies || !filterTabs) {
  console.error("CineTrack is missing a required HTML element.");
} else {
  //THEME

  const resultCount = document.getElementById("resultCount");
  const themeIcon = themeToggle.querySelector("i");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cinetrack-theme", theme);

    const isLight = theme === "light";

    themeIcon.className = `fa-solid ${isLight ? "fa-moon" : "fa-sun"}`;
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  const savedTheme = localStorage.getItem("cinetrack-theme") || "dark";
  setTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  //MOVIE DATA

  // Read the movie cards already in your HTML and turn them into objects.
  function getMoviesFromHTML() {
    const cards = movieBox.querySelectorAll(".movie-card");

    return Array.from(cards).map((card, index) => {
      const detailItems = card.querySelectorAll(".details span");
      const ratingText = detailItems[2]?.textContent || "0";
      const ratingMatch = ratingText.match(/[\d.]+/);

      return {
        id: Date.now() + index,
        title: card.querySelector(".movie-info h3")?.textContent.trim() || "Untitled",
        year: detailItems[0]?.textContent.trim() || "",
        genre: detailItems[1]?.textContent.trim() || "Unknown",
        rating: ratingMatch ? Number(ratingMatch[0]) : 0,
        poster: card.querySelector(".poster-wrap img")?.getAttribute("src") || "",
        watched: false,
        favorite: false,
        review: "",
        createdAt: Date.now() + index,
      };
    });
  }

  // Try to load saved movie objects from this browser.
  let movies;

  try {
    const savedMovies = localStorage.getItem("cinetrack-movies");

    // If there is saved data, parse it. Otherwise, read the starter cards.
    movies = savedMovies ? JSON.parse(savedMovies) : getMoviesFromHTML();

    // If the saved value is not an array, start from the HTML cards.
    if (!Array.isArray(movies)) {
      movies = getMoviesFromHTML();
    }
  } catch (error) {
    console.error("Could not read saved movies:", error);
    movies = getMoviesFromHTML();
  }

  let currentFilter = "all";
  let currentGenre = "all";
  let searchText = "";

  function saveMovies() {
    localStorage.setItem("cinetrack-movies", JSON.stringify(movies));
  }

  // Add the first set of HTML movies to browser storage.
  if (!localStorage.getItem("cinetrack-movies")) {
    saveMovies();
  }

  //ADD MOVIE BUTTON

  const addMovieButton = document.createElement("button");
  addMovieButton.id = "addMovieButton";
  addMovieButton.type = "button";
  addMovieButton.className = "filter-button active";
  addMovieButton.textContent = "+ Add a movie";
  filterTabs.insertAdjacentElement("afterend", addMovieButton);

  // Ask for movie details and add a new movie object.
  addMovieButton.addEventListener("click", () => {
    const title = prompt("Movie title:");
    if (title === null || title.trim() === "") {
      alert("Please enter a movie title.");
      return;
    }

    const year = prompt("Release year:");
    const genre = prompt("Genre:");
    const ratingText = prompt("Your rating from 1 to 10:");
    const rating = Number(ratingText);

    if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
      alert("Rating must be a number from 1 to 10.");
      return;
    }

    const poster = prompt("Poster path, for example ./images/dune.jpg:");
    if (poster === null || poster.trim() === "") {
      alert("Please enter the path to a poster image.");
      return;
    }

    movies.push({
      id: Date.now(),
      title: title.trim(),
      year: year ? year.trim() : "",
      genre: genre ? genre.trim() : "Unknown",
      rating,
      poster: poster.trim(),
      watched: false,
      favorite: false,
      review: "",
      createdAt: Date.now(),
    });

    saveMovies();
    renderMovies();
  });

  //DISPLAY MOVIES

  // Escape text before inserting it into HTML.
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };

      return replacements[character];
    });
  }

  function renderMovies() {
    // Start with movies that match the selected filter tab.
    let visibleMovies = movies.filter((movie) => {
      if (currentFilter === "to-watch") return !movie.watched;
      if (currentFilter === "watched") return movie.watched;
      if (currentFilter === "favorites") return movie.favorite;
      return true;
    });

    // Filter by the genre chosen in the sidebar.
    if (currentGenre !== "all") {
      const wantedGenres = currentGenre.split(",");

      visibleMovies = visibleMovies.filter((movie) => {
        const movieGenre = String(movie.genre).toLowerCase();
        return wantedGenres.some((genre) => movieGenre.includes(genre));
      });
    }

    // Searching title, genre, year, and review.
    visibleMovies = visibleMovies.filter((movie) => {
      const searchableText =
        `${movie.title} ${movie.genre} ${movie.year} ${movie.review}`.toLowerCase();

      return searchableText.includes(searchText);
    });

    // Sorting the matching movies.
    if (sortMovies.value === "rating") {
      visibleMovies.sort((a, b) => b.rating - a.rating);
    } else if (sortMovies.value === "title") {
      visibleMovies.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      visibleMovies.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Showing a message when no movies match.
    if (visibleMovies.length === 0) {
      movieBox.innerHTML = `<p class="empty-message">No movies found.</p>`;
    } else {
      // Creating one card for each movie object.
      movieBox.innerHTML = visibleMovies
        .map((movie) => {
          const safeTitle = escapeHTML(movie.title);
          const safeYear = escapeHTML(movie.year);
          const safeGenre = escapeHTML(movie.genre);
          const safePoster = escapeHTML(movie.poster);
          const safeReview = escapeHTML(movie.review || "No review yet.");

          return `
            <article class="movie-card">
              <div class="poster-wrap">
                <img src="${safePoster}" alt="${safeTitle} poster">

                <button
                  class="favorite-button ${movie.favorite ? "is-favorite" : ""}"
                  data-action="favorite"
                  data-id="${movie.id}"
                  type="button"
                  aria-label="${movie.favorite ? "Remove from" : "Add to"} favorites"
                >
                  <i class="${movie.favorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>
              </div>

              <div class="movie-info">
                <h3>${safeTitle}</h3>

                <div class="details">
                  <span>${safeYear}</span>
                  <span>${safeGenre}</span>
                  <span class="rating">★ ${movie.rating}/10</span>
                </div>

                <p class="movie-status">
                  ${movie.watched ? "Watched" : "To watch"}
                </p>

                <p class="movie-review">${safeReview}</p>

                <div class="movie-actions">
                  <button
                    class="watched-button"
                    data-action="watched"
                    data-id="${movie.id}"
                    type="button"
                  >
                    ${movie.watched ? "Move to To Watch" : "Mark Watched"}
                  </button>

                  <button
                    class="review-button"
                    data-action="review"
                    data-id="${movie.id}"
                    type="button"
                  >
                    Add / Edit Review
                  </button>

                  <button
                    class="remove-button"
                    data-action="remove"
                    data-id="${movie.id}"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    }

    // Show how many movies matched.
    if (resultCount) {
      resultCount.textContent =
        `${visibleMovies.length} ${visibleMovies.length === 1 ? "movie" : "movies"} found`;
    }

    updateStats();
  }

  //COUNTS

  function updateStats() {
    const watchedCount = movies.filter((movie) => movie.watched).length;
    const favoriteCount = movies.filter((movie) => movie.favorite).length;

    document.getElementById("totalCount").textContent = movies.length;
    document.getElementById("watchedCount").textContent = watchedCount;
    document.getElementById("favoriteCount").textContent = favoriteCount;
  }

  //SEARCH, FILTER, AND SORT

  searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim().toLowerCase();
    renderMovies();
  });

  sortMovies.addEventListener("change", renderMovies);

  filterTabs.addEventListener("click", (event) => {
    const clickedButton = event.target.closest("[data-filter]");

    if (!clickedButton) return;

    currentFilter = clickedButton.dataset.filter;

    document.querySelectorAll(".filter-button[data-filter]").forEach((button) => {
      button.classList.remove("active");
    });

    clickedButton.classList.add("active");
    renderMovies();
  });

  //SIDEBAR GENRES
  if (sideBarTags) {
    sideBarTags.addEventListener("click", (event) => {
      const clickedLink = event.target.closest("[data-genre]");

      if (!clickedLink) return;

      // Stop the link from jumping to the top of the page.
      event.preventDefault();

      currentGenre = clickedLink.dataset.genre;

      sideBarTags.querySelectorAll(".tag1").forEach((link) => {
        link.classList.remove("active");
      });

      clickedLink.classList.add("active");
      renderMovies();
    });
  }

  //MOVIE CARD BUTTONS

  // One listener handles buttons on all cards, including newly added ones.
  movieBox.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const movieId = Number(button.dataset.id);
    const movie = movies.find((item) => item.id === movieId);

    if (!movie) return;

    if (button.dataset.action === "favorite") {
      movie.favorite = !movie.favorite;
    }

    if (button.dataset.action === "watched") {
      movie.watched = !movie.watched;
    }

    if (button.dataset.action === "review") {
      const review = prompt("Write your review:", movie.review);

      if (review !== null) {
        movie.review = review.trim();
      }
    }

    if (button.dataset.action === "remove") {
      const shouldRemove = confirm(`Remove "${movie.title}" from your list?`);

      if (shouldRemove) {
        movies = movies.filter((item) => item.id !== movieId);
      }
    }

    saveMovies();
    renderMovies();
  });

  // Drawing the page using the movie data when the app opens.
  renderMovies();
}