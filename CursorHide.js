// Select the element you want to fade
const element = document.getElementById("Cursor");

// starting opacity
element.style.opacity = 0;

// Function to fade out the element
function fadeOut() {
    let opacity = 1;
    const fadeEffect = setInterval(function () {
        if (!element.style.opacity) {
            element.style.opacity = opacity;
        }
        if (opacity > 0) {
            opacity -= 0.1; // Adjust the decrement value for speed
            element.style.opacity = opacity;
        } else {
            clearInterval(fadeEffect);
        }
    }, 25); // Adjust the interval for smoothness
}

// Function to fade in the element
function fadeIn() {
    let opacity = 0;
    const fadeEffect = setInterval(function () {
        if (!element.style.opacity) {
            element.style.opacity = opacity;
        }
        if (opacity < 1) {
            opacity += 0.1; // Adjust the increment value for speed
            element.style.opacity = opacity;
        } else {
            clearInterval(fadeEffect);
        }
    }, 25); // Adjust the interval for smoothness
}

// Event listener for mouse leaving the page
document.addEventListener("mouseleave", function () {
    fadeOut();
});

// Event listener for mouse entering the page
document.addEventListener("mouseenter", function () {
    fadeIn();
});
