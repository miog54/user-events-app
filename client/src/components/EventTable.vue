<template>
    <div>
      <table>
        <thead>
          <tr>
            <th @click="sort('title')">Title</th>
            <th @click="sort('description')">Description</th>
            <th @click="sort('startDate')">Start Date</th>
            <th @click="sort('endDate')">End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event._id">
            <td>{{ event.title }}</td>
            <td>{{ event.description }}</td>
            <td>{{ new Date(event.startDate).toLocaleString() }}</td>
            <td>{{ new Date(event.endDate).toLocaleString() }}</td>
            <td>
              <button @click="deleteEvent(event._id)">Delete</button>
              <button @click="$emit('updateEvent', event)">Update</button>
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
    props: {
      events: {
        type: Array,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      totalPages: {
        type: Number,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        sortField: '',
        sortOrder: 'asc'
      };
    },
    methods: {
      async deleteEvent(eventId) {
        try {
          await axios.delete(`/users/${this.userId}/events/${eventId}`);
          this.$emit('eventDeleted');
        } catch (error) {
          console.error('Error deleting event:', error);
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
    },
    mounted() {
      console.log(this.events);
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
  