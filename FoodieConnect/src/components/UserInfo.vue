<template>
    <div class="user-info" v-if="user">
        <!-- Use the profilePic URL from Firestore, with a fallback to the default photo if it's not available -->
        <img :src="user.profilePic || defaultPhoto" alt="Profile Picture">
        <!-- Display the name from Firestore if available, otherwise fallback to the displayName -->
        <div class="user-name">{{ user.name || user.displayName }}</div>
        <RouterLink to="/logout" class="menu-item">Log out</RouterLink>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import firebase from '@/firebase.js';
// Import the default image using ES6 import syntax
import defaultPhoto from '@/assets/user_default.png';

export default {
    components: {
        RouterLink,
    },
    data() {
        return {
            user: null,
            // Set the imported default photo in your data property
            defaultPhoto: defaultPhoto,
        };
    },
    created() {
        this.fetchUser();
    },
    methods: {
        async fetchUser() {
            firebase.auth().onAuthStateChanged(async (authenticatedUser) => {
                if (authenticatedUser) {
                    const userDoc = firebase.firestore().collection('user_profile').doc(authenticatedUser.uid);
                    try {
                        const doc = await userDoc.get();
                        if (doc.exists) {
                            // Set the user data with profile pic and name from Firestore
                            this.user = {
                                displayName: authenticatedUser.displayName,
                                name: doc.data().name,
                                profilePic: doc.data().profile_pic || this.defaultPhoto,
                            };
                        } else {
                            // If the document doesn't exist, use default data
                            this.user = {
                                displayName: authenticatedUser.displayName,
                                name: authenticatedUser.displayName, // Use displayName if name is not set in Firestore
                                profilePic: this.defaultPhoto,
                            };
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                } else {
                    this.user = null;
                }
            });
        }
    }
};
</script>

<style scoped>
.user-info {
    margin-top: 10px;
    text-align: center;
    align-self: center;
}

.user-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.user-name {
    color: white;
    margin-bottom: 10px;
}

.menu-item {
    background: none;
    border: 2px solid #fff;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    color: white;
    text-align: center;
    cursor: pointer;
    font-size: 1rem;
}

.menu-item:hover {
    background-color: #a05252;
}
</style>