<template>
    <div>
      
      <h2>{{ user.firstName }} {{ user.lastName }} events</h2>
      <button @click="showCreateEventForm">Create Event</button>
      <event-table :events="user.events" :userId="user._id" :totalPages="totalPages" :currentPage="currentPage" @eventDeleted="fetchUserEvents" @updateEvent="showUpdateEventForm = true; setEventToUpdate($event)" @sort="sortEvents" @changePage="changePage" />
      <div v-if="showEventForm || showUpdateEventForm">
        <form @submit.prevent="showUpdateEventForm ? updateEvent() : createEvent()">
          <input v-model="event.title" placeholder="Title" required />
          <input v-model="event.description" placeholder="Description" required />
          <input v-model="event.startDate" type="datetime-local" placeholder="Start Date" required />
          <input v-model="event.endDate" type="datetime-local" placeholder="End Date" required />
          <button type="submit">{{ showUpdateEventForm ? 'Update' : 'Save' }}</button>
          <button type="button" @click="cancelUpdate">Cancel</button>
        </form>
        <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../axiosConfig';
  import EventTable from '@/components/EventTable.vue';
  
  export default {
    components: {
      EventTable
    },
    data() {
      return {
        user: {
          events: []
        },
        event: {
          _id: '',
          title: '',
          description: '',
          startDate: '',
          endDate: ''
        },
        showEventForm: false,
        showUpdateEventForm: false,
        errorMessage: '',
        currentPage: 1,
        totalPages: 1,
        sortField: 'startDate',
        sortOrder: 'asc'
      };
    },
    methods: {
      async fetchUser() {
        try {
          const response = await axios.get(`/users/${this.$route.params.id}`, {
            params: {
              page: this.currentPage,
              limit: 10,
              sortField: this.sortField,
              sortOrder: this.sortOrder
            }
          });
          console.log(response.data); 
          this.user = response.data.user;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      },
      showCreateEventForm() {
        this.showEventForm = true;
        this.showUpdateEventForm = false;
        this.resetEventForm();
      },
      async createEvent() {
        try {
          await axios.post(`/users/${this.user._id}/events`, this.event);
          this.showEventForm = false;
          this.resetEventForm();
          this.fetchUserEvents();
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = error.response.data.error || 'Error creating event';
          console.error('Error creating event:', error);
        }
      },
      async updateEvent() {
        try {
          await axios.put(`/users/${this.user._id}/events/${this.event._id}`, this.event);
          this.showUpdateEventForm = false;
          this.resetEventForm();
          this.fetchUserEvents();
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = error.response.data.error || 'Error updating event';
          console.error('Error updating event:', error);
        }
      },
      cancelUpdate() {
        this.showUpdateEventForm = false;
        this.resetEventForm();
      },
      setEventToUpdate(event) {
        this.event = { ...event };
        this.showEventForm = true;
        this.showUpdateEventForm = true;
      },
      async fetchUserEvents() {
        try {
          await this.fetchUser();
          this.showEventForm = false;
        } catch (error) {
          console.error('Error fetching user events:', error);
        }
      },
      resetEventForm() {
        this.event = {
          _id: '',
          title: '',
          description: '',
          startDate: '',
          endDate: ''
        };
      },
      goHome() {
        this.$router.push('/');
      },
      sortEvents({ field, order }) {
        this.sortField = field;
        this.sortOrder = order;
        this.fetchUserEvents();
      },
      changePage(page) {
        this.currentPage = page;
        this.fetchUserEvents();
      }
    },
    created() {
      this.fetchUser();
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
  