const clientId = 1;
//fetch students by studentId
let globalTeachers = [];
let globalClient = {};
let globalRequests = [];

async function getRequests(){
  let response = await fetch(`http://127.0.0.1:4001/api/subscriptions/requests/client/${clientId}`);
  let requests = await response.json();
  console.log('REQUESTS', requests);
  globalClient.zipCode = requests[0].zip_code;
  if(requests.length === 2) {getTeachersForTwo(requests)}
  requests.forEach(getTeachers);
  globalRequests.push(requests);
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
  console.log(`TEACHERS FOR ${request.first_name} on ${request.instrument_name}`, teachers);
  teachers.forEach(getSchedule);
  teachers.forEach(teacher => teacher.requestedTime = request.lesson_duration);
  request.availableTeachers = teachers;
};

async function getSchedule(teacher) {
  let request = await fetch(`http://127.0.0.1:4001/api/schedules/${teacher.teacher_id}`);
  let schedule = await request.json();
  teacher.schedule = schedule;
  schedule.forEach(schedule => schedule.requestedTime = teacher.requestedTime);
  teacher.schedule.forEach(getLessons);
}

async function getLessons(schedule) {
  schedule.availabilities = [];
  let request = await fetch(`http://127.0.0.1:4001/api/schedules/lessons/${schedule.id}`);
  let lessons = await request.json();
  lessons.forEach(lesson => {
    // DUMMY CODE --- FETCH drivetime from google using globalClient.address
    lesson.driveTime = 15;
    lesson.startMoment = moment(lesson.day_time, 'YYYY-MM-DDTHH:mm:ss Z');
    console.log(`Lesson ${lesson.id} starts at `,lesson.startMoment.format('LL LT'));
    lesson.endMoment = lesson.startMoment.clone().add(lesson.duration, 'minutes');
    console.log(`Lesson ${lesson.id} ends at `,lesson.endMoment.format('LL LT'));
  });
  //lessons.forEach
  lessons.forEach(lesson => {
    let lessonBefore = lesson.startMoment.clone().subtract(lesson.driveTime, 'minutes').subtract(schedule.requestedTime, 'minutes');
    lessonBefore.details = lessonBefore.format('LL LT');
    let lessonAfter = lesson.endMoment.clone().add(lesson.driveTime, 'minutes');
    lessonAfter.details = lessonAfter.format('LL LT');
    schedule.availabilities.push(lessonBefore, lessonAfter);
  })
  //schedule.availabilities.push(startMoment.clone().subtract('DriveTime + lessonDuration'))
  for(let i = 0 ; i < lessons.length ; i++) {
    let thisLesson = lessons[i];
    let nextLesson = lessons[i+1];
    let prevLesson = lessons[i-1];
    thisLesson.openEnded = true;
    if(prevLesson && nextLesson) {
      //if next lesson starts in 30-minutes or less, AND previous lesson ended in 30-minutes or less, consider this lesson LOCKED. there is no room to schedule lesssons before/after, so it is not worth calculating the drive time or doing any other calculations

      if(nextLesson.startMoment - thisLesson.endMoment <= 180000 && thisLesson.startMoment - prevLesson.endMoment <= 180000) {
        thisLesson.openEnded = false;
      }
    }
  }
  schedule.lessons = lessons;
  // TODO: schedule.availabilities.filterConflicts(schedule.lessons)
}

// getTeachers();
getRequests();

//add availability on each teacher.
//for each teacher
  //for each schedule,
    //for each lesson

    //create a new lessons starts at current lesson - drive time - lesson duration
    // create a new lesson: starts at currentLesson.endTime + drive time