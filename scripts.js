/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
*/


// Global Variables
let allVerses = [];
let translations = ["RCV", "ESV", "NIV"];
let themes = ["All"]; // will be updated based on allVerses


// Update the themes array from allVerses
function updateThemes() {
  const uniqueThemes = new Set(allVerses.map((verse) => verse.theme));
  themes = ["All", ...uniqueThemes];
}


function getFilteredVerses(theme) {
  return theme === "All"
    ? allVerses
    : allVerses.filter((verse) => verse.theme === theme);
}


function findVerseIndex(verse) {
  return allVerses.findIndex((v) => 
    v.theme === verse.theme && 
    v.reference === verse.reference && 
    JSON.stringify(v.translations) === JSON.stringify(verse.translations)
  );
}


// Create dropdown filter for themes
function createThemeDropdown() {
  const themeFilter = document.getElementById("theme-filter");
  const currentTheme = themeFilter.value; // Store current selected theme before rebuilding the dropdown
  themeFilter.innerHTML = ""; // Clear the dropdown

  updateThemes();

  // Rebuild the dropdown options
  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeFilter.appendChild(option);
  });

  // Reselect the user's current theme or fall back to "All"
  themeFilter.value = themes.includes(currentTheme) 
    ? currentTheme 
    : "All";
  
  // Filter verses when dropdown changes
  themeFilter.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    
    const filteredVerses = getFilteredVerses(selectedTheme);
    renderVerses(filteredVerses);
  });
}

function confirmAndDeleteVerse(verse) {
  const confirmDelete = confirm("Are you sure you want to delete this verse?");
  if (!confirmDelete) return;
  
  const verseIndex = findVerseIndex(verse);
  
  if (verseIndex !== -1) {
    allVerses.splice(verseIndex, 1);
  }
  
  // Refresh the theme dropdown
  createThemeDropdown();
  
  // Get the currently selected theme after rebuild
  const selectedTheme = document.getElementById("theme-filter").value;
  const filteredVerses = getFilteredVerses(selectedTheme);
  renderVerses(filteredVerses);
}


function renderVerses(verses, selectedTranslation = "RCV") {
  const container = document.getElementById("verse-container");
  container.innerHTML = ""; // Clear out old content

  verses.forEach((verse) => {
    // Create verse card
    const card = document.createElement("div");
    card.className = "verse-card";

    const theme = document.createElement("h3");
    theme.textContent = verse.theme;

    const reference = document.createElement("p");
    reference.textContent = verse.reference;

    const verseText = document.createElement("p");
    verseText.textContent = verse.translations[selectedTranslation];
    
    // Create copy button
    const copyBtn = document.createElement("button");
    copyBtn.classList.add("verse-btn", "copy-verse-btn");
    copyBtn.textContent = "📋";

    copyBtn.addEventListener("click", () => {
      const verseToCopy = `${verse.reference} (${selectedTranslation}) - ${verse.translations[selectedTranslation]}`;
      navigator.clipboard.writeText(verseToCopy)
      .then(() => {
        showToast("Verse copied!");
      })
      .catch((err) => {
        console.log("Copy failed: ", err);
      })
    });
      
    // Create translation dropdown
    const translationDropdown = document.createElement("select");
    translationDropdown.className = "translation-select";

    translations.forEach((translation) => {
      const option = document.createElement("option");
      option.value = translation;
      option.text = translation;
      if (translation === selectedTranslation) {
        option.selected = true;
      }
      translationDropdown.appendChild(option);
    });
    
    // Toggle translation
    translationDropdown.addEventListener("change", (event) => {
      const translationToDisplay = event.target.value;
      verseText.textContent = verse.translations[translationToDisplay];
    });
    
    // Create remove button
    const removeVerseBtn = document.createElement("button");
    removeVerseBtn.classList.add("verse-btn", "remove-verse-btn");
    removeVerseBtn.textContent = "X";

    // Remove verse
    removeVerseBtn.addEventListener("click", () => confirmAndDeleteVerse(verse));
      
    // Assemble card
    card.appendChild(theme);
    card.appendChild(reference);
    card.appendChild(verseText);
    card.appendChild(translationDropdown);
    card.appendChild(copyBtn);
    card.appendChild(removeVerseBtn);
    
    // Add card to page
    container.appendChild(card);
  });
}


function addNewVerse() {
  const form = document.getElementById("add-verse-form");
  
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Stop page from refreshing

    // Get user input
    const newTheme = document.getElementById("new-theme").value.trim();
    const newReference = document
      .getElementById("new-reference")
      .value.trim();

    const referenceRegex = /^[1-3]?\s?[A-Za-z]+(?:\s[A-Za-z]+)*\s\d{1,3}:\d{1,3}$/;
    if (!referenceRegex.test(newReference)) {
      alert("Please enter a valid reference (e.g. John 3:16, 1 Peter 2:9).")
      return;
    }

    const newRCV = document.getElementById("new-rcv").value.trim();
    const newESV = document.getElementById("new-esv").value.trim();
    const newNIV = document.getElementById("new-niv").value.trim();
  
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
    showToast("Verse Added!");

    if (!themes.includes(newTheme)) {
      themes.push(newTheme);
    }
    
    createThemeDropdown();
    renderVerses(allVerses);

    form.reset();
  });
}


function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = `${message} ✅`;
  toast.classList.add("show");

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}


document.addEventListener("DOMContentLoaded", () => {
  addNewVerse();
  
  fetch("bible_verses.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      allVerses = data;
      
      renderVerses(allVerses);
      createThemeDropdown();
    })
    .catch((err) => {
      console.log("Error loading verses: ", err);
    });
});
