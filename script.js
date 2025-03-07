const quoteText = document.getElementById("quote-text");
const authorName = document.getElementById("author-name");
const textInput = document.getElementById("text-input");
const searchBtn = document.getElementById("search-btn");
const result = document.getElementById("result");
const resultHeading = document.getElementById("result-heading");
const resultMessage = document.getElementById("result-message");
const header = document.getElementById("header-section"); 
const loading = document.getElementById("loading");
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
const exit = document.getElementById("exit");
const recipeDetailheading = document.getElementById("Recipe-Detail-heading");
const modal = document.getElementById("recipeModal");
const recipeDetail = document.getElementById("Recipe-Detail");

const quotes = [
    {
        quote: "Dinner was made for eating, not for talking.",
        author: "Winston Churchill"
    },
    {
        quote: "Food is symbolic of love when words are inadequate.",
        author: "Alan D. Wolfelt"
    },
    {
        quote: "People who love to eat are always the best people.",
        author: "Julia Child"
    },
    {
        quote: "Cooking is an art, but all art requires knowing something about the techniques and materials.",
        author: "Nathan Myhrvold"
    },
    {
        quote: "Laughter is brightest where food is best.",
        author: "Irish Proverb"
    },
    {
        quote: "Good food is the foundation of genuine happiness.",
        author: "Auguste Escoffier"
    },
    {
        quote: "You don’t need a silver fork to eat good food.",
        author: "Paul Prudhomme"
    },
    {
        quote: "There is no sincere love than the love of food.",
        author: "George Bernard Shaw"
    },
    {
        quote: "Life is uncertain. Eat dessert first.",
        author: "Ernestine Ulmer"
    },
    {
        quote: "The secret ingredient is always love.",
        author: "Unknown"
    }
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex]; 
}
function displayQuote() {
    const randomQuote = getRandomQuote();
    quoteText.textContent = `${randomQuote.quote}`;
    authorName.textContent = `${randomQuote.author}`;
}
displayQuote();

async function checkUserInput() {
    result.innerHTML = ""; // Clear previous meals
    resultMessage.innerHTML = ""; // Clear error messages
    resultHeading.innerHTML = ""; // Clear previous heading
    loading.style.display = "flex";

    const query = textInput.value.trim().toLowerCase();
    if (!query) {
        resultMessage.innerHTML = `<p class="error-message">Please enter an ingredient 🥗...</p>`;
        loading.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
        const data = await response.json();
        loading.style.display = "none";

        if (!data.meals) {
            resultMessage.innerHTML = `<p class="error-message">We're sorry, but ${query} is a little too elusive for our recipe database. Looks like we'll need to call in some culinary reinforcements!</p>`;
            return;
        }

        // Show the heading only when meals are found
        resultHeading.innerHTML = `Recipes found for ${query}`;

        // Loop through and display meals
        data.meals.forEach(meal => {
            const mealDiv = document.createElement("div");
            mealDiv.classList.add("meal-item");

            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <button class="btn" data-id="${meal.idMeal}">Recipe Details 🍲</button>
            `;

            result.appendChild(mealDiv);
            const recipeBtn = mealDiv.querySelector(".btn");
            recipeBtn.addEventListener("click", () => {
                showRecipeDetails(meal.idMeal);
            });
        });

    } catch (error) {
        console.error("Error fetching meals:", error);
        resultMessage.innerHTML = `<p class="error-message">Something went wrong. Please try again later.</p>`;
        loading.style.display = "none";
    }

    textInput.value = "";
}

searchBtn.addEventListener("click", checkUserInput);

async function showRecipeDetails(mealId) {
    modal.style.display = "flex";

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();

        if (data.meals) {
            const meal = data.meals[0];

            recipeDetailheading.innerHTML = `${meal.strMeal} 🥘`;
            recipeDetail.innerHTML = `${meal.strInstructions}`;

            if (meal.strYoutube) {
                const videoId = meal.strYoutube.split("v=")[1]; // Extract video ID from URL
                document.getElementById("recipe-video").src = `https://www.youtube.com/embed/${videoId}`;
            } else {
                document.getElementById("recipe-video").style.display = "none"; // Hide if no video
            }    
        }
    } catch (error) {
        console.error("Error fetching meal details:", error);
        recipeDetail.innerHTML = `<p class="error-message">Something went wrong. Please try again later.</p>`;
    }
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Close modal on clicking exit button
if (exit) {
    exit.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// Ensure "Enter" key works for searching
textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkUserInput();
    }
});

  //shrinks header when scrolled up by 50px
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) { 
        header.style.padding = "8px 45px"; // Reduce padding
        header.style.transition = "0.3s ease-in-out"; // Smooth transition
    } else {
        header.style.padding = "15px 45px"; // Reset padding
    }
    });

    //stars moving the background
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let stars = [];

        // Create stars
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.2
            });
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
                star.y += star.speed;
                if (star.y > canvas.height) star.y = 0;
            });

            requestAnimationFrame(drawStars);
        }

        drawStars();




    



