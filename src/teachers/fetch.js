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
  // requests.forEach(request => console.log('*********', request.availableTeachers));
  // globalRequests[0].forEach(calculateAvailability);
}

// async function calculateAvailability (request) {

//   request.availableTeachers.forEach(teacher => {
//     teacher.schedules.forEach(schedule => {
//       schedule.lessons.forEach((lesson, index) => {
//         console.log(request.lesson_duration, request.instrument_id, index, index+1, lesson.startMoment, lesson.endMoment)
//       })
//     })
//   })
// };

async function getTeachersForTwo(requests) {
  let response = await fetch(`http://127.0.0.1:4001/api/teachers/two?instId=${requests[0].instrument_id}&zipCode=${requests[0].zip_code}&studentAge=${requests[0].student_age}&instId2=${requests[1].instrument_id}&studentAge2=${requests[1].student_age}`);
  let teachers = await response.json();
  teachers.forEach(teacher => teacher.combinedRequest = requests[0].lesson_duration + requests[1].lesson_duration);
  console.log('TEACHERS FOR TWO, ', teachers);
}

async function getTeachers(request) {
  let response = await fetch(`http://127.0.0.1:4001/api/teachers/?instId=${request.instrument_id}&zipCode=${request.zip_code}&studentAge=${request.student_age}`);
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

  // lessons.forEach(lesson => {
  //   let lessonBefore = lesson.startMoment.clone().subtract(lesson.driveTime, 'minutes').subtract(schedule.requestedTime, 'minutes');
  //   lessonBefore.details = lessonBefore.format('LL LT');
  //   let lessonAfter = lesson.endMoment.clone().add(lesson.driveTime, 'minutes');
  //   lessonAfter.details = lessonAfter.format('LL LT');
  //   schedule.availabilities.push(lessonBefore, lessonAfter);
  // })
  //schedule.availabilities.push(startMoment.clone().subtract('DriveTime + lessonDuration'))
  for(let i = 0 ; i < lessons.length ; i++) {
    let driveTime;
    let lessonAfter;
    let lessonBefore;
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
    if (thisLesson.openEnded){
      //calculate drive time
      thisLesson.driveTime = 15;

      availabilityAfter = {
        lesson_duration: schedule.requestedTime,
        startMoment: thisLesson.endMoment.clone().add(thisLesson.driveTime, 'minutes')
      }
      availabilityAfter.endMoment = availabilityAfter.startMoment.clone().add(schedule.requestedTime, 'minutes');
      availabilityAfter.description = availabilityAfter.startMoment.format('LL LT');

      if(nextLesson) {
        //if there is a next lesson, calculate the drive time from new lesson to next lesson
        //calculate drivetime
        nextLesson.driveTime = 15;

        //if lead lesson endTime + drive to next lesson does not conflict, add lesson to availabilities
        if(availabilityAfter.endMoment.clone().add(nextLesson.DriveTime, 'minutes').valueOf() < nextLesson.startMoment.valueOf()) {
          schedule.availabilities.push(availabilityAfter);
        }
      }

      //if there is no next lesson, see if lead lesson conflicts with schedule.endTime. if it does not conflict, add it to the availabilities
      if(!nextLesson) {
        //to do this, we have to convert teacher start_times/end_times to date-time-stamps and convert it to moment object.
        if(availabilityAfter.endMoment.clone()){}
      }
    }
  }
  //if openended = true, calculate drive time,
  //create new lesson before and after this lesson
  //lesson after this lesson has a start time of current lesson momentEnd + drive time in minutes
  //if lessonAfter end time + next lesson drive time is greater than next lesson start time, do nothing. otherwise, add it to availability

  //filter out only openended lessons
  //calculate drive time
  //create lesson at current lesson end + drive time
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