<template>
    <div class="sign-up-container">
        <h1>Sign Up</h1>
        <form @submit.prevent="signUp">
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required placeholder="Enter your email" />
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required placeholder="Enter a password" />
            </div>
            <button type="submit" class="btn-sign-up">Sign Up</button>
        </form>
    </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
    name: "SignUp",
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        signUp() {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, this.email, this.password)
                .then((userCredential) => {
                    // Signed up successfully
                    // You can store the user or redirect as needed
                    this.$router.push('/homepage');
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Error ${errorCode}: ${errorMessage}`);
                });
        }
    }
};
</script>

<style scoped>
.sign-up-container {
    max-width: 300px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.input-group {
    margin-bottom: 1rem;
}

.input-group label {
    display: block;
}

.input-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn-sign-up {
    width: 100%;
    padding: 0.5rem;
    background-color: #5cb85c;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}

.btn-sign-up:hover {
    background-color: #4cae4c;
}
</style>
