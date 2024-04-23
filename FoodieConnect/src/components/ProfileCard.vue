<template>
    <div class="profile-card">
        <div class="edit-profile-pic">
            <img :src="profile.photoURL" alt="Profile Picture" @click="triggerFileInput">
            <input type="file" id="fileInput" ref="fileInput" @change="handleFileUpload" accept="image/jpeg, image/png"
                hidden>
        </div>
        <h2>User Profile</h2>
        <form @submit.prevent="updateProfile">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="profile.username" placeholder="Username">
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" v-model="profile.gender">
                    <option value="" disabled>Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="dob">Date of Birth</label>
                <input type="date" id="dob" v-model="profile.dob">
            </div>
            <div class="form-group">
                <label>Email Notifications</label>
                <label class="toggle-button">
                    <input type="checkbox" id="email-notifications" v-model="profile.emailNotifications">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="form-group">
                <input type="submit" value="Update" :disabled="loading">
            </div>
        </form>
        <div v-if="loading">Uploading image...</div>
    </div>
</template>

<script>
import { firebase, db, storage } from '@/firebase'; // Adjust the path to your firebase.js file

export default {
    data() {
        return {
            profile: {
                username: '',
                gender: '',
                dob: '',
                emailNotifications: false,
                photoURL: '',
            },
            loading: false
        };
    },
    created() {
        this.fetchUserProfile();
    },
    methods: {
        fetchUserProfile() {
            const user = firebase.auth().currentUser;
            if (user) {
                const userProfileRef = db.collection('user_profile').doc(user.uid);
                userProfileRef.get().then(doc => {
                    if (doc.exists) {
                        this.profile = {
                            username: doc.data().name || '',
                            gender: doc.data().gender || '',
                            dob: doc.data().birthday || '',
                            emailNotifications: doc.data().email || false,
                            photoURL: doc.data().profile_pic || '',
                        };
                    }
                }).catch(error => {
                    console.error("Error fetching user profile:", error);
                });
            }
        },
        updateProfile() {
            const user = firebase.auth().currentUser;
            if (user) {
                this.loading = true;
                const userProfileRef = db.collection('user_profile').doc(user.uid);
                userProfileRef.update({
                    name: this.profile.username,
                    gender: this.profile.gender,
                    birthday: this.profile.dob,
                    email: this.profile.emailNotifications
                }).then(() => {
                    alert('Profile updated successfully!');
                    this.loading = false;
                }).catch(error => {
                    console.error('Error updating profile:', error);
                    this.loading = false;
                });
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.uploadImageToStorage(file);
            }
        },
        async uploadImageToStorage(file) {
            const user = firebase.auth().currentUser;
            if (user && file) {
                this.loading = true;
                const fileRef = storage.ref(`profile_pictures/${user.uid}/${file.name}`);
                try {
                    await fileRef.put(file);
                    const downloadURL = await fileRef.getDownloadURL();
                    this.profile.photoURL = downloadURL;
                    await this.updateFirestoreProfile(user.uid, downloadURL);
                    this.loading = false;
                } catch (error) {
                    console.error('Error uploading image:', error);
                    this.loading = false;
                }
            }
        },
        async updateFirestoreProfile(userId, imageUrl) {
            const userProfileRef = db.collection('user_profile').doc(userId);
            try {
                await userProfileRef.update({
                    profile_pic: imageUrl
                });
            } catch (error) {
                console.error('Error updating profile with image URL:', error);
            }
        },
    }
};
</script>

<style scoped>
.profile-card {
    background-color: #f0f0f0;
    padding: 40px;
    border-radius: 20px;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-card h2 {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select {
    width: calc(100% - 22px);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

.form-group input[type="submit"] {
    background-color: #7b1c2a;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.form-group input[type="submit"]:hover {
    background-color: #561116;
}

.toggle-button {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.toggle-button input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.edit-profile-pic {
    background-color: #ccc;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    font-size: 0.8rem;
    color: black;
    margin-bottom: 30px;
    cursor: pointer;
}

.edit-profile-pic img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
</style>
