<template>
    <div class="comment-section">
        <div class="comments">
            <div v-for="(comment, index) in comments" :key="index" class="comment">
                <strong>{{ comment.username }}:</strong>
                <p>{{ comment.text }}</p>
            </div>
        </div>
        <form @submit.prevent="submitComment" class="comment-form">
            <input type="text" v-model="newComment" placeholder="Write a comment..." class="comment-input" />
            <button type="submit" class="comment-submit-btn">Post Comment</button>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        postId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            comments: [],
            newComment: ''
        };
    },
    methods: {
        async submitComment() {
            if (!this.newComment.trim()) return;

            // Construct a new comment object
            const comment = {
                username: 'current_user', // This should be replaced with actual user data
                text: this.newComment,
                timestamp: new Date()
            };

            try {
                // Here you would normally make a request to your backend to save the comment
                // For example, using Firebase:
                // await addDoc(collection(db, `posts/${this.postId}/comments`), comment);

                // For now, we'll just add the comment to the local array
                this.comments.push(comment);
                this.newComment = ''; // Reset the input after submitting
            } catch (error) {
                console.error('Error posting comment: ', error);
            }
        }
    }
};
</script>

<style scoped>
.comment-section {
    margin-top: 20px;
}

.comments {
    margin-bottom: 20px;
}

.comment {
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.comment-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.comment-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.comment-submit-btn {
    padding: 10px 20px;
    margin-left: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.comment-submit-btn:hover {
    background-color: #45a049;
}
</style>