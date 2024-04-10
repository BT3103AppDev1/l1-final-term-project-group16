<template>
    <div v-if="post" class="post-detail">
        <h1>{{ post.title }}</h1>
        <img :src="post.photoUrl" alt="Post image" class="post-image">
        <p class="caption">{{ post.caption }}</p>
        <div class="hashtags">
            <span v-for="hashtag in computedHashtags" :key="hashtag" class="hashtag">
                #{{ hashtag }}
            </span>
        </div>
        
        <!-- Comments Section -->
        <Comment :postId="id" />
    </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Comment from '@/components/Comment.vue'; // Make sure the path is correct

export default {
    components: {
        Comment // Register the Comment component
    },
    props: ['id'],
    data() {
        return {
            post: null,
        };
    },
    computed: {
        computedHashtags() {
            return this.post.hashtags ? this.post.hashtags.split(',') : [];
        }
    },
    async mounted() {
        const docRef = doc(db, 'posts', this.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            this.post = docSnap.data();
        } else {
            console.log('No such document!');
        }
    }
};
</script>

<style scoped>
.post-detail {
    text-align: center;
}

.post-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
}

.caption {
    font-size: 1em;
}

.hashtags {
    margin-top: 10px;
}

.hashtag {
    display: inline-block;
    background-color: #e1e1e1;
    padding: 5px;
    margin: 2px;
    border-radius: 5px;
    font-size: 0.9em;
}
</style>
