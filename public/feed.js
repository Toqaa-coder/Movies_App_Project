// ========================================
// feed.js — טעינת פוסטים מ־MongoDB והצגתם
// ========================================

let heroIndex = 0;  // אינדקס ה־Hero הנוכחי
let heroItems = []; // רשימת פריטי ה־Hero
let allPosts = [];  // כל הפוסטים מהשרת

// ========================================
// טעינה ראשונית כשהדף נטען
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    loadPosts(); // קריאה לפונקציה שמביאה את הפוסטים
});

// ========================================
// חלק ד׳ — שליפת כל הפוסטים מ־MongoDB
// ========================================
async function loadPosts() {
    try {
        // שליחת בקשת GET לשרת
        const response = await fetch('/api/posts');
        const posts = await response.json();
        allPosts = posts;

        // סינון פוסטים ל־Hero מתוך שורת ה־Trending
        heroItems = posts.filter(p => p.row === "trending");
        if (heroItems.length > 0) setHero(heroItems[0]);

        // הצגת כל השורות
        renderAllRows(posts);
    } catch (error) {
        console.error("שגיאה בטעינת הפוסטים:", error);
    }
}

// ========================================
// חלק ה׳ — הצגת הפוסטים לפי שורות
// ========================================
function renderAllRows(data) {
    // כל שורה מקבלת רק את הפוסטים השייכים אליה
    renderRow("row-trending", data.filter(i => i.row === "trending"));
    renderRow("row-reality",  data.filter(i => i.row === "reality"));
    renderRow("row-continue", data.filter(i => i.row === "continue"));
}

function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    items.forEach(item => {
        // סרגל התקדמות רק לשורת "המשך צפייה"
        let progressBar = item.row === "continue"
            ? `<div class="progress-bar">
                 <div class="progress" style="width:${item.progress || 0}%"></div>
               </div>`
            : "";

        // כל פוסט מקבל id="post-_id" כדי שנוכל למחוק אותו מהמסך
        container.innerHTML += `
            <div class="post" id="post-${item._id}">
                <img class="post-thumb" src="${item.img}" alt="${item.title}">
                ${progressBar}
                <div class="post-overlay">
                    <div class="overlay-title">${item.title}</div>
                    <div class="overlay-meta">
                        <span>${item.year}</span> • <span>${item.genre}</span>
                    </div>
                    <!-- כפתור מחיקה — שולח את ה־id של הפוסט לפונקציה -->
                    <button class="btn btn-sm btn-danger mt-2" onclick="deletePost('${item._id}')">
                        🗑 מחק
                    </button>
                </div>
            </div>`;
    });
}

// ========================================
// חלק ו׳ — מחיקת פוסט מ־MongoDB ומהמסך
// ========================================
async function deletePost(postId) {
    // אישור המשתמש לפני המחיקה
    if (!confirm("האם אתה בטוח שברצונך למחוק?")) return;

    try {
        // שליחת בקשת DELETE לשרת עם ה־id של הפוסט
        const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE"
        });
        const result = await response.json();

        if (result.message === "Deleted!") {
            // הסרת הפוסט מהמסך ללא ריענון הדף
            document.getElementById(`post-${postId}`).remove();
        } else {
            alert("שגיאה במחיקה");
        }
    } catch (error) {
        alert("שגיאת רשת: " + error.message);
    }
}

// ========================================
// פונקציות עזר — Hero וגלילה
// ========================================

// עדכון תמונת ה־Hero לפי הפריט הנבחר
function setHero(item) {
    document.getElementById("hero").style.backgroundImage = `url(${item.img})`;
    document.getElementById("hero-title").textContent = item.title;
    document.getElementById("hero-meta").innerHTML = 
        `<span>${item.year}</span> | <span>${item.genre}</span>`;
}

// מעבר ל־Hero הבא
function nextHero() {
    heroIndex = (heroIndex + 1) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

// מעבר ל־Hero הקודם
function prevHero() {
    heroIndex = (heroIndex - 1 + heroItems.length) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

// גלילה אופקית של שורה
function scrollRow(id, amount) {
    document.getElementById(id).scrollBy({ left: amount, behavior: 'smooth' });
}

