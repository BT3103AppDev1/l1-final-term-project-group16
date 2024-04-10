<template>
    <div class="update-profile-page">
        <div class="main-content">
            <ProfileCard />
        </div>
    </div>
</template>

<script>
import ProfileCard from '@/components/ProfileCard.vue';

export default {
    components: {
        ProfileCard
    }
};
</script>

<style scoped>
.update-profile-page {
    display: flex;
    flex-direction: row;
    /* Ensure the layout is horizontal */
}

.main-content {
    /* Allows content to fill up the remaining space */
    /* This should be the width of your sidebar */
    /* Adjust the max-width to account for the sidebar */
    display: flex;
    justify-content: center;
    /* Centers the ProfileCard horizontally if there's extra space */
    align-items: center;
    /* Aligns content to the top */
}
</style>