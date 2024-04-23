<template>
    <div id="sidebar">
        <div class="logo-container">
            <RouterLink to="/homepage">
                <img src="@/assets/icon.jpg" alt="Logo" class="logo" />
            </RouterLink>
        </div>
        <RouterLink to="/homepage" class="menu-item">Home</RouterLink>
        <RouterLink to="/profile" class="menu-item">Profile</RouterLink>
        <RouterLink to="/postpage" class="menu-item">New Post</RouterLink>
        <RouterLink to="/saved-list" class="menu-item">Saved List</RouterLink>
        <RouterLink to="/communities" class="menu-item">Communities</RouterLink>
        <user-info></user-info>
    </div>
</template>

<script>
import UserInfo from './UserInfo.vue';
import { RouterLink } from 'vue-router';

export default {
    components: {
        UserInfo,
        RouterLink,
    },
};
</script>

<style scoped>
#sidebar {
    background-color: #7b1c2a;
    position: fixed;
    top: 0;
    left: 0;
    width: 220px;
    height: 100%;
    box-shadow: 3px 0 6px rgba(0, 0, 0, 0.2);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1000;
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px; /* Adjust as needed */
}

.logo {
    border-radius: 50%;
    max-width: 100%; 
    height: auto; 
}

.menu-item {
    background: none;
    border: 2px solid #fff;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    color: white;
    text-align: left;
    cursor: pointer;
    font-size: 1rem;
}

.menu-item:hover {
    background-color: #a05252;
}

.menu-item.router-link-exact-active {
    background-color: #a05252; 
    color: white;
}
</style>
 