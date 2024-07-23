<template>
    <div>
      <form @submit.prevent="createEvent">
        <input v-model="event.title" placeholder="Title" required />
        <input v-model="event.description" placeholder="Description" required />
        <input v-model="event.startDate" type="datetime-local" placeholder="Start Date" required />
        <input v-model="event.endDate" type="datetime-local" placeholder="End Date" required />
        <button type="submit">Save</button>
      </form>
      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import axios from '../axiosConfig';
  
  export default {
    props: ['userId'],
    data() {
      return {
        event: {
          title: '',
          description: '',
          startDate: '',
          endDate: ''
        },
        errorMessage: ''
      };
    },
    methods: {
      async createEvent() {
        try {
          await axios.post(`/users/${this.userId}/events`, this.event);
          this.$emit('eventCreated');
          this.event = { title: '', description: '', startDate: '', endDate: '' };
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = error.response.data.error;
        }
      }
    }
  };
  </script>
  