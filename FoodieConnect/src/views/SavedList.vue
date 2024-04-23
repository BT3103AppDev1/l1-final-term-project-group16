<template>
  <div class="saved-lists-page">
    <h1>Saved Lists</h1>
    <button class="create-list-button" @click="isModalOpen = true">Create New List</button>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="isModalOpen = false">&times;</span>
        <h2>Create New List</h2>
        <input type="text" v-model="newListName" placeholder="List Title" />
        <input type="text" v-model="newCategories" placeholder="Categories (comma separated)" />
        <div>
          <label for="list-cover-image">Cover Image:</label>
          <input type="file" id="list-cover-image" @change="handleCoverImageChange" />
        </div>
        <button class="create-list-button" @click="createNewList">Save List</button>
      </div>
    </div>

    <section v-for="(list, index) in lists" :key="list.id" class="list-section">
      <h2>{{ list.name }}</h2>
      <div>
        <label>Name:</label>
        <input type="text" v-model="list.name" />
        <button @click="updateListNameAndCategories(list.id, list.name, list.categories)">Update</button>
      </div>
      <div>
        <label>Categories:</label>
        <input type="text" v-model="list.categories" placeholder="Add categories separated by commas" />
      </div>
      <div v-if="list.coverUrl" class="list-cover">
        <img :src="list.coverUrl" alt="Cover Image" class="cover-image">
      </div>
      <div class="list-container">
        <div class="list-item" v-for="restaurant in list.restaurants" :key="restaurant.id">
          {{ restaurant.name }}
          <button class="remove-button" @click="removeRestaurant(list.id, restaurant.id)">Remove</button>
        </div>
      </div>
      <div>
        <input type="text" v-model="list.newRestaurantName" placeholder="Add a restaurant" />
        <button class="add-restaurant-button" @click="addRestaurant(list.id, list.newRestaurantName)">Add
          Restaurant</button>
      </div>
      <button class="delete-button" @click="deleteList(list.id)">Delete List</button>
      <button class="generate-link-button" @click="generateListLink(list.id)">Generate Link</button>
      <!-- Add this button -->
      <div v-if="list.generatedLink">
        <label>Generated Link:</label>
        <input type="text" :value="list.generatedLink" readonly />
      </div>
    </section>
  </div>
</template>

<script>
import firebase from '@/firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { storage } from '@/firebase'; 
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export default {
  name: 'List',
  setup() {
    const lists = ref([]);
    const newRestaurantName = ref('');
    const newListName = ref('');
    const newCategories = ref('');
    const newListCoverUrl = ref('');
    const isModalOpen = ref(false);
    const auth = getAuth();
    let unsubscribeAuth = null;

    // Function to fetch lists for the current user
    const fetchLists = async (uid) => {
      console.log(`Fetching lists for user ID: ${uid}`); // Log the path you're accessing
      const userListsRef = collection(db, 'user_lists', uid, 'lists');
      try {
        const querySnapshot = await getDocs(userListsRef);
        lists.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          newRestaurantName: '', // Add this new property for each list
          ...doc.data(),
        }));

        console.log("Lists fetched:", lists.value); // Log fetched lists
      } catch (error) {
        console.error("Error fetching lists:", error); // Log any errors
        alert('Error fetching lists.');
      }
    };

    const handleCoverImageChange = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      try {
        const storageRef = firebase.storage().ref(); // This is the correct usage with the compat library
        const fileRef = storage.ref(`covers/${Date.now()}-${file.name}`);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();

        // Store the URL in your new list data
        newListCoverUrl.value = fileUrl;
      } catch (error) {
        console.error('Error uploading cover image:', error);
        alert('Error uploading image.');
      }
    };

    const createNewList = async () => {
      if (!newListName.value || !newCategories.value) {
        alert('Please fill out all fields.');
        return;
      }

      if (!auth.currentUser) {
        alert('Not authenticated. Please log in.');
        return;
      }

      try {
        console.log("Creating new list with name:", newListName.value);
        const userDocRef = doc(db, 'user_lists', auth.currentUser.uid);
        const listsCollectionRef = collection(userDocRef, 'lists');
        const docRef = await addDoc(listsCollectionRef, {
          name: newListName.value,
          categories: newCategories.value.split(',').map(c => c.trim()),
          restaurants: [],
          coverUrl: newListCoverUrl.value
        });
        console.log("New list created with ID:", docRef.id);
        await fetchLists(auth.currentUser.uid);
        isModalOpen.value = false;
        newListName.value = '';
        newCategories.value = '';
      } catch (error) {
        console.error("Error creating new list:", error);
      }
    };



    const updateListNameAndCategories = async (listId, newName, newCategories) => {
      const listRef = doc(db, 'user_lists', auth.currentUser.uid, 'lists', listId);
      await updateDoc(listRef, {
        name: newName,
        categories: newCategories.split(',').map(c => c.trim()),
      });

      await fetchLists(auth.currentUser.uid);
    };


    const addRestaurant = async (listId, restaurantName) => {
      if (!restaurantName) {
        alert('Please enter a restaurant name.');
        return;
      }

      try {
        const listRef = doc(db, 'user_lists', auth.currentUser.uid, 'lists', listId);
        const listSnap = await getDoc(listRef);
        if (!listSnap.exists()) {
          throw new Error('List does not exist.');
        }
        const listData = listSnap.data();

        // Ensure restaurants is an array
        if (!Array.isArray(listData.restaurants)) {
          listData.restaurants = [];
        }

        const updatedRestaurants = [
          ...listData.restaurants,
          { id: Date.now().toString(), name: restaurantName }, // Use the passed restaurantName
        ];
        await updateDoc(listRef, {
          restaurants: updatedRestaurants
        });

        // Find the list in your lists array and reset the newRestaurantName for that list
        const listIndex = lists.value.findIndex((list) => list.id === listId);
        if (listIndex !== -1) {
          lists.value[listIndex].newRestaurantName = ''; // Reset newRestaurantName for the list
        }

        await fetchLists(auth.currentUser.uid);
      } catch (error) {
        console.error('Error adding restaurant:', error);
        alert('There was an error adding the restaurant: ' + error.message);
      }
    };

    const removeRestaurant = async (listId, restaurantId) => {
      const listRef = doc(db, 'user_lists', auth.currentUser.uid, 'lists', listId);
      try {
        // Fetch the current list document
        const listDoc = await getDoc(listRef);
        if (!listDoc.exists()) {
          throw new Error('List does not exist.');
        }

        // Get the data from the document
        const listData = listDoc.data();

        // Filter out the restaurant with the matching id
        const updatedRestaurants = listData.restaurants.filter(restaurant => restaurant.id !== restaurantId);

        // Update the document with the new array of restaurants
        await updateDoc(listRef, {
          restaurants: updatedRestaurants
        });

        // Refresh the lists
        await fetchLists(auth.currentUser.uid);
      } catch (error) {
        console.error('Error removing restaurant:', error);
        alert('There was an error removing the restaurant: ' + error.message);
      }
    };

    const deleteList = async (listId) => {
      try {
        // Get the reference to the user's lists document
        const userDocRef = doc(db, 'user_lists', auth.currentUser.uid, 'lists', listId);

        // Delete the document
        await deleteDoc(userDocRef);

        console.log("List deleted successfully");

        // Fetch the updated lists after deletion
        await fetchLists(auth.currentUser.uid);
      } catch (error) {
        console.error("Error deleting list:", error);
        alert('There was an error deleting the list: ' + error.message);
      }
    };

    const generateListLink = async (listId) => {
      try {
        // Generate a unique link for the list (you can use Firebase Dynamic Links or any other method)
        const generatedLink = `https://yourdomain.com/list/${listId}`;

        const listIndex = lists.value.findIndex((list) => list.id === listId);
        if (listIndex !== -1) {
          lists.value[listIndex].generatedLink = generatedLink;
        }

      } catch (error) {
        console.error('Error generating list link:', error);
        alert('There was an error generating the list link: ' + error.message);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in with UID:", user.uid);
        fetchLists(user.uid);
      } else {
        console.log("No user is signed in.");
        alert('Please log in to view your lists.');
      }
    });

    onMounted(async () => {
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("User is signed in with UID:", user.uid); // Log the UID for debugging
          await fetchLists(user.uid);
        } else {
          console.log("User is not signed in."); // Log for debugging purposes
          alert('Please log in to view your lists.');
        }
      });
    });


    return {
      lists,
      newRestaurantName,
      newListName,
      newCategories,
      isModalOpen,
      createNewList,
      updateListNameAndCategories,
      addRestaurant,
      removeRestaurant,
      deleteList,
      generateListLink,
      handleCoverImageChange,
      newListCoverUrl
    };
  }
};
</script>

<style scoped>
.saved-lists-page {
  min-height: calc(100vh - 40px);
  padding: 10px;
  margin-left: 220px;
  width: calc(100% - 220px);
  box-sizing: border-box;
  overflow: auto;
}

.list-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
}

.remove-button {
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: 10px;
  font-size: 0.8em;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.remove-button::before {
  content: '\f2ed';
  font-family: 'FontAwesome';
  margin-right: 5px;
}

.create-list-button {
  background-color: #7b1c2a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 0.9em;
  font-weight: bold;
}

.list-item {
  background-color: #a05252;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  width: auto;
}


h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}

.list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.list-item {
  background-color: #a05252;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: #7b1c2a;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.close {
  float: right;
  font-size: 1.5em;
  cursor: pointer;
}

input[type="text"] {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 10px;
  width: calc(100% - 22px);
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #495057;
}

button {
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9em;
  margin-top: 10px;
}

button:hover {
  opacity: 0.8;
}


.delete-button {
  background-color: #ff6b6b;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.8em;
  margin-left: 10px;
  font-weight: bold;
}

.delete-button:hover {
  background-color: #ff5252;
}

.add-restaurant-button {
  background-color: #f1b708;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.8em;
  font-weight: bold;
  margin-left: 10px;
}

.add-restaurant-button:hover {
  background-color: #32b643;
}


@media (max-width: 768px) {
  .saved-lists-page {
    margin-left: 10px;
    width: calc(100% - 20px);
  }

  .list-section {
    padding: 15px;
  }

  .list-cover {
  text-align: center; 
  margin-bottom: 10px; 
  }

  .cover-image {
    max-width: 100%; 
    height: auto; 
    border-radius: 4px; 
  }
}
</style>
