import './style.css';
import { renderAanvragen } from './stagecommissie/aanvragen.js';
import { renderStudentDashboard } from './student/student.js';

const app = document.querySelector('#app');
const role = new URLSearchParams(window.location.search).get('role');

if (role === 'student') {
  renderStudentDashboard(app);
} else {
  renderAanvragen();
}
