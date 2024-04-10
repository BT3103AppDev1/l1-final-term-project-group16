<template>
    <div class="saved-lists-page">
      <h1>Saved Lists</h1>
      <section>
        <h2>My List</h2>
        <div class="list-container">
          <!-- Example list items -->
          <div class="list-item">Budget Meals</div>
          <div class="list-item">Lunch Dates</div>
        </div>
      </section>
      <section>
        <h2>Shared List</h2>
        <div class="list-container">
          <!-- Example list items -->
          <div class="list-item">Family Dinner</div>
          <div class="list-item">Reunion Dinner</div>
          <div class="list-item">Date Nights</div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase'; // Adjust the import path as necessary
  import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
  
  export default {
    name: 'List',
    setup() {
      const lists = ref([]);
  
      const fetchLists = async () => {
        const querySnapshot = await getDocs(collection(db, 'your_lists_collection'));
        lists.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      };
  
      const createNewList = async () => {
        const newList = {
          name: 'New List',
          categories: [], // Add categories/tags
          restaurants: [] // Add restaurants
        };
        await addDoc(collection(db, 'your_lists_collection'), newList);
        await fetchLists(); // Refresh the lists
      };
  
      const removeRestaurant = async (listId, restaurantId) => {
        // Update the list to remove the restaurant
        // This will be a simplified version, the actual implementation may vary
        const listRef = doc(db, 'your_lists_collection', listId);
        await updateDoc(listRef, {
          // Actual removal logic will depend on your data structure
        });
        await fetchLists(); // Refresh the lists
      };
  
      onMounted(fetchLists);
  
      return {
        lists,
        createNewList,
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

@media (max-width: 768px) {
  .list-container {
    flex-direction: column;
  }
}
</style>