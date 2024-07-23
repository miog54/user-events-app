<template>
    <div>
      <h2>Home Page</h2>
      <button @click="showCreateUserForm">Create User</button>
      <div v-if="showUserForm || showUpdateUserForm">
        <form @submit.prevent="showUpdateUserForm ? updateUser() : createUser()">
          <input v-model="user.firstName" placeholder="First Name" required />
          <input v-model="user.lastName" placeholder="Last Name" required />
          <input v-model="user.email" placeholder="Email" type="email" required />
          <input v-model="user.phoneNumber" placeholder="Phone Number" required />
          <button type="submit">{{ showUpdateUserForm ? 'Update' : 'Save' }}</button>
          <button type="button" @click="cancelUpdate">Cancel</button>
        </form>
      </div>
      <user-table :users="users" :totalPages="totalPages" :currentPage="currentPage" @selectUser="selectUser" @userDeleted="fetchUsers" @updateUser="showUpdateUserForm = true; setUserToUpdate($event)" @sort="sortUsers" @changePage="changePage" />
    </div>
  </template>
  
  <script>
  import axios from '../axiosConfig';
  import UserTable from '@/components/UserTable.vue';
  
  export default {
    components: {
      UserTable
    },
    data() {
      return {
        users: [],
        showUserForm: false,
        showUpdateUserForm: false,
        user: {
          _id: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: ''
        },
        currentPage: 1,
        totalPages: 1,
        sortField: 'createdAt',
        sortOrder: 'asc'
      };
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get('/users', {
            params: {
              page: this.currentPage,
              limit: 10,
              sortField: this.sortField,
              sortOrder: this.sortOrder
            }
          });
          console.log(response.data);
          this.users = response.data.users;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      showCreateUserForm() {
        this.showUserForm = true;
        this.showUpdateUserForm = false;
      },
      async createUser() {
        try {
          await axios.post('/users', this.user);
          this.showUserForm = false;
          this.user = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
          };
          this.fetchUsers();
        } catch (error) {
          console.error('Error creating user:', error);
        }
      },
      async updateUser() {
        try {
          await axios.put(`/users/${this.user._id}`, this.user);
          this.showUpdateUserForm = false;
          this.user = {
            _id: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
          };
          this.fetchUsers();
        } catch (error) {
          console.error('Error updating user:', error);
        }
      },
      cancelUpdate() {
        this.showUpdateUserForm = false;
        this.user = {
          _id: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: ''
        };
      },
      setUserToUpdate(user) {
        this.user = { ...user };
      },
      selectUser(userId) {
        this.$router.push(`/user/${userId}`);
      },
      sortUsers({ field, order }) {
        this.sortField = field;
        this.sortOrder = order;
        this.fetchUsers();
      },
      changePage(page) {
        this.currentPage = page;
        this.fetchUsers();
      }
    },
    created() {
      this.fetchUsers();
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    text-align: left;
    cursor: pointer;
  }
  
  button {
    margin-bottom: 20px;
  }
  </style>
  