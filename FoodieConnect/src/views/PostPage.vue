<template>
  <div class="post-page">
    <h1 class="title">Create a New Post</h1>
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="title-container">
          <label for="title" class="label">Title:</label>
          <input type="text" id="title" v-model="title" class="input-title">
        </div>
        <div class="content-container">
          <div class="left-column">
            <div class="form-group photo-group">
              <label for="photo" class="label">Photo:</label>
              <div class="photo-container">
                <input type="file" id="photo" @change="handlePhotoChange" accept="image/*" class="input-photo">
                <div v-if="photoUrl" class="photo-preview">
                  <img :src="photoUrl" alt="Preview" class="preview-image">
                </div>
                <div v-else class="photo-placeholder">
                  <span>Add photo</span>
                </div>
              </div>
            </div>
          </div>
          <div class="right-column">
            <div class="form-group">
              <label for="hashtags" class="label">Hashtags:</label>
              <div class="hashtag-input-container">
                <input type="text" id="hashtags" v-model="hashtags" class="input" readonly @click="showHashtagPopup">
                <div v-if="showPopup" class="hashtag-popup">
                  <div class="hashtag-options">
                    <div v-for="tag in hashtagOptions" :key="tag" @click="toggleHashtag(tag)" :class="{ active: selectedHashtags.includes(tag) }">{{ tag }}</div>
                  </div>
                  <button @click="confirmHashtags">Confirm</button>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="caption" class="label">Caption:</label>
              <textarea id="caption" rows="4" v-model="caption" class="input"></textarea>
            </div>
          </div>
        </div>
        <button type="submit" class="submit-button" @click='clearSelectedHashtags'>Submit</button>
      </form>
    </div>
    <div v-if="showWarning" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideWarning">&times;</span>
        <p>Please fill out all fields before submitting.</p>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Comment from '@/components/Comment.vue';

export default {
  components: {
    Comment
  },
  data() {
    return {
      photo: null,
      photoUrl: null,
      hashtags: '',
      title: '',
      caption: '',
      showWarning: false,
      showPopup: false,
      selectedHashtags: [],
      hashtagOptions: [
        "Western", "Chinese", "North-east", "East", "West", "Pet-Friendly", "Date Nights", "Thai", "Korean", "Budget friendly"
      ]
    };
  },
  methods: {
    handlePhotoChange(event) {
      this.photo = event.target.files[0];
      this.previewPhoto();
    },
    previewPhoto() {
      if (this.photo) {
        const reader = new FileReader();
        reader.readAsDataURL(this.photo);
        reader.onload = (event) => {
          this.photoUrl = event.target.result;
        };
      }
    },
    async submitForm() {
      if (!this.isFormFilled()) {
        this.showWarning = true;
        return;
      }

      const postData = {
        photoUrl: this.photoUrl,
        hashtags: this.hashtags,
        title: this.title,
        caption: this.caption
      };

      try {
        this.clearForm();
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log('Post added with ID: ', docRef.id);
        this.$emit('postSubmitted', postData);
        this.clearForm();
      } catch (error) {
        console.error('Error adding post: ', error);
      }
    },
    clearForm() {
      this.photo = null;
      this.photoUrl = null;
      this.hashtags = '';
      this.title = '';
      this.caption = '';
    },
    isFormFilled() {
      return this.photo && this.title && this.caption;
    },
    hideWarning() {
      this.showWarning = false;
    },
    showHashtagPopup() {
      this.showPopup = true;
    },
    hideHashtagPopup() {
      this.showPopup = false;
    },
    toggleHashtag(tag) {
      if (this.selectedHashtags.includes(tag)) {
        this.selectedHashtags = this.selectedHashtags.filter(item => item !== tag);
      } else {
        this.selectedHashtags.push(tag);
      }
    },
    clearSelectedHashtags() {
      this.selectedHashtags = []; // Clear the selected hashtags array
    },
    confirmHashtags() {
      this.hideHashtagPopup();
      // Update the hashtags input field with selected hashtags
      this.hashtags = this.selectedHashtags.join(', ');
    }
  }
}
</script>

<style scoped>
.post-page {
  text-align: center;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
}

.form-container {
  max-width: 1000px; /* Increase the maximum width */
  margin: 0 auto;
}

.form {
  display: flex;
  flex-direction: column;
}

.title-container {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-title {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.content-container {
  display: flex;
}

.left-column {
  flex: 1;
}

.right-column {
  flex: auto;
}

.photo-container {
  position: relative; /* Make it a positioned container */
  width: 100%;
  height: 300px; /* Set a fixed height */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-photo {
  position: absolute; /* Position the input element */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; /* Hide the input element */
  cursor: pointer;
}

.preview-image {
  width: 100%; /* Make the image fill up the entire container */
  height: 100%; /* Make the image fill up the entire container */
  object-fit: cover; /* Ensure the image covers the entire container */
}

.photo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #aaa;
  font-size: 1.5em;
}

.input {
  width: calc(100% - 10px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.textarea {
  resize: vertical;
}

.submit-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
  width: 70%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.hashtag-input-container {
  position: relative;
}

.hashtag-popup {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1;
  padding: 10px;
}

.hashtag-popup button {
  margin-top: 10px;
}

.hashtag-options {
  max-height: 150px;
  overflow-y: auto;
}

.hashtag-options div {
  cursor: pointer;
  padding: 5px;
}

.hashtag-options div.active {
  background-color: #f0f0f0;
}
</style>
