<template>
    <div>
      <table>
        <thead>
          <tr>
            <th @click="sort('firstName')">UserName</th>
            <th @click="sort('email')">Email</th>
            <th @click="sort('phoneNumber')">PhoneNumber</th>
            <th>Events Count</th>
            <th @click="sort('nextEventDate')">Next Event Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td @click="$emit('selectUser', user._id)">{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phoneNumber }}</td>
            <td>{{ user.events ? user.events.length : 0 }}</td>
            <td>{{ nextEventDate(user.events) }}</td>
            <td>
              <button @click="deleteUser(user._id)">Delete</button>
              <button @click="$emit('updateUser', user)">Update</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../axiosConfig';
  
  export default {
    props: ['users', 'totalPages', 'currentPage'],
    data() {
      return {
        sortField: '',
        sortOrder: 'asc'
      };
    },
    methods: {
      nextEventDate(events) {
        if (!events || events.length === 0) return 'N/A';
        const now = new Date();
        const upcomingEvents = events.filter(event => new Date(event.startDate) > now);
        if (upcomingEvents.length === 0) return 'N/A';
        const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return new Date(sortedEvents[0].startDate).toLocaleString();
      },
      async deleteUser(userId) {
        try {
          await axios.delete(`/users/${userId}`);
          this.$emit('userDeleted', userId);
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      },
      sort(field) {
        this.sortOrder = this.sortField === field && this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.sortField = field;
        this.$emit('sort', { field, order: this.sortOrder });
      },
      prevPage() {
        this.$emit('changePage', this.currentPage - 1);
      },
      nextPage() {
        this.$emit('changePage', this.currentPage + 1);
      }
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
  