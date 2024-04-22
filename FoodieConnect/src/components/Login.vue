<template>
  <div class="login-container">
    <img src="@/assets/icon.jpg" alt="FoodieConnect Icon" class="icon" />
    <h1 id="mainHead">Welcome to FoodieConnect</h1>
    <div id="firebaseui-auth-container"></div>
    <div id="pagecontent">
      Sign in to start sharing and exploring food experiences.
    </div>
    <h5>copyright &copy; BT3103-L1-GRP16-FoodieConnect</h5>
  </div>
</template>

<script>
import firebase from '@/firebase.js';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export default {
  name: "Login",
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestore = getFirestore();

        // Check for user_profile document
        const userProfileRef = doc(firestore, 'user_profile', user.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        // If user profile does not exist, create one with default values
        if (!userProfileSnap.exists()) {
          await setDoc(userProfileRef, {
            birthday: 'N/A',
            email: false,
            gender: 'N/A',
            name: user.displayName || 'N/A',
            profile_pic: user.photoURL || 'default_profile_pic_url',
            userId: user.uid,
          });
          alert("Set your personal details and preferences before begin using!");
          this.$router.push('/profile'); // Navigate to profile setup view
        }

        // Check for user_preferences document
        const userPrefRef = doc(firestore, 'user_preferences', user.uid);
        const userPrefSnap = await getDoc(userPrefRef);

        // If user_preferences does not exist, create one with default values
        if (!userPrefSnap.exists()) {
          await setDoc(userPrefRef, {
            userId: user.uid,
            preferences: [], // Start with no preferences
          });
        }

        // If user profile exists, redirect to homepage
        if (userProfileSnap.exists()) {
          this.$router.push('/homepage');
        }
      } else {
        // If no user is signed in, start FirebaseUI
        this.startFirebaseUI();
      }
    });
  },
  methods: {
    startFirebaseUI() {
      let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      const uiConfig = {
        signInSuccessUrl: '/homepage',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: () => {
            // User successfully signed in. Redirect after sign in.
            return false;  // Avoid redirects after sign-in.
          },
        },
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  }
}
</script>



<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 5%;
  /* Responsive padding */
}

.icon {
  width: 10%;
  /* Relative size to the viewport */
  max-width: 120px;
  /* Maximum size */
  min-width: 50px;
  /* Minimum size */
}

#mainHead {
  margin-bottom: 1rem;
  text-shadow: 2px 2px grey;
}

#firebaseui-auth-container {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

#pagecontent {
  margin-bottom: 1rem;
  font-size: 1em;
  /* Relative font size */
  font-weight: bolder;
}

h5 {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: rgb(194, 202, 188);
  padding: 0.5rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .icon {
    width: 15%;
    /* Larger percentage for smaller screens */
  }

  #mainHead {
    font-size: 1.5em;
    /* Larger font size for smaller screens */
  }

  h5 {
    font-size: 0.8em;
    /* Smaller font size for smaller screens */
  }
}
</style>
