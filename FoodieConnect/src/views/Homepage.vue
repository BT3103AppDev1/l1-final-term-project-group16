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
      <div v-for="(post, index) in filteredPosts" :key="index" class="post">
        <div class="post-content">
          <img v-if="post.photoUrl" :src="post.photoUrl" alt="Post" style="max-width: 100%;">
          <h2>{{ post.title }}</h2>
          <button v-if="!post.fullPost" @click="showFullPost(index)" class="see-more">See More</button>
          <modal v-if="post.fullPost" @close="hideFullPost(index)">
            <h2 slot="header">{{ post.title }}</h2>
            <p>{{ post.caption }}</p>
            <p>{{ post.hashtags }}</p>
          </modal>
        </div>
      </div>
    </div>
    <div class="footer">
      <router-link class="add-post" to="/post">+</router-link>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import db from '@/firebase';

export default {
  data() {
    return {
      posts: [],
      searchQuery: '',
      isSearchActivated: false,
      selectedTag: '',
      tags: []
    };
  },
  mounted() {
    this.fetchPosts();
    this.setupPostListener();
  },
  methods: {
    async fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        querySnapshot.forEach(doc => {
          const post = { ...doc.data(), fullPost: false };
          this.posts.push(post);
          post.hashtags.split(',').forEach(tag => {
            if (!this.tags.includes(tag.trim())) {
              this.tags.push(tag.trim());
            }
          });
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    setupPostListener() {
      const unsubscribe = onSnapshot(collection(db, 'posts'), snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const newPost = { ...change.doc.data(), fullPost: false };
            if (!this.posts.some(post => post.id === newPost.id)) {
              this.posts.unshift(newPost);
              newPost.hashtags.split(',').forEach(tag => {
                if (!this.tags.includes(tag.trim())) {
                  this.tags.push(tag.trim());
                }
              });
            }
          }
        });
      });
    },
    filterPosts() {
      let filteredPosts = this.posts;
      const searchTerm = this.searchQuery.toLowerCase().trim();
      const selectedTag = this.selectedTag.trim();
      if (searchTerm) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.caption.toLowerCase().includes(searchTerm) ||
          post.hashtags.toLowerCase().includes(searchTerm)
        );
      }
      if (selectedTag) {
        filteredPosts = filteredPosts.filter(post =>
          post.hashtags.split(',').map(tag => tag.trim()).includes(selectedTag)
        );
      }
      return filteredPosts;
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
      if (this.isSearchActivated) {
        return this.filterPosts();
      } else {
        return this.posts;
      }
    }
  },
  components: {
    Modal: {
      template: `
        <transition name="modal">
          <div class="modal-mask" @click="$emit('close')">
            <div class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-header">
                  <slot name="header"></slot>
                  <button class="modal-default-button" @click="$emit('close')">
                    X
                  </button>
                </div>
                <div class="modal-body">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
        </transition>
      `
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
  background-color: #4CAF50;
  color: white;
  font-size: 2em;
  text-align: center;
  line-height: 60px;
  border-radius: 50%;
  text-decoration: none;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
}

.add-post:hover {
  background-color: #45a049;
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
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}

.search-button:hover {
  background-color: #45a049;
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
