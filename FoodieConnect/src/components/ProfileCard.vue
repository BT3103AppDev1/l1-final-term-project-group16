<template>
    <div class="profile-card">
        <div class="edit-profile-pic">
            <img :src="profile.photoURL" alt="Profile Picture" @click="triggerFileInput">
            <input type="file" id="fileInput" ref="fileInput" @change="uploadImage" accept="image/jpeg, image/png"
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
                    <option value="" disabled selected>Select...</option>
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
                <input type="submit" value="Update">
            </div>
        </form>
    </div>
</template>

<script>
import firebase from '@/firebase'; // Adjust the path to your firebase.js file

export default {
    data() {
        return {
            profile: {
                username: '',
                gender: '',
                dob: '',
                emailNotifications: false,
                photoURL: '', // Profile picture URL
            }
        };
    },
    created() {
        this.fetchUserProfile();
    },
    methods: {
        fetchUserProfile() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // Set the default values from Firebase user data
                    this.profile.username = user.displayName;
                    this.profile.photoURL = user.photoURL;
                }
            });
        },
        updateProfile() {
            const user = firebase.auth().currentUser;
            if (user) {
                user.updateProfile({
                    displayName: this.profile.username,
                    // Add logic to handle photoURL update if needed
                }).then(() => {
                    console.log('Profile updated successfully');
                    alert('You have finished setting up your profile!');
                }).catch((error) => {
                    console.error('Error updating profile:', error);
                });
            } else {
                console.log('No user is currently signed in.');
            }
        },
        editPicture() {
            // Implement logic to edit the profile picture
            console.log('Edit picture');
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        uploadImage(event) {
            const file = event.target.files[0];
            if (file) {
                // Create a local URL for the selected file to display it immediately
                this.profile.photoURL = URL.createObjectURL(file);
                // Upload the image to Firebase Storage and update the profile picture URL
                this.updateProfilePicture(file);
            }
        },

        async updateProfilePicture(file) {
            const user = firebase.auth().currentUser;
            if (user) {
                const storageRef = firebase.storage().ref(`profile_pictures/${user.uid}/${file.name}`);

                try {
                    const uploadTaskSnapshot = await storageRef.put(file);
                    const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

                    await user.updateProfile({ photoURL: downloadURL });
                    this.profile.photoURL = downloadURL;

                    // Force a refresh of the user's profile data
                    await user.reload();
                    this.fetchUserProfile();

                    console.log('Profile picture updated successfully');
                } catch (error) {
                    console.error('Error updating profile picture:', error);
                }
            } else {
                console.log('No user is currently signed in.');
            }
        }




    }

};
</script>


<style scoped>
.profile-card {
    background-color: #f0f0f0;
    padding: 40px;
    border-radius: 20px;

    /* Adjust this value to change the width of the grey box */
    width: 100%;
    /* Ensures it doesn't expand beyond max-width */
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

.form-group input[type="text"]:placeholder-shown,
.form-group input[type="date"]:placeholder-shown {
    font-style: italic;
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
    /* Placeholder color */
    border-radius: 50%;
    width: 120px;
    /* Adjust as needed */
    height: 120px;
    /* Adjust as needed */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    /* Center the circle */
    font-size: 0.8rem;
    /* Adjust as needed */
    color: black;
    /* Adjust as needed */
    margin-bottom: 30px;
    /* Space between the edit circle and the form */
    cursor: pointer;
    /* Indicates the image is clickable */
}

.edit-profile-pic img {
    width: 100%;
    /* Make the image fill the circle */
    height: 100%;
    /* Make the image fill the circle */
    border-radius: 50%;
    /* Make the image round */
}
</style>
