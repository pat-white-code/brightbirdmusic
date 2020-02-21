const clientId = 1;
//fetch students by studentId

const student = {
  instId: 1,
  zipCode: 78746,
  age: 6
}

let globalTeachers;

async function getTeachers() {
  let response = await (fetch(`http://127.0.0.1:4001/api/teachers/?instId=${student.instId}&zipCode=${student.zipCode}&studentAge=${student.age}`));
  let teachers = await response.json();
  console.log('TEACHERS', teachers);
  teachers.forEach(getSchedule);
  globalTeachers = teachers;
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
  lessons.forEach(lesson => {
    lesson.startMoment = moment(lesson.day_time, 'YYYY-MM-DDTHH:mm:ss Z');
    console.log(`Lesson ${lesson.id} starts at `,lesson.startMoment.format('LL LT'));
    lesson.endMoment = lesson.startMoment.clone().add(lesson.duration, 'minutes');
    console.log(`Lesson ${lesson.id} ends at `,lesson.endMoment.format('LL LT'));
  });
  schedule.lessons = lessons;

  //convert each lesson start_time and end_time to moment.js
  //startime = "15:30:00"
}

const fetchResponse = () => {
  fetch('/api/')
    .then(res => res.json());
}

getTeachers();

//add availability on each teacher.
//for each teacher
  //for each schedule,
    //for each lesson

    //create a new lessons starts at current lesson - drive time - lesson duration
    // create a new lesson: starts at currentLesson.endTime + drive time