<template>
    <div class="community-card">
        <div class="image-container">
            <img :src="community.picture" :alt="community.name" class="community-image" v-if="community.picture">
        </div>
        <h3 class="community-name">{{ community.name }}</h3>
        <button :class="{ 'subscribed': community.subscribed, 'not-subscribed': !community.subscribed }"
            @click="toggleSubscription">
            {{ community.subscribed ? 'Subscribed' : 'Subscribe' }}
        </button>
    </div>
</template>

<script>
export default {
    props: {
        community: {
            type: Object,
            required: true
        }
    },
    emits: ['toggle-subscription'],
    methods: {
        toggleSubscription() {
            this.$emit('toggle-subscription', this.community);
        }
    }
};
</script>

<style scoped>
.community-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 20px;
    background: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    width: 100%;
    /* Set a specific width or max-width if you want to control the size */
}

.community-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.image-container {
    width: 100%;
    /* Full width of the card */
    height: 0;
    /* Adjust height to maintain aspect ratio */
    padding-top: 100%;
    /* Equal to width to maintain aspect ratio */
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    /* Fallback color */
}

.community-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.community-name {
    font-size: 1em;
    color: #333;
    margin: 10px 0;
}

button {
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: bold;
    margin-top: auto;
    /* Push the button to the bottom of the flex container */
}

button.not-subscribed {
    background-color: #7b1c2a;
    /* Theme color */
}

button.subscribed {
    background-color: #ffcccb;
    /* Light pink color for subscribed state */
}
</style>