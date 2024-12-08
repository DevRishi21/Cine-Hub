// Function to toggle visibility of User or Admin modules
function showModule(module) {
    document.getElementById('choice').style.display = 'none';
    if (module === 'user') {
        document.getElementById('userModule').style.display = 'block';
    } else if (module === 'admin') {
        document.getElementById('adminModule').style.display = 'block';
    }
}

// Function to show the password section
function showPasswordSection() {
    document.getElementById('choice').style.display = 'none';
    document.getElementById('passwordSection').style.display = 'block';
}

// Function to validate the admin password
function validatePassword() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('passwordError');

    if (password === '2104') {
        document.getElementById('passwordSection').style.display = 'none';
        showModule('admin'); // Show Admin module if password matches
    } else {
        errorDiv.textContent = 'Incorrect password. Please try again.';
    }
}

// Function to go back to the choice screen
function goBack() {
    document.getElementById('choice').style.display = 'block';
    document.getElementById('passwordSection').style.display = 'none';
    document.getElementById('userModule').style.display = 'none';
    document.getElementById('adminModule').style.display = 'none';
    document.getElementById('passwordError').textContent = ''; // Clear error message
}

const BASE_URL = "https://appsail-50023833533.development.catalystappsail.in";
// Fetch movie link (User functionality)
async function fetchMovie() {
    const movieName = document.getElementById('searchMovie').value;
    const response = await fetch(`${BASE_URL}/api/movie/${movieName}`);
    const movieLinkEl = document.getElementById('movieLink');

    if (response.ok) {
        const data = await response.json();
        movieLinkEl.innerHTML = `Movie Link: <a href="${data.link}" target="_blank">${data.link}</a>`;
    } else {
        const error = await response.json();
        movieLinkEl.textContent = error.error;
    }
}

// Add movie to the database (Admin functionality)
async function addMovie() {
    const movieName = document.getElementById('movieName').value;
    const movieLink = document.getElementById('movieLinkInput').value;
    const response = await fetch(`${BASE_URL}/api/admin/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_name: movieName, movie_link: movieLink }),
    });

    const adminMessageEl = document.getElementById('adminMessage');

    if (response.ok) {
        adminMessageEl.textContent = 'Movie added successfully!';
    } else {
        const error = await response.json();
        adminMessageEl.textContent = error.error;
    }
}

// Function to check the database size
async function checkThreshold() {
    const dbSizeEl = document.getElementById('dbSize');
    const errorEl = document.getElementById('errorThreshold');  // New element to show error

    // Clear any previous error message
    errorEl.textContent = '';

    try {
        const response = await fetch(`${BASE_URL}/api/db/size`);
        if (response.ok) {
            const data = await response.json();
            dbSizeEl.textContent = `Current Database Size: ${data.size} MB`;

            if (data.thresholdExceeds) {
                // Show error if threshold exceeds
                errorEl.textContent = 'Error: Database size has exceeded the threshold of 9 MB.';
                errorEl.style.color = 'red';
            }
        } else {
            dbSizeEl.textContent = 'Failed to fetch database size.';
        }
    } catch (error) {
        dbSizeEl.textContent = 'Error fetching database size.';
    }
}

// Function to fetch available movies
async function fetchAvailableMovies() {
    const moviesListEl = document.getElementById('moviesList');

    // Clear the movie list before fetching
    moviesListEl.innerHTML = '';

    try {
        const response = await fetch(`${BASE_URL}/api/movies`);
        if (response.ok) {
            const data = await response.json();
            if (data.movies.length > 0) {
                data.movies.forEach(movie => {
                    const listItem = document.createElement('li');
                    listItem.textContent = movie;  // Display movie name
                    moviesListEl.appendChild(listItem);
                });
            } else {
                moviesListEl.innerHTML = '<li>No movies available.</li>';
            }
        } else {
            moviesListEl.innerHTML = '<li>Failed to fetch movies.</li>';
        }
    } catch (error) {
        moviesListEl.innerHTML = '<li>Error fetching movies.</li>';
    }
}
