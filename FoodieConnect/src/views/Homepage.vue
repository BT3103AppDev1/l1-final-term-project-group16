<template>
  <div class="home">
    <h1 class="title">FoodieConnect</h1>
    <div class="content">
      <div v-for="(post, index) in posts" :key="index" class="post">
        <!-- Wrap the post content with router-link -->
        <router-link :to="{ name: 'post', params: { id: post.id }}">
          <img v-if="post.photoUrl" :src="post.photoUrl" alt="Post" class="post-image">
          <h2>{{ post.title }}</h2>
          <p>{{ post.caption }}</p>
          <p>{{ post.hashtags }}</p>
        </router-link>
      </div>
    </div>
    <div class="footer">
      <router-link class="add-post" to="/post">+</router-link>
    </div>
  </div>
</template>


<script>
import { db } from '@/firebase.js';

export default {
  data() {
    return {
      posts: []
    };
  },
  async mounted() {
    try {
      const querySnapshot = await db.collection('posts').get();
      querySnapshot.forEach((doc) => {
        // Include the document ID in the post object
        let postData = doc.data();
        postData.id = doc.id;
        this.posts.push(postData);
      });
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  }
}
</script>


<style scoped>
.home {
  text-align: center;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
}

.content {
  max-width: 500px;
  margin: 0 auto;
}

.post {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.footer {
  position: fixed;
  bottom: 20px;
  left: 20px;
  /* Adjusted to move the button to the bottom left corner */
}

.add-post {
  display: block;
  width: 60px;
  height: 60px;
  background-color: #4CAF50;
  color: white;
  font-size: 2em;
  text-align: center;
  line-height: 60px;
  border-radius: 50%;
  text-decoration: none;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}

.add-post:hover {
  background-color: #45a049;
}
</style>