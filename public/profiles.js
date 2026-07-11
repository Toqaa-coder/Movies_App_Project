// ====================== profiles.js ======================

// בדיקת הרשאה - חובה לפני טעינת הדף
if (!requireAuth()) {
    throw new Error("המשתמש לא מחובר - מופנה ל-login");
}

// טעינת פרופילים מהשרת
async function loadProfiles() {
    try {
        console.log('TOKEN BEFORE FETCH:', localStorage.getItem('token'));

        const response = await authFetch('/api/profiles');
        console.log('RESPONSE STATUS:', response ? response.status : 'response is null');

        if (!response) return; // authFetch כבר הפנתה ל-login אם הטוקן לא תקין

        const data = await response.json();
        console.log('DATA RECEIVED:', data);

        if (!data.success) {
            console.log('REDIRECTING BECAUSE success=false');
            window.location.href = '/';
            return;
        }

        renderProfiles(data.profiles);
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}

// הצגת הפרופילים על המסך
function renderProfiles(profiles) {
    const container = document.getElementById('profiles-container');
    container.innerHTML = '';

    profiles.forEach(profile => {
        const div = document.createElement('div');
        div.className = 'col-4 col-md-3 col-lg-2 text-center mb-4';
        div.innerHTML = `
            <div class="profile-card" onclick="selectProfile(${profile.id})" style="cursor: pointer;">
                <div style="width: 110px; height: 110px; margin: 0 auto; background-color: ${profile.color}; 
                            border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                            font-size: 45px; color: white;">
                    ${profile.avatar}
                </div>
                <h5 class="mt-3">${profile.profileName}</h5>
            </div>
        `;
        container.appendChild(div);
    });
}

// בחירת פרופיל
function selectProfile(profileId) {
    localStorage.setItem('selectedProfileId', profileId);
    window.location.href = '/feed.html';
}

// הוספת פרופיל חדש
async function addNewProfile() {
    const input = document.getElementById('newProfileName');
    const profileName = input.value.trim();

    if (!profileName) {
        alert("יש להזין שם פרופיל");
        return;
    }

    try {
        const response = await authFetch('/api/profiles', {
            method: 'POST',
            body: JSON.stringify({ profileName: profileName })
        });
        if (!response) return;

        const data = await response.json();

        if (data.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProfileModal'));
            modal.hide();
            input.value = '';
            loadProfiles();
        } else {
            alert(data.message || "שגיאה בהוספת פרופיל");
        }
    } catch (error) {
        alert("שגיאה בשרת");
    }
}

function showAddProfileModal() {
    document.getElementById('newProfileName').value = '';
    const modal = new bootstrap.Modal(document.getElementById('addProfileModal'));
    modal.show();
}

// טעינה כשהעמוד נטען
document.addEventListener('DOMContentLoaded', loadProfiles);

async function logout() {
    // logout מבוצע דרך authClient.js (מוחק את הטוקן מקומית)
    if (typeof window.logout === 'function' && window.logout !== logout) {
        window.logout();
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}