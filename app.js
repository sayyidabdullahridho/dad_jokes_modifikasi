document.addEventListener("DOMContentLoaded", () => {
    const jokeText = document.getElementById("jokeText");
    const newJokeButton = document.getElementById("newJokeButton");
    const saveJokeButton = document.getElementById("saveJokeButton");
    const copyJokeButton = document.getElementById("copyJokeButton");
    const viewSavedJokesButton = document.getElementById("viewSavedJokesButton");
    const refreshButton = document.getElementById("refreshButton"); // Refresh button
    const categorySelect = document.getElementById("categorySelect");
    const toggleModeButton = document.getElementById("toggleModeButton");
    const savedJokesList = document.getElementById("savedJokesList");

    let currentJoke = ""; // Initialize current joke

    function displayLoading() {
        jokeText.textContent = "Loading...";
    }

    async function fetchJoke(category) {
        let url = "https://icanhazdadjoke.com/"; // Default for general jokes
        if (category === "programming") {
            url = "https://v2.jokeapi.dev/joke/Programming?type=single"; // API for programming jokes
        }

        try {
            const response = await fetch(url, { headers: { Accept: "application/json" } });
            const data = await response.json();

            if (category === "programming") {
                if (data.joke) {
                    return data.joke;
                } else {
                    return "No programming jokes available.";
                }
            } else {
                return data.joke;
            }
        } catch (error) {
            console.error("Failed to fetch joke:", error);
            return "Oops! Couldn't load a joke. Try again later.";
        }
    }

    async function displayJoke() {
        displayLoading();
        const category = categorySelect.value;
        const joke = await fetchJoke(category);
        jokeText.textContent = joke;
        currentJoke = joke;
        
        saveJokeButton.disabled = false;
        copyJokeButton.disabled = false;
    }

    function saveJoke() {
        if (currentJoke === "") {
            alert("No joke to save.");
            return;
        }

        const savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];
        savedJokes.push(currentJoke);
        localStorage.setItem("savedJokes", JSON.stringify(savedJokes));
        alert("Joke saved!");
    }

    function copyJoke() {
        if (currentJoke === "") {
            alert("No joke to copy.");
            return;
        }
        navigator.clipboard.writeText(currentJoke).then(() => {
            alert("Joke copied to clipboard!");
        });
    }

    function viewSavedJokes() {
        const savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];
        if (savedJokes.length === 0) {
            alert("No saved jokes.");
        } else {
            savedJokesList.innerHTML = ''; // Clear previous list
            savedJokes.forEach((joke, index) => {
                const li = document.createElement("li");
                li.textContent = joke;
                
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-joke");
                deleteButton.addEventListener("click", () => deleteJoke(index));
                
                li.appendChild(deleteButton);
                savedJokesList.appendChild(li);
            });

            document.getElementById("savedJokesContainer").style.display = "block";
        }
    }

    function deleteJoke(index) {
        const savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];
        savedJokes.splice(index, 1); // Remove the joke at the given index
        localStorage.setItem("savedJokes", JSON.stringify(savedJokes)); // Save updated list
        viewSavedJokes(); // Re-render saved jokes
    }

    function toggleMode() {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDark);

        if (isDark) {
            toggleModeButton.textContent = "🌙";
        } else {
            toggleModeButton.textContent = "☀️";
        }
    }

    function refreshPage() {
        // Refresh the joke and clear the saved jokes view
        displayJoke();
        document.getElementById("savedJokesContainer").style.display = "none"; // Hide saved jokes
    }

    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        toggleModeButton.textContent = "🌙";
    } else {
        toggleModeButton.textContent = "☀️";
    }

    newJokeButton.addEventListener("click", displayJoke);
    saveJokeButton.addEventListener("click", saveJoke);
    copyJokeButton.addEventListener("click", copyJoke);
    viewSavedJokesButton.addEventListener("click", viewSavedJokes);
    toggleModeButton.addEventListener("click", toggleMode);
    refreshButton.addEventListener("click", refreshPage); // Event listener for refresh button

    displayJoke();
});
