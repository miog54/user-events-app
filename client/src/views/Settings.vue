<template>
    <div>
      <h2>Settings</h2>
      <p>Use this page to update your account information. You can change your email address and password.</p>
      <form @submit.prevent="updateSettings">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="New Password" />
        <button type="submit">Update</button>
      </form>
      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      <div v-if="successMessage" style="color: green;">{{ successMessage }}</div>
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
        successMessage: ''
      };
    },
    methods: {
      async updateSettings() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.put('/api/auth/settings', {
            email: this.email,
            password: this.password
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.successMessage = 'Settings updated successfully';
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = error.response.data.error || 'Error updating settings';
          this.successMessage = '';
        }
      }
    },
    created() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  