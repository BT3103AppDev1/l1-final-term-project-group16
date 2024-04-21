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
                <input type="submit" value="Update" :disabled="loading">
            </div>
        </form>
        <div v-if="loading">Uploading image...</div>
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
                emailNotifications: '',
                photoURL: '', // Profile picture URL
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
                const userProfileRef = firebase.firestore().collection('user_profile').doc(user.uid);
                userProfileRef.get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.profile.username = data.name || user.displayName;
                        this.profile.gender = data.gender;
                        this.profile.dob = data.birthday;
                        this.profile.emailNotifications = data.email;
                        this.profile.photoURL = data.profile_pic || user.photoURL; // Make sure this is the permanent URL from Firebase Storage
                        console.log('Fetched user profile:', data); // Add this line for debugging
                    }
                }).catch(error => {
                    console.error("Error fetching user profile:", error);
                });
            }
        },


        updateProfile() {
            const user = firebase.auth().currentUser;
            if (user) {
                user.updateProfile({
                    displayName: this.profile.username,
                    photoURL: this.profile.photoURL,
                }).then(() => {
                    const userProfileRef = firebase.firestore().collection('user_profile').doc(user.uid);
                    return userProfileRef.update({
                        name: this.profile.username,
                        gender: this.profile.gender,
                        birthday: this.profile.dob,
                        email: this.profile.emailNotifications, // Assuming this is a boolean
                        profile_pic: this.profile.photoURL,
                        userId: user.uid, // This should be consistent; consider if it needs to be updated
                    });
                }).then(() => {
                    console.log('Profile updated successfully');
                    alert('Profile updated successfully!');
                }).catch(error => {
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
                // Create a URL for the file object for preview purposes
                this.profile.photoURL = URL.createObjectURL(file);
                // Proceed to upload the file
                this.updateProfilePicture(file);
            }
        },

        async updateProfilePicture(file) {
            const user = firebase.auth().currentUser;
            if (user) {
                this.loading = true; // Start the loading process
                const storageRef = firebase.storage().ref(`profile_pictures/${user.uid}/${file.name}`);
                try {
                    const uploadTaskSnapshot = await storageRef.put(file);
                    const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
                    this.profile.photoURL = downloadURL; // Update local state with the new URL for preview

                    // Update Firestore with the new photo URL
                    await this.updateFirestoreProfile(user.uid, downloadURL);
                    console.log('Profile picture updated successfully with URL:', downloadURL);
                } catch (error) {
                    console.error('Error updating profile picture:', error);
                } finally {
                    this.loading = false; // End the loading process
                    console.log('Setting loading to false'); // Diagnostic log
                }
            }
        },


        async updateFirestoreProfile(userId, photoURL) {
            // Update Firebase Auth profile if you want to keep it in sync
            await firebase.auth().currentUser.updateProfile({ photoURL });

            // Update Firestore user profile document
            const userProfileRef = firebase.firestore().collection('user_profile').doc(userId);
            await userProfileRef.update({ profile_pic: photoURL });
        },

        async updateProfileWithNewPhoto(downloadURL) {
            const user = firebase.auth().currentUser;
            if (user) {
                await user.updateProfile({ photoURL: downloadURL });
                const userProfileRef = firebase.firestore().collection('user_profile').doc(user.uid);
                await userProfileRef.update({ profile_pic: downloadURL });
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
    /* If you want the card to be full width of the container */
    max-width: 100%;
    /* Adjust this value to your preference */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Other styles... */
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
