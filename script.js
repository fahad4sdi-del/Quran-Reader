const surahSelect = document.getElementById("surahSelect");
const ayahList = document.getElementById("ayahList");
const surahInfo = document.getElementById("surahInfo");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let currentSurah = quranMeta[0];
let currentSearch = "";

function buildSurahOptions() {
  quranMeta.forEach((surah) => {
    const option = document.createElement("option");
    option.value = surah.number;
    option.textContent = `${surah.number}. ${surah.name} — ${surah.englishName}`;
    surahSelect.appendChild(option);
  });
}

function renderSurahInfo(surah) {
  surahInfo.innerHTML = `
    <h2>${surah.number}. ${surah.name}</h2>
    <p><strong>${surah.englishName}</strong> — ${surah.englishNameTranslation}</p>
    <p>آیات: ${surah.ayahs.length}</p>
  `;
}

function renderAyahs(surah, filterText = "") {
  ayahList.innerHTML = "";

  const query = filterText.trim().toLowerCase();
  const filteredAyahs = query
    ? surah.ayahs.filter((ayah) => {
        return (
          ayah.arabic.toLowerCase().includes(query) ||
          ayah.urdu.toLowerCase().includes(query)
        );
      })
    : surah.ayahs;

  if (!filteredAyahs.length) {
    ayahList.innerHTML = `<div class="ayah-card"><p class="translation">کوئی آیت تلاش کے مطابق نہیں ملی۔</p></div>`;
    return;
  }

  filteredAyahs.forEach((ayah) => {
    const card = document.createElement("article");
    card.className = "ayah-card";
    card.innerHTML = `
      <div class="ayah-number">${ayah.number}</div>
      <div class="arabic">${ayah.arabic}</div>
      <div class="urdu">${ayah.urdu}</div>
    `;
    ayahList.appendChild(card);
  });
}

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ واضح موڈ";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙 تاریک موڈ";
  }
}

function saveTheme(theme) {
  localStorage.setItem("quranReaderTheme", theme);
}

function loadTheme() {
  const saved = localStorage.getItem("quranReaderTheme");
  setTheme(saved === "dark" ? "dark" : "light");
}

surahSelect.addEventListener("change", () => {
  const selected = Number(surahSelect.value);
  currentSurah = quranMeta.find((surah) => surah.number === selected) || quranMeta[0];
  renderSurahInfo(currentSurah);
  renderAyahs(currentSurah, currentSearch);
});

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  renderAyahs(currentSurah, currentSearch);
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  setTheme(isDark ? "dark" : "light");
  saveTheme(isDark ? "dark" : "light");
});

function initApp() {
  buildSurahOptions();
  loadTheme();
  renderSurahInfo(currentSurah);
  renderAyahs(currentSurah);
  surahSelect.value = currentSurah.number;
}

initApp();
