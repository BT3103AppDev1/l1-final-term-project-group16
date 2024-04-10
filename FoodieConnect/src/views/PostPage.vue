<template>
  <div class="post-page">
    <h1 class="title">Create a New Post</h1>
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="title-container">
          <label for="title" class="label">Title:</label>
          <input type="text" id="title" v-model="title" class="input input-title" placeholder="Enter title">
        </div>
        <div class="content-container">
          <div class="left-column">
            <div class="form-group photo-group">
              <label for="photo" class="label">Photo:</label>
              <div class="photo-container">
                <input type="file" id="photo" @change="handlePhotoChange" accept="image/*" class="input input-photo">
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
                <input type="text" id="hashtags" v-model="hashtags" class="input input-hashtags" readonly @click="showHashtagPopup" placeholder="Select hashtags">
                <div v-if="showPopup" class="hashtag-popup">
                  <div class="hashtag-options">
                    <div v-for="tag in hashtagOptions" :key="tag" @click="toggleHashtag(tag)" :class="{ active: selectedHashtags.includes(tag) }">{{ tag }}</div>
                  </div>
                  <button class="confirm-button" @click="confirmHashtags">Confirm</button>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="caption" class="label">Caption:</label>
              <textarea id="caption" rows="4" v-model="caption" class="input input-caption" placeholder="Enter caption"></textarea>
            </div>
          </div>
        </div>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
    <div v-if="showWarning" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideWarning">&times;</span>
        <p class="warning-message">Please fill out all fields before submitting.</p>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default {
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
        this.$router.push('/');
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log('Post added with ID: ', docRef.id);
        this.$emit('postSubmitted', postData); // Emit event with submitted post data
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
  width: 90%; /* Adjust width */
  max-width: 1200px; /* Limit maximum width */
  margin: 0 auto;
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%; /* Adjust width */
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
  margin-right: 20px;
}

.right-column {
  flex: 1;
  margin-left: 20px;
}

.photo-container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  width: calc(100% - 10px);
  resize: vertical;
}

.submit-button {
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  cursor: pointer;
}

.warning-message {
  color: red;
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

.confirm-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #45a049;
}
</style>
