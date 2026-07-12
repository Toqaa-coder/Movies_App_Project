// ====================== profiles.js ======================

if (!requireAuth()) {
    throw new Error("המשתמש לא מחובר - מופנה ל-login");
}

// רשימת אווטארים קבועה מסדרות וסרטים
const CARTOON_AVATARS = [
    "https://i.pinimg.com/236x/72/0b/0b/720b0b59d08700d515ff1022fafc7ab1.jpg",
    "https://townsquare.media/site/442/files/2022/12/attachment-attachment-jenna-ortega_gallery-single_0287r2c.jpg",
    "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25124451/Squid_Game__The_Challenge_n_S1_E1_00_08_21_16R.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4gmVV9Hvu2blJRVFLrwbRMCfBMwbYsfhqkw&s"
];

function getAvatarForProfile(profile) {
    if (profile.avatarUrl) return profile.avatarUrl;
    const index = profile._id
        ? profile._id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % CARTOON_AVATARS.length
        : 0;
    return CARTOON_AVATARS[index];
}

async function loadProfiles() {
    try {
        const response = await authFetch('/api/profiles');
        if (!response) return;

        const data = await response.json();
        const profiles = data.profiles || data;

        renderProfiles(profiles);
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}

function renderProfiles(profiles) {
    const container = document.getElementById('profiles-container');
    container.innerHTML = '';

    profiles.forEach(profile => {
        const div = document.createElement('div');
        div.className = 'profile';
        div.innerHTML = `
            <div style="position: relative;">
                <img src="${getAvatarForProfile(profile)}"
                     class="profile-avatar-img"
                     onclick="selectProfile('${profile._id}')">
                <span class="delete-btn" onclick="deleteProfile(event, '${profile._id}')">✕</span>
            </div>
            <p onclick="editProfileName(event, '${profile._id}', '${profile.profileName}')" style="cursor: pointer;">
                ${profile.profileName} ✏️
            </p>
        `;
        container.appendChild(div);
    });
}

function selectProfile(profileId) {
    localStorage.setItem('selectedProfileId', profileId);
    window.location.href = '/feed.html';
}

async function deleteProfile(event, profileId) {
    event.stopPropagation();

    if (!confirm("האם למחוק את הפרופיל?")) return;

    try {
        const response = await authFetch(`/api/profiles/${profileId}`, {
            method: 'DELETE'
        });
        if (!response) return;

        const data = await response.json();

        if (response.ok) {
            loadProfiles();
        } else {
            alert(data.message || "שגיאה במחיקת פרופיל");
        }
    } catch (error) {
        alert("שגיאה בשרת: " + error.message);
    }
}

// ============================================
// עדכון שם פרופיל - Update כנדרש בסעיף 7
// ============================================
async function editProfileName(event, profileId, currentName) {
    event.stopPropagation();

    const newName = prompt("שם חדש לפרופיל:", currentName);

    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    try {
        const response = await authFetch(`/api/profiles/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify({ profileName: newName.trim() })
        });
        if (!response) return;

        const data = await response.json();

        if (response.ok) {
            loadProfiles();
        } else {
            alert(data.message || "שגיאה בעדכון פרופיל");
        }
    } catch (error) {
        alert("שגיאה בשרת: " + error.message);
    }
}

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

        if (data._id || data.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProfileModal'));
            modal.hide();
            input.value = '';
            loadProfiles();
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

document.addEventListener('DOMContentLoaded', loadProfiles);

async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}