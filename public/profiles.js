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
        const response = await fetch('/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileName: profileName })
        });

        const data = await response.json();

        if (data.success) {
            // סגירת המודל
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProfileModal'));
            modal.hide();
            input.value = '';
            loadProfiles(); // רענון הרשימה
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
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/';
}