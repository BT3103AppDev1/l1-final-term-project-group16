<template>
  <div class="home">
    <h1 class="title">FoodieConnect</h1>
    <!-- Search bar -->
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Search posts..." class="search-bar">
      <select v-model="selectedTag" class="tag-filter">
        <option value="">All Tags</option>
        <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
      <button @click="searchPosts" class="search-button">Search</button>
    </div>
    <div class="content">
      <!-- Wrap the post content with router-link to make it clickable -->
      <router-link v-for="(post, index) in filteredPosts" :key="index" :to="{ name: 'post', params: { id: post.id } }"
        class="post-link">
        <div class="post">
          <div class="post-content">
            <img v-if="post.photoUrl" :src="post.photoUrl" alt="Post" class="post-image">
            <h2>{{ post.title }}</h2>
            <p>{{ post.caption }}</p>
            <!-- Display hashtags -->
            <div class="hashtags">
              <span v-for="hashtag in post.hashtags.split(',')" :key="hashtag" class="hashtag">
                #{{ hashtag.trim() }}
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="footer">
      <router-link class="add-post" to="/post">+</router-link>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { firebase, db } from '@/firebase';

export default {
  data() {
    return {
      posts: [],
      searchQuery: '',
      selectedTag: '',
      tags: []
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        querySnapshot.forEach(doc => {
          const post = { id: doc.id, ...doc.data() };
          this.posts.push(post);
          // Extract and store unique tags from hashtags
          post.hashtags.split(',').forEach(tag => {
            if (tag.trim() && !this.tags.includes(tag.trim())) {
              this.tags.push(tag.trim());
            }
          });
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    searchPosts() {
      this.filteredPosts = this.filterPosts();
      this.isSearchActivated = true;
    },
    showFullPost(index) {
      this.posts[index].fullPost = true;
    },


    hideFullPost(index) {
      this.$set(this.posts[index], 'fullPost', false);
    }
  },
  computed: {
    filteredPosts() {
      let result = this.posts;
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        result = result.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.caption.toLowerCase().includes(searchLower) ||
          post.hashtags.toLowerCase().includes(searchLower)
        );
      }
      if (this.selectedTag) {
        result = result.filter(post => post.hashtags.includes(this.selectedTag));
      }
      return result;
    }
  }
}
</script>

<style scoped>
/* Original CSS */
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
  right: 20px;
}

.add-post {
  display: block;
  width: 60px;
  height: 60px;
  background-color: #f1b708;
  color: white;
  font-size: 2em;
  text-align: center;
  line-height: 60px;
  border-radius: 50%;
  text-decoration: none;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}

.add-post:hover {
  background-color: #fd9800;
}

.search-container {
  margin-bottom: 10px;
}

.search-bar {
  width: 70%;
  height: 40px;
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-button {
  height: 40px;
  font-size: 16px;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  background-color: #f1b708;
  color: black;
  cursor: pointer;
  margin-left: 10px;
  font-weight: bold;
}

.search-button:hover {
  background-color: #fd9800;
}

.tag-filter {
  height: 40px;
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-left: 10px;
}

.see-more {
  cursor: pointer;
}
</style>
