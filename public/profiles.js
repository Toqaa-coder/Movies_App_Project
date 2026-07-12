// ====================== profiles.js ======================

// טעינת פרופילים מהשרת
async function loadProfiles() {
    try {
        const response = await fetch('/profiles');
        const data = await response.json();

        if (!data.success) {
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
        const user = getCurrentUser();
        const response = await authFetch('/api/profiles', {
            method: 'POST',
            body: JSON.stringify({ userId: user.id, profileName, age: 18, preferences: [] })
        });
        if (!response) return;
        const data = await response.json();

        if (data._id) {
            localStorage.setItem('selectedProfileId', data._id);
            window.location.href = '/feed.html';
        } else {
            alert(data.message || "שגיאה בהוספת פרופיל");
        }
    } catch (error) {
        alert("שגיאה בשרת: " + error.message);
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
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/';
}