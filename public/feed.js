if (!localStorage.getItem("catalog")) {
    const catalog = [
        { id: 1, title: "The WONDERfools", year: 2026, genre: "Fantasy", type: "Series", row: "trending", img: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/The_Wonderfools_poster.png/250px-The_Wonderfools_poster.png", likes: 920 },
        { id: 2, title: "The Last of Us", year: 2023, genre: "Drama", type: "Series", row: "trending", img: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg", likes: 1500 },
        { id: 3, title: "Breaking Bad", year: 2008, genre: "Crime", type: "Series", row: "trending", img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", likes: 1500 },
        { id: 9, title: "Love is Blind", year: 2020, genre: "Reality", type: "Series", row: "reality", img: "https://m.media-amazon.com/images/M/MV5BNDk5OGRjZDEtMjc3Yi00Y2QxLWI3ZmYtNDY2NmYyMzlhZWU3XkEyXkFqcGc@._V1_.jpg", likes: 546 },
        { id: 15, title: "Wednesday", year: 2022, genre: "Comedy", type: "Series", row: "continue", img: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg", likes: 2800, progress: 45 }
    ];
    localStorage.setItem("catalog", JSON.stringify(catalog));
}

let heroIndex = 0;
let heroItems = [];

document.addEventListener("DOMContentLoaded", () => {
    const catalog = JSON.parse(localStorage.getItem("catalog")) || [];
    
    heroItems = catalog.filter(item => item.row === "trending");
    if (heroItems.length > 0) setHero(heroItems[0]);

    renderAllRows(catalog);
});

function renderAllRows(data) {
    renderRow("row-trending", data.filter(i => i.row === "trending"));
    renderRow("row-reality", data.filter(i => i.row === "reality"));
    renderRow("row-continue", data.filter(i => i.row === "continue"));
}

function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    items.forEach(item => {
        let progressBar = item.row === "continue" ? `<div class="progress-bar"><div class="progress" style="width:${item.progress}%"></div></div>` : "";
        container.innerHTML += `
            <div class="post">
                <img class="post-thumb" src="${item.img}" alt="${item.title}">
                ${progressBar}
                <div class="post-overlay">
                    <div class="overlay-title">${item.title}</div>
                    <div class="overlay-meta"><span>${item.year}</span> • <span>${item.genre}</span></div>
                    <button class="btn btn-sm btn-danger mt-2" onclick="addLike(${item.id})">♥️ <span id="likes-${item.id}">${item.likes}</span></button>
                </div>
            </div>`;
    });
}

function filterMovies() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const catalog = JSON.parse(localStorage.getItem("catalog"));
    const filtered = catalog.filter(item => item.title.toLowerCase().includes(term));
    renderAllRows(filtered);
}

function sortAlphabetically() {
    const catalog = JSON.parse(localStorage.getItem("catalog"));
    catalog.sort((a, b) => a.title.localeCompare(b.title));
    renderAllRows(catalog);
}

function setHero(item) {
    document.getElementById("hero").style.backgroundImage = `url(${item.img})`;
    document.getElementById("hero-title").textContent = item.title;
    document.getElementById("hero-meta").innerHTML = `<span>${item.year}</span> | <span>${item.genre}</span>`;
}

function nextHero() {
    heroIndex = (heroIndex + 1) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

function prevHero() {
    heroIndex = (heroIndex - 1 + heroItems.length) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

function scrollRow(id, amount) {
    document.getElementById(id).scrollBy({ left: amount, behavior: 'smooth' });
}

function addLike(id) {
    let catalog = JSON.parse(localStorage.getItem("catalog"));
    let item = catalog.find(i => i.id === id);
    if (item) {
        item.likes++;
        localStorage.setItem("catalog", JSON.stringify(catalog));
        document.getElementById(`likes-${id}`).innerText = item.likes;
    }
}

