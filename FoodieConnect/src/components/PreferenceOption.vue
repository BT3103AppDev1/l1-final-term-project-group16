<template>
    <div class="preference-option" @click="$emit('select', option)">
        <div class="image-container">
            <img :src="option.imageSrc" :alt="option.name" class="preference-image">
        </div>
        <p class="preference-name">{{ option.name }}</p>
    </div>
</template>

<script>
export default {
    props: {
        option: {
            type: Object,
            required: true
        }
    }
};
</script>

<style scoped>
.preference-option {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.preference-option:hover {
    transform: scale(1.05);
}

.image-container {
    width: 100px;
    /* or the size you want */
    height: 100px;
    /* same as width to maintain aspect ratio */
    border-radius: 50%;
    /* circular border */
    overflow: hidden;
    /* ensures the image doesn't bleed outside the border */
    margin-bottom: 10px;
}

.preference-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* ensures the image covers the whole area */
}

.preference-name {
    font-weight: bold;
    margin-top: 0.5rem;
}
</style>
