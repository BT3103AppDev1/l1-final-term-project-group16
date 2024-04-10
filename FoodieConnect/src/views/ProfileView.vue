<template>
    <div class="profile-page">
        <div class="profile-content">
            <div class="profile-header">
                <h1>Profile</h1>
            </div>
            <router-link to="/update-profile" class="profile-link">
                <profile-item title="User Profile" description="Edit your personal details"></profile-item>
            </router-link>
            <router-link to="/update-preference" class="profile-link">
                <profile-item title="Preferences" description="Change your preferences"></profile-item>
            </router-link>
        </div>
    </div>
</template>


<script>
import ProfileItem from '../components/ProfileItem.vue';
import { RouterLink } from 'vue-router';


export default {
    components: {
        ProfileItem,
        RouterLink,
    },
};
</script>

<style scoped>
.profile-page {
    display: flex;
}

.profile-content {
    padding: 100px 50px 50px;
    flex-grow: 1;
    background-color: #fff;
    color: black;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-header {
    width: 100%;
    padding: 10px 0;
    text-align: center;
}

.profile-link {
    text-decoration: none;
}
</style>