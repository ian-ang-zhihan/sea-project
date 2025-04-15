/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

let allVerses = [];
let translations = ["RCV", "ESV", "NIV"];
let themes = ["All", "Faith", "Hope", "Anxiety", "Peace", "Love"];

console.log(fetch("bible_verses.json"));

fetch("bible_verses.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    allVerses = data;
    console.log("inside fetch =", allVerses);
    renderVerses(allVerses);
  })
  
console.log("outside fetch =", allVerses);
  
function renderVerses(verses, selectedTranslation = "RCV") {
  const container = document.getElementById("verse-container");
  container.innerHTML = ""; // Clear out old content

  verses.forEach((verse) => {
    // console.log("verse = ", verse.translations.RCV);

    const card = document.createElement("div");
    card.className = "verse-card";

    const theme = document.createElement("h3");
    theme.textContent = verse.theme;

    const reference = document.createElement("p");
    reference.textContent = verse.reference;

    const verseText = document.createElement("p");
    verseText.textContent = verse.translations[selectedTranslation];

    // Dropdown for translations
    const translationsDropdown = document.createElement("select");
    translationsDropdown.className = "translation-select";

    translations.forEach((translation) => {
      const option = document.createElement("option");
      option.value = translation;
      option.text = translation;
      if (translation === selectedTranslation) {
        option.selected = true;
      }
      translationsDropdown.appendChild(option);
    });

    // When different translation is selected, update verse text
    translationsDropdown.addEventListener("change", (event) => {
      const translationToDisplay = event.target.value;
      verseText.textContent = verse.translations[translationToDisplay];
    });

    // const rcv = document.createElement("p");
    // rcv.innerHTML = `<strong>RCV:</strong> ${verse.translations.RCV}`;

    // const niv = document.createElement("p");
    // niv.innerHTML = `<strong>NIV:</strong> ${verse.translations.NIV}`;

    // const esv = document.createElement("p");
    // esv.innerHTML = `<strong>ESV:</strong> ${verse.translations.ESV}`;
    
    // Add elements to card
    card.appendChild(theme);
    card.appendChild(reference);
    card.appendChild(verseText);
    card.appendChild(translationsDropdown);
    // card.appendChild(rcv);
    // card.appendChild(niv);
    // card.appendChild(esv);

    // Add card to page
    container.appendChild(card);
  });
}

// Create dynamic dropdown to filter by theme
function createThemeFilter() {
  const themeFilter = document.getElementById("themeFilter");

  themeFilter.innerHTML = "";

  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeFilter.appendChild(option);
  });
  
  themeFilter.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    
    const filteredVerses = selectedTheme === "All" ? allVerses : allVerses.filter((verse) => verse.theme === selectedTheme);
    
    // Re-render the verses using the filtered array
    renderVerses(filteredVerses);
  });
}

function addNewVerse() {
  const form = document.getElementById("addVerseForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Stop page from refreshing

    const newTheme = document.getElementById("newTheme").value;
    const newReference = document.getElementById("newReference").value;
    const newRCV = document.getElementById("newRCV").value;
    const newESV = document.getElementById("newESV").value;
    const newNIV = document.getElementById("newNIV").value;

    const newVerse = {
      theme: newTheme,
      reference: newReference,
      translations: {
        RCV: newRCV,
        ESV: newESV,
        NIV: newNIV,
      },
    };

    allVerses.push(newVerse);
    alert("New Verse Card Added!");
    console.log("allVerses after addNewVerse() = ", allVerses);

    if (!themes.includes(newTheme)) {
      themes.push(newTheme);
    }

    createThemeFilter();
    renderVerses(allVerses);

    form.reset();
  });
}

// document.addEventListener("DOMContentLoaded", filterTheme);
document.addEventListener("DOMContentLoaded", addNewVerse);
document.addEventListener("DOMContentLoaded", createThemeFilter);
