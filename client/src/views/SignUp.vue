<template>
    <div>
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      <router-link to="/login">Login</router-link>
    </div>
  </template>
  
  <script>
  import axios from '../axiosConfig';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async signup() {
        try {
          await axios.post('/auth/signup', {
            email: this.email,
            password: this.password
          });
          this.$router.push({ name: 'Login', query: { message: 'Registration successful. Please log in.' } });
        } catch (error) {
          this.errorMessage = error.response.data.error || 'Error signing up';
        }
      }
    }
  };
  </script>
  