<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      <div v-if="successMessage" style="color: green;">{{ successMessage }}</div>
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </template>
  
  <script>
  import axios from '../axiosConfig';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
        successMessage: this.$route.query.message || ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('/auth/login', {
            email: this.email,
            password: this.password
          });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/');
          this.$root.$emit('user-logged-in');
        } catch (error) {
          this.errorMessage = error.response.data.error || 'Error logging in';
        }
      }
    }
  };
  </script>
  