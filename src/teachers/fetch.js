const student = {
  instId: 1,
  zipCode: 78746,
  age: 6
}

async function getTeachers() {
  let response = await (fetch(`http://127.0.0.1:4001/api/teachers/?instId=${student.instId}&zipCode=${student.zipCode}&studentAge=${student.age}`));
  let teachers = await response.json();
  console.log('TEACHERS', teachers);
  teachers.forEach(getSchedule);
};

async function getSchedule(teacher) {
  let request = await fetch(`http://127.0.0.1:4001/api/schedules/${teacher.teacher_id}`);
  let schedule = await request.json();
  teacher.schedule = schedule;
  teacher.schedule.forEach(getLessons);
}

async function getLessons(schedule) {
  let request = await fetch(`http://127.0.0.1:4001/api/schedules/lessons/${schedule.id}`);
  let lessons = await request.json();
  schedule.lessons = lessons;
}

const fetchResponse = () => {
  fetch('/api/')
    .then(res => res.json());
}

getTeachers();

// const fetchPokeOne = (name) => {
//   fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
//   .then(res => res.json())
//   .then(json => {playerOne = json})
// }

// localhost:4001/api/teachers?instId=${student.instId}&zipCode=${student.zipCode}&student_age=${student.age}