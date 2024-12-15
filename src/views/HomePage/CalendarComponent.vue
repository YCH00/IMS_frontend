<template>
  <div class="calendar">
    <div class="month">
      <button @click="prevMonth">&lt;</button>
      <span>{{ currentMonth }} {{ currentYear }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="days">
        <span v-for="day in daysInMonth" :key="day" :class="{ today: isToday(day) }">
          {{ day }}
        </span>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';

const currentYear = ref(new Date().getFullYear());  // Change this to a ref
const currentMonth = ref(new Date().getMonth());
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function prevMonth() {
  currentMonth.value--;
  if (currentMonth.value < 0) {
    currentMonth.value = 11;
    // currentYear--;
  }
}

function nextMonth() {
  currentMonth.value++;
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    // currentYear++;
  }
}

const daysInMonth = computed(() => {
  const startDay = new Date(currentYear, currentMonth.value);
  const days = []; // 初始化数组
  for (let i = 1; i <= new Date(currentYear, currentMonth.value + 1, 0).getDate(); i++) {
    days.push(i);
  }
  return days;
});

function isToday(day) {
  const today = new Date();
  return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.value &&
      today.getFullYear() === currentYear
  );
}
</script>

<style scoped>
.calendar {
  text-align: center;
  margin: 20px;
}

.month {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.weekdays, .days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.days span {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.days span.today {
  background-color: #4CAF50;
  color: white;
}
</style>