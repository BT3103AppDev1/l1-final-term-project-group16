<template>
    <div class="preferences-view">
        <div class="main-content">
            <h1>Profile Preferences</h1>
            <div class="preference-grid">
                <PreferenceOption v-for="option in preferences" :key="option.id" :option="option"
                    :class="{ 'selected': option.selected }" @click="toggleSelection(option)" />
            </div>
            <button class="continue-btn" @click="savePreferences">Continue</button>
        </div>
    </div>
</template>

<script>
import PreferenceOption from '@/components/PreferenceOption.vue';
import firebase from '@/firebase'; // Use your actual path to firebase config

export default {
    components: {
        PreferenceOption
    },
    data() {
        return {
            preferences: [],
            selectedPreferences: []
        };
    },
    created() {
        this.fetchPreferences();
    },
    methods: {
        fetchPreferences() {
            const preferencesRef = firebase.firestore().collection('dining_preferences');
            preferencesRef.get().then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    this.preferences.push({
                        id: doc.id,
                        name: data.name,
                        imageSrc: data.imageSrc,
                        selected: data.selected
                    });
                });
            }).catch(error => {
                console.error("Error fetching preferences:", error);
            });
        },
        toggleSelection(option) {
            option.selected = !option.selected;
            this.selectedPreferences = this.preferences
                .filter(p => p.selected)
                .map(p => p.id);
        },
        savePreferences() {
            const userId = firebase.auth().currentUser.uid;
            if (!userId) {
                alert('You must be logged in to save preferences.');
                return;
            }

            const userPreferencesRef = firebase.firestore().collection('user_preferences').doc(userId);

            // Save only the IDs of the selected preferences
            const selectedPreferences = this.preferences
                .filter(p => p.selected)
                .map(p => p.id);

            userPreferencesRef.set({
                userId: userId,
                preferences: selectedPreferences
            })
                .then(() => {
                    alert('You have successfully saved your preferences!');
                    // Optionally, navigate the user to another page or perform other actions
                })
                .catch(error => {
                    console.error('Error saving preferences:', error);
                    alert('There was an error saving your preferences. Please try again.');
                });
        }


    }
};
</script>

<style scoped>
.preferences-view {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 2em;
}

.main-content {
    width: 80%;
    margin: 0 auto;
}

.preference-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1em;
    margin-top: 2em;
}

.preference-option.selected {
    background-color: #d3d3d3;
    /* Highlight the selected option */
}

.continue-btn {
    width: 100%;
    padding: 0.8em 0;
    background-color: #7b1c2a;
    color: white;
    border: none;
    border-radius: 0.5em;
    margin-top: 2em;
    cursor: pointer;
}

.continue-btn:hover {
    background-color: #561116;
}
</style>