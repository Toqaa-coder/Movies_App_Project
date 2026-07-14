//  DATA
const dramas = [
    { title: "Breaking Bad",     img: "https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg" },
    { title: "Black Mirror",     img: "https://image.tmdb.org/t/p/w300/7PRddO7z7mcPi21nZTCMGShAyy1.jpg" },
    { title: "Money Heist",      img: "https://image.tmdb.org/t/p/w300/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" },
    { title: "The Witcher",      img: "https://image.tmdb.org/t/p/w300/7vjaCdMw15FEbXyLQTVa04URsPm.jpg" },
    { title: "Dark",             img: "https://image.tmdb.org/t/p/w300/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg" },
    { title: "Lupin",            img: "https://image.tmdb.org/t/p/w300/sgxawbFB5Vi5OkPWQLNfl3dvkNJ.jpg" },
    { title: "The Last of Us",   img: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg" },
    { title: "Perfect Match",    img: "https://upload.wikimedia.org/wikipedia/en/7/7b/Perfect_Match_2023.png" },
    { title: "Interstellar",     img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
    { title: "Love is Blind",    img: "https://m.media-amazon.com/images/M/MV5BNDk5OGRjZDEtMjc3Yi00Y2QxLWI3ZmYtNDY2NmYyMzlhZWU3XkEyXkFqcGc@._V1_.jpg" },
];

const movies = [
    { title: "Stranger Things",      img: "https://image.tmdb.org/t/p/w300/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
    { title: "Squid Game",           img: "https://image.tmdb.org/t/p/w300/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg" },
    { title: "The Crown",            img: "https://image.tmdb.org/t/p/w300/1M876KPjulVwppEpldhdc8V4o68.jpg" },
    { title: "Narcos",               img: "https://image.tmdb.org/t/p/w300/rTmal9fDbwh5F0waol2hq35U4ah.jpg" },
    { title: "Wednesday",            img: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" },
    { title: "Bridgerton",           img: "https://image.tmdb.org/t/p/w300/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg" },
    { title: "New Mobile Game",      img: "https://m.media-amazon.com/images/I/A1yE991D8UL.png" },
    { title: "Building the Band",    img: "https://m.media-amazon.com/images/M/MV5BY2Q3MWNmMzQtZGIwMC00ZDJkLWE5MmEtMTdmYTBkOGJmZWE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "The Sandman",          img: "https://image.tmdb.org/t/p/w500/q54qEgagGOYCq5D1903eBVMNkbo.jpg" },
    { title: "Inception",            img: "https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
];

const allContent = [...new Map([...dramas, ...movies].map(x => [x.title, x])).values()];


// ════════════════════════════════════════════
//  SLIDER STATE
// ════════════════════════════════════════════
const state = {
    drama: { offset: 0, list: dramas,  visible: 6, trackId: "dramas-track",  leftId: "drama-left",  rightId: "drama-right"  },
    movie: { offset: 0, list: movies,  visible: 5, trackId: "catalog-track", leftId: "movie-left",  rightId: "movie-right"  },
};

function updateSlider(key) {
    const s = state[key];
    document.getElementById(s.trackId).style.transform =
        `translateX(-${s.offset * (100 / s.visible)}%)`;
    const max = Math.max(0, s.list.length - s.visible);
    document.getElementById(s.leftId).disabled  = s.offset <= 0;
    document.getElementById(s.rightId).disabled = s.offset >= max;
}

function scrollRow(key, dir) {
    const s = state[key];
    const max = Math.max(0, s.list.length - s.visible);
    s.offset = Math.max(0, Math.min(max, s.offset + dir));
    updateSlider(key);
}

// ════════════════════════════════════════════
//  IMAGE FALLBACK
// ════════════════════════════════════════════
function imgFallback(img, title) {
    img.onerror = null;
    img.style.display = 'none';
    const fb = document.createElement('div');
    fb.style.cssText = `
        width: 100%; height: 200px; background: #222; border-radius: 4px;
        display: flex; align-items: center; justify-content: center;
        color: #aaa; font-size: 12px; text-align: center;
        padding: 10px; box-sizing: border-box;
    `;
    fb.textContent = title;
    img.parentNode.insertBefore(fb, img);
}

// ════════════════════════════════════════════
//  BUILD DRAMA TRACK
// ════════════════════════════════════════════
function buildDramaTrack() {
    const track = document.getElementById("dramas-track");
    track.innerHTML = "";
    dramas.forEach(item => {
        const card = document.createElement("div");
        card.className = "drama-card";

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.title;
        img.onerror = () => imgFallback(img, item.title);

        const p = document.createElement("p");
        p.textContent = item.title;

        card.appendChild(img);
        card.appendChild(p);

        card.addEventListener("click", () => {
            document.querySelectorAll(".drama-card.pressed")
                .forEach(c => { if (c !== card) c.classList.remove("pressed"); });
            card.classList.toggle("pressed");
        });

        track.appendChild(card);
    });
    updateSlider("drama");
}

// ════════════════════════════════════════════
//  BUILD MOVIE TRACK
// ════════════════════════════════════════════
function buildMovieTrack() {
    const track = document.getElementById("catalog-track");
    track.innerHTML = "";
    movies.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "movie-card";

        const numDiv = document.createElement("div");
        numDiv.className = "movie-num";
        const numSpan = document.createElement("span");
        numSpan.textContent = index + 1;
        numDiv.appendChild(numSpan);

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.title;
        img.onerror = () => imgFallback(img, item.title);

        const p = document.createElement("p");
        p.textContent = item.title;

        card.appendChild(numDiv);
        card.appendChild(img);
        card.appendChild(p);

        card.addEventListener("click", () => {
            document.querySelectorAll(".movie-card.pressed")
                .forEach(c => { if (c !== card) c.classList.remove("pressed"); });
            card.classList.toggle("pressed");
        });

        track.appendChild(card);
    });
    updateSlider("movie");
}

// ════════════════════════════════════════════
//  SEARCH & INIT
// ════════════════════════════════════════════
const searchToggle  = document.getElementById("search-toggle");
const searchWrapper = document.getElementById("search-wrapper");
const searchInput   = document.getElementById("search");
const resultsEl     = document.getElementById("search-results");
const notFoundEl    = document.getElementById("not-found");
const mainEl        = document.getElementById("main-content");

function showMain() {
    resultsEl.style.display  = "none";
    notFoundEl.style.display = "none";
    mainEl.style.display     = "block";
}

searchToggle.addEventListener("click", e => {
    e.preventDefault();
    const hidden = searchWrapper.style.display === "none" || searchWrapper.style.display === "";
    searchWrapper.style.display = hidden ? "block" : "none";
    if (hidden) searchInput.focus();
    else { searchInput.value = ""; showMain(); }
});

searchInput.addEventListener("input", function () {
    const text = this.value.trim().toLowerCase();
    if (!text) { showMain(); return; }

    const found = allContent.filter(m => m.title.toLowerCase().includes(text));
    mainEl.style.display     = "none";
    notFoundEl.style.display = "none";

    if (found.length === 0) {
        resultsEl.style.display = "none";
        return;
    }

    resultsEl.style.display = "flex";
    resultsEl.innerHTML = "";

    found.forEach(item => {
        const card = document.createElement("div");
        card.className = "search-card";
        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.title;
        img.onerror = () => imgFallback(img, item.title);
        const p = document.createElement("p");
        p.textContent = item.title;
        card.appendChild(img);
        card.appendChild(p);
        resultsEl.appendChild(card);
    });
});

// ════════════════════════════════════════════
//  EXECUTION
// ════════════════════════════════════════════
buildDramaTrack();
buildMovieTrack();