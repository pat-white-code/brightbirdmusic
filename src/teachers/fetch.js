const clientId = 1;
//fetch students by studentId
let globalTeachers;

async function getRequests(){
  let response = await fetch(`http://127.0.0.1:4001/api/subscriptions/requests/client/${clientId}`);
  let requests = await response.json();
  console.log('REQUESTS', requests);
  if(requests.length === 2) {getTeachersForTwo(requests)}
  requests.forEach(getTeachers);
}

async function getTeachersForTwo(requests) {
  let response = await fetch(`http://127.0.0.1:4001/api/teachers/two?instId=${requests[0].instrument_id}&zipCode=${requests[0].zip_code}&studentAge=${requests[0].student_age}&instId2=${requests[1].instrument_id}&studentAge2=${requests[1].student_age}`);
  let teachers = await response.json();
  teachers.forEach(teacher => teacher.combinedRequest = requests[0].lesson_duration + requests[1].lesson_duration);
  console.log('TEACHERS FOR TWO, ', teachers);
}

async function getTeachers(request) {
  let response = await (fetch(`http://127.0.0.1:4001/api/teachers/?instId=${request.instrument_id}&zipCode=${request.zip_code}&studentAge=${request.student_age}`));
  let teachers = await response.json();
  console.log('TEACHERS', teachers);
  teachers.forEach(getSchedule);
  // globalTeachers = teachers;
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

// getTeachers();
getRequests();

//add availability on each teacher.
//for each teacher
  //for each schedule,
    //for each lesson

    //create a new lessons starts at current lesson - drive time - lesson duration
    // create a new lesson: starts at currentLesson.endTime + drive time