<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <div v-if="!isAuthenticated">
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </div>
      <div v-else>
        <span>{{ user.email }}</span>
        <router-link to="/settings">Settings</router-link>
        <button @click="logout" class="link-button">Log Out</button>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.user = null;
      this.$router.push('/login');
    },
    getUserInfo() {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user = payload;
      }
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.getUserInfo();
    }
  },
  watch: {
    isAuthenticated(val) {
      if (val) {
        this.getUserInfo();
      }
    }
  }
};
</script>

<style>
nav {
  display: flex;
  gap: 1px;
}

.link-button {
  background: none;
  border: none;
  color: #280247f5; 
  cursor: pointer;
  padding: 0;
  text-decoration: underline; 
  font-size: 0.9em;
}

.link-button:hover {
  color: #2c3e50; 
}
</style>
