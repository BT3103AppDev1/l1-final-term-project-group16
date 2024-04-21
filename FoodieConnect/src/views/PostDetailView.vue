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
  <div v-else class="loading">
    Loading post...
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Comment from '@/components/Comment.vue'; 

export default {
    components: {
        Comment // Register the Comment component
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            post: null,
        };
    },
    computed: {
        computedHashtags() {
            return this.post?.hashtags.split(',') ?? [];
        }
    },
    async mounted() {
        try {
            const docRef = doc(db, 'posts', this.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                this.post = docSnap.data();
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }
};
</script>

<style scoped>
.post-detail {
    text-align: center;
    margin: auto; /* Centers the detail section in the parent */
    max-width: 800px; 
}

.post-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin-top: 20px; /* Space between title and image */
}

.caption {
    font-size: 1em;
    margin-top: 20px; /* Space between image and caption */
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

.loading {
    text-align: center;
    margin-top: 50px; 
}
</style>
