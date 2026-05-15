console.log("start");

/* =========================
   LOCAL STORAGE DATA
========================= */
if (!localStorage.getItem("catalog")) {

    const catalog = [
        {
    id: 1,
    title: "The WONDERfools",
    year: 2026,
    genre: "Fantasy",
    type: "Series",
    row: "trending",
    img: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/The_Wonderfools_poster.png/250px-The_Wonderfools_poster.png",
    likes: 920,
    badge: "New Series"
},
        {
            id: 2,
            title: "The Last of Us",
            year: 2023,
            genre: "Drama",
            type: "Series",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
            likes: 1500
    
  
        },
        {
            id: 3,
            title: "Breaking Bad",
            year: 2008,
            genre: "Crime",
            type: "Series",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            likes: 1500,
            badge: "NEW SEASON COMING SOON"
        },
        {
            id: 4,
            title: "Inception",
            year: 2010,
            genre: "Action",
            type: "Movie",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            likes: 2000
        },
        {
            id: 5,
            title: "The Crown",
            year: 2016,
            genre: "Drama",
            type: "Series",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
            likes: 980
        },
        {
            id: 6,
            title: "Squid Game",
            year: 2021,
            genre: "Thriller",
            type: "Series",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
            likes: 3200
        },
        {
            id: 7,
            title: "The Witcher",
            year: 2019,
            genre: "Fantasy",
            type: "Series",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
            likes: 1100
        },
        {
            id: 8,
            title: "Interstellar",
            year: 2014,
            genre: "Sci-Fi",
            type: "Movie",
            row: "trending",
            img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            likes: 870
        },

        {
            id: 9,
            title: "Love is Blind",
            year: 2020,
            genre: "Reality",
            type: "Series",
            row: "reality",
            img: "https://m.media-amazon.com/images/M/MV5BNDk5OGRjZDEtMjc3Yi00Y2QxLWI3ZmYtNDY2NmYyMzlhZWU3XkEyXkFqcGc@._V1_.jpg",
            likes: 546
        },
        {
    id: 10,
    title: "Building the Band",
    year: 2024,
    genre: "Reality",
    type: "Series",
    row: "reality",
    img: "https://m.media-amazon.com/images/M/MV5BY2Q3MWNmMzQtZGIwMC00ZDJkLWE5MmEtMTdmYTBkOGJmZWE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    likes: 0,
    badge: "NEW SEASON COMING SOON"
},
        {
            id: 11,
            title: "Perfect Match",
            year: 2023,
            genre: "Reality",
            type: "Series",
            row: "reality",
            img: "https://upload.wikimedia.org/wikipedia/en/7/7b/Perfect_Match_2023.png",
            likes: 420
        },
        {
            id: 12,
            title: "The Circle",
            year: 2020,
            genre: "Reality",
            type: "Series",
            row: "reality",
            img: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/The_Circle_Season_3.jpeg/250px-The_Circle_Season_3.jpeg",
            likes: 420
        },
        {
            id: 13,
            title: "Indian Matchmaking",
            year: 2020,
            genre: "Reality",
            type: "Series",
            row: "reality",
            img: "https://m.media-amazon.com/images/M/MV5BYTgwYTVhMTUtMjAyMi00Y2MxLTg4NWQtNjU1Nzg1NTkyNmEzXkEyXkFqcGc@._V1_.jpg",
            likes: 310
        },

        {
            id: 14,
            title: "The Sandman",
            year: 2022,
            genre: "Fantasy",
            type: "Series",
            row: "continue",
            img: "https://image.tmdb.org/t/p/w500/q54qEgagGOYCq5D1903eBVMNkbo.jpg",
            likes: 760,
            progress: 80
        },
        {
            id: 15,
            title: "Wednesday",
            year: 2022,
            genre: "Comedy",
            type: "Series",
            row: "continue",
            img: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
            likes: 2800,
            progress: 45
        },
        {
            id: 16,
            title: "Bridgerton",
            year: 2020,
            genre: "Romance",
            type: "Series",
            row: "continue",
            img: "https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg",
            likes: 1900,
            progress: 100
        },
        {
            id: 17,
            title: "Money Heist",
            year: 2017,
            genre: "Crime",
            type: "Series",
            row: "continue",
            img: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
            likes: 2100,
            progress: 20
        },
        {id: 18,
      title: "Stranger Things", 
      year: 2016,
      genre: "Sci-Fi",
      type: "Series",
      row: "trending", 
      img: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    },
        {
    id: 999,
    title: "New Mobile Game",
    year: 2026,
    genre: "Game",
    row: "trending",
    img: "https://m.media-amazon.com/images/I/A1yE991D8UL.png",
    likes: 0,
    isAd: true
},
    ];

    localStorage.setItem("catalog", JSON.stringify(catalog));
}

/* =========================
   PAGE LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const catalog = JSON.parse(localStorage.getItem("catalog")) || [];

    let heroIndex = 0;

    const heroItems = catalog.filter(
        item => item.row === "trending" || item.type === "Movie"
    );

    function setHero(item){

        document.getElementById("hero").style.backgroundImage =
        `url(${item.img})`;

        document.getElementById("hero-title").textContent =
        item.title;

        document.getElementById("hero-meta").textContent =
        `${item.year} • ${item.genre} • ${item.type}`;

        updateDots();
    }

    function nextHero(){
        heroIndex++;
        if(heroIndex >= heroItems.length){
            heroIndex = 0;
        }
        setHero(heroItems[heroIndex]);
    }

    function prevHero(){
        heroIndex--;
        if(heroIndex < 0){
            heroIndex = heroItems.length - 1;
        }
        setHero(heroItems[heroIndex]);
    }

    function goToHero(index){
        heroIndex = index;
        setHero(heroItems[heroIndex]);
    }

    function renderDots(){
        const dots = document.getElementById("hero-dots");
        dots.innerHTML = "";

        heroItems.forEach((_, index) => {
            dots.innerHTML += `
                <div class="dot" onclick="goToHero(${index})"></div>
            `;
        });

        updateDots();
    }

    function updateDots(){
        const dots = document.querySelectorAll(".dot");

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === heroIndex);
        });
    }

    // expose functions to HTML
    window.nextHero = nextHero;
    window.prevHero = prevHero;
    window.goToHero = goToHero;

    setHero(heroItems[heroIndex]);
    renderDots();

    setInterval(nextHero, 5000);

    /* ROWS */
    renderRow("row-trending", catalog.filter(i => i.row === "trending" && !i.isAd));
    renderRow("row-reality", catalog.filter(i => i.row === "reality"));
    renderRow("row-continue", catalog.filter(i => i.row === "continue"));
});
function nextHero(){
    heroIndex++;

    if(heroIndex >= heroItems.length){
        heroIndex = 0;
    }

    setHero(heroItems[heroIndex]);
}

function prevHero(){
    heroIndex--;

    if(heroIndex < 0){
        heroIndex = heroItems.length - 1;
    }

    setHero(heroItems[heroIndex]);
}

function renderDots(){
    const dots = document.getElementById("hero-dots");
    dots.innerHTML = "";

    heroItems.forEach((_, index) => {
        dots.innerHTML += `
            <div class="dot" onclick="goToHero(${index})"></div>
        `;
    });

    updateDots();
}

function updateDots(){
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
        dot.classList.remove("active");

        if(index === heroIndex){
            dot.classList.add("active");
        }
    });
}

function goToHero(index){
    heroIndex = index;
    setHero(heroItems[heroIndex]);
}
/* ========================= NAVBAR SCROLL ========================= */
 window.addEventListener("scroll",() => {
   const nav = document.getElementById("navbar");
    if(nav){ 
    nav.classList.toggle("scrolled", window.scrollY > 50);
 } })
/* ========================
   RENDER FUNCTION
========================= */
function renderRow(containerId, items) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    items.forEach(item => {

    let progressBar = "";
    let badgeHTML = "";

    if(item.badge){
        badgeHTML = `<div class="content-badge">${item.badge}</div>`;
    }

    if(item.row === "continue"){
        progressBar = `
            <div class="progress-bar">
                <div class="progress" style="width:${item.progress}%"></div>
            </div>
        `;
    }

    let actionHTML = "";
        if(item.id === 999){
            actionHTML = `
                <button class="like-btn ad-btn">GET GAME</button>
            `;
        } else {
            actionHTML = `
                <button class="like-btn" onclick="addLike(${item.id}, this)">♥</button>
                <span class="like-count" id="likes-${item.id}">${item.likes}</span>
            `;
        }

        container.innerHTML += `
            <div class="post">

             ${badgeHTML}
            <img class="post-thumb" src="${item.img}" alt="${item.title}">
                ${progressBar}

                <div class="post-overlay">
                    <div class="overlay-title">${item.title}</div>

                    <div class="overlay-meta">
                        <span class="match">97% Match</span>
                        <span>${item.year}</span>
                        <span>${item.type}</span>
                    </div>

                    <div class="overlay-actions">
                        ${actionHTML}
                        <span class="genre-tag">${item.genre}</span>
                    </div>
                </div>

            </div>
        `;
    });
}

/* =========================
   LIKE FUNCTION
========================= */
function addLike(id, button) {

    const catalog = JSON.parse(localStorage.getItem("catalog"));
    const item = catalog.find(movie => movie.id === id);

    item.likes++;

    localStorage.setItem("catalog", JSON.stringify(catalog));

    document.getElementById(`likes-${id}`).innerText = item.likes;

    button.classList.toggle("liked");

    button.classList.add("animate-heart");

    setTimeout(() => {
        button.classList.remove("animate-heart");
    }, 300);
}
function scrollRow(id, value){
    document.getElementById(id).scrollBy({
        left: value,
        behavior: "smooth"
    });
}
console.log("end");