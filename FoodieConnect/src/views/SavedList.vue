<template>
  <div class="saved-lists-page">
    <h1>Saved Lists</h1>
    <button @click="isModalOpen = true">Create New List</button>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="isModalOpen = false">&times;</span>
        <h2>Create New List</h2>
        <input type="text" v-model="newListName" placeholder="List Title" />
        <input type="text" v-model="newCategories" placeholder="Categories (comma separated)" />
        <button @click="createNewList">Save List</button>
      </div>
    </div>

    <section v-for="list in lists" :key="list.id" class="list-section">
      <h2>{{ list.name }}</h2>
      <div>
        <label>Name:</label>
        <input type="text" v-model="list.name" />
        <button @click="updateListNameAndCategories(list.id, list.name, list.categories)">
          Update
        </button>
      </div>
      <div>
        <label>Categories:</label>
        <input type="text" v-model="list.categories" placeholder="Add categories separated by commas" />
      </div>
      <div class="list-container">
        <div class="list-item" v-for="restaurant in list.restaurants" :key="restaurant.id">
          {{ restaurant.name }}
          <button @click="removeRestaurant(list.id, restaurant.id)">Remove</button>
        </div>
      </div>
      <div>
        <input type="text" v-model="newRestaurantName" placeholder="Add a restaurant" />
        <button @click="addRestaurant(list.id, { name: newRestaurantName })">
          Add Restaurant
        </button>
      </div>
    </section>
  </div>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase'; 
  import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
  
  export default {
    name: 'List',
    setup() {
      const lists = ref([]);
      const newRestaurantName = ref('');
      const newListName = ref('');
      const newCategories = ref('');
      const isModalOpen = ref(false);

      const fetchLists = async () => {
        const querySnapshot = await getDocs(collection(db, 'your_lists_collection'));
        lists.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      };

      const createNewList = async () => {
        if (!newListName.value || !newCategories.value) {
          alert('Please fill out all fields.'); // Basic validation check
          return;
        }

        try {
          const newList = {
            name: newListName.value,
            categories: newCategories.value.split(',').map(c => c.trim()),
            restaurants: []
          };
          await addDoc(collection(db, 'your_lists_collection'), newList);
          await fetchLists(); // Refresh the lists
          isModalOpen.value = false;
          newListName.value = '';
          newCategories.value = '';
        } catch (error) {
          console.error('Error creating new list:', error);
          alert('There was an error saving the list. Please try again. ' + error.message); // Add error.message for more info
        }
      };


      const updateListNameAndCategories = async (listId, newName, newCategories) => {
        const listRef = doc(db, 'your_lists_collection', listId);
        await updateDoc(listRef, {
          name: newName,
          categories: newCategories.split(',').map(c => c.trim())
        });
        await fetchLists(); // Refresh the lists
      };

      const addRestaurant = async (listId, restaurantName) => {
        if (!restaurantName) return; // Guard clause if restaurant name is empty
        const listRef = doc(db, 'your_lists_collection', listId);
        // Fetch current list data
        const listSnap = await getDocs(listRef);
        const listData = listSnap.data();
        // Add new restaurant
        const updatedRestaurants = [...listData.restaurants, { name: restaurantName }];
        await updateDoc(listRef, {
          restaurants: updatedRestaurants
        });
        await fetchLists(); // Refresh the lists
        newRestaurantName.value = ''; // Clear the input field after adding
      };

      const removeRestaurant = async (listId, restaurantId) => {
        const listRef = doc(db, 'your_lists_collection', listId);
        // Fetch current list data
        const listSnap = await getDocs(listRef);
        const listData = listSnap.data();
        // Remove restaurant by filtering out the one with the matching id
        const updatedRestaurants = listData.restaurants.filter(restaurant => restaurant.id !== restaurantId);
        await updateDoc(listRef, {
          restaurants: updatedRestaurants
        });
        await fetchLists(); // Refresh the lists
      };

      onMounted(fetchLists);

      return {
        lists,
        newRestaurantName,
        newListName,
        newCategories,
        isModalOpen,
        createNewList,
        updateListNameAndCategories,
        addRestaurant,
        removeRestaurant
      };
    }
  };
</script>
  
<style scoped>
  .saved-lists-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
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
    gap: 10px; /* Controls space between items */
    justify-content: center; /* Centers items in the container */
    margin-bottom: 20px;
  }

  .list-item {
    background-color: #a05252; /* The color of your items */
    color: white; /* Text color */
    padding: 10px 20px; /* Vertical and horizontal padding */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); /* Optional shadow for depth */
    cursor: pointer; /* Indicates the item is clickable */
    transition: background-color 0.3s ease; /* Smooth background color transition on hover */
  }

  .list-item:hover {
    background-color: #7b1c2a; /* Darker shade on hover */
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
  display: block;
  margin-bottom: 10px;
  width: 90%;
  padding: 5px;
}

button {
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  /* Responsive adjustments */
}
</style>