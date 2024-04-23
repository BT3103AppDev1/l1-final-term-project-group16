<template>
    <div class="communities-container">
        <h1>Communities</h1>
        <div class="communities-grid">
            <CommunityCard v-for="community in communities" :key="community.id" :community="community"
                @toggle-subscription="toggleSubscription" />
        </div>
    </div>
</template>

<script>
import CommunityCard from '@/components/CommunityCard.vue';
import { db } from '@/firebase';
import { ref, onMounted } from 'vue';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default {
    components: {
        CommunityCard
    },
    setup() {
        const communities = ref([]);

        onMounted(async () => {
            const querySnapshot = await getDocs(collection(db, 'communities'));
            communities.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        });

        const toggleSubscription = async (community) => {
            const communityRef = doc(db, 'communities', community.id);
            await updateDoc(communityRef, {
                subscribed: !community.subscribed
            });

            // Locally update the subscribed status for reactivity
            const index = communities.value.findIndex(c => c.id === community.id);
            if (index !== -1) {
                communities.value[index].subscribed = !communities.value[index].subscribed;
            }
        };

        return { communities, toggleSubscription };
    }
};
</script>

<style scoped>
.communities-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
}

.communities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    width: 100%;
}

h1 {
    margin-bottom: 20px;
}
</style>