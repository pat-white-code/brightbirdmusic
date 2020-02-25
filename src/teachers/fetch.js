const clientId = 1;
// fetch students by studentId
let globalTeachers = [];
let globalClient = {};
let globalRequests = [];
var directionsService = new google.maps.DirectionsService()

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
  teachers.forEach(teacher => teacher.requestedAddress = request.address);
  teachers.forEach(teacher => teacher.requestedTime = request.lesson_duration);
  request.availableTeachers = teachers;
};

async function getSchedule(teacher) {
  let request = await fetch(`http://127.0.0.1:4001/api/schedules/${teacher.teacher_id}`);
  let schedule = await request.json();
  schedule.forEach(schedule => {
    //converts each schedule start_time / end_time to moment.js objects.
    schedule.startTime = moment(schedule.start_time, 'YYYY-MM-DDTHH:mm:ss Z');
    schedule.endTime = moment(schedule.end_time, 'YYYY-MM-DDTHH:mm:ss Z');

    //formats start/times and end times for easier reading
    schedule.start_time = schedule.startTime.format('LL LT');
    schedule.end_time = schedule.endTime.format('LL LT');
  })
  //attaches schedule to teacher object
  teacher.schedule = schedule;

  //passes the requested time to the schedule object so it can be accessed by the lesson object
  schedule.forEach(schedule => schedule.requestedTime = teacher.requestedTime);
  schedule.forEach(schedule => schedule.requestedAddress = teacher.requestedAddress);
  teacher.schedule.forEach(getLessons);
}

async function fetchDriveTime(lesson, schedule) {
  let request = {
    origin: lesson.address,
    destination: schedule.requestedAddress,
    travelMode: 'DRIVING',
  }
  await directionsService.route(request, (result, status) => {
    if (status == 'OK') {
      console.log(result)
      lesson.driveTime = Math.ceil(result.routes[0].legs[0].duration.value / 60);
    }
    lesson.availabilityAfter = {
      lesson_duration: schedule.requestedTime,
      startMoment: lesson.endMoment.clone().add(lesson.driveTime, 'minutes')  
    }
    lesson.availabilityAfter.endMoment = lesson.availabilityAfter.startMoment.clone().add(schedule.requestedTime, 'minutes');
    lesson.availabilityAfter.description = lesson.availabilityAfter.startMoment.format('LL LT');

    lesson.availabilityBefore = {
      lesson_duration: schedule.requestedTime,
      startMoment: lesson.startMoment.clone().subtract(lesson.driveTime, 'minutes').subtract(schedule.requestedTime, 'minutes')
    }
    lesson.availabilityBefore.description = lesson.availabilityBefore.startMoment.format('LL LT');
  });
}

async function getLessons(schedule) {
  schedule.availabilities = [];
  let request = await fetch(`http://127.0.0.1:4001/api/schedules/lessons/${schedule.id}`);
  let lessons = await request.json();
  lessons.forEach(lesson => {
    //converts lesson start times / end times to moment.js objects
    lesson.startMoment = moment(lesson.day_time, 'YYYY-MM-DDTHH:mm:ss Z');
    console.log(`Lesson ${lesson.id} starts at `,lesson.startMoment.format('LL LT'));
    lesson.endMoment = lesson.startMoment.clone().add(lesson.duration, 'minutes');
    console.log(`Lesson ${lesson.id} ends at `,lesson.endMoment.format('LL LT'));
  });
  let promises = lessons.map(lesson => {
    fetchDriveTime(lesson, schedule);
  })
  schedule.lessons = lessons;
  let resolved = await Promise.all(promises);
  for(let i = 0 ; i < lessons.length ; i++) {
    let thisLesson = lessons[i];
    let nextLesson = lessons[i+1];
    let prevLesson = lessons[i-1];
    if(nextLesson) {
      //if lead lesson endTime + drive to next lesson does not conflict, add lesson to availabilities
      if(thisLesson.availabilityAfter.endMoment.clone().add(nextLesson.driveTime, 'minutes').valueOf() < nextLesson.startMoment.valueOf()) {
        schedule.availabilities.push(thisLesson.availabilityAfter);
      }
    }

    if(!nextLesson) {
      //to do this, we have to convert teacher start_times/end_times to date-time-stamps and convert it to moment object.
      if(thisLesson.availabilityAfter.endMoment.valueOf() < schedule.endTime.valueOf()) {
        schedule.availabilities.push(thisLesson.availabilityAfter)
      }
    }

    if(prevLesson) {
      //if i have a lesson that ends at 3:00 PM but is 20 minutes away, it will conflict
      if(availabilityBefore.startMoment.clone().subtract(prevLesson.driveTime, 'minutes').valueOf() > prevLesson.endMoment.valueOf()){
        schedule.availabilities.push(availabilityBefore)
      }
    }

    if(!prevLesson) {
      //if there is no previous lesson, and if availabilityBefore is not before the teacher's start time
      if(availabilityBefore.startMoment.valueOf() > schedule.startTime.valueOf()) {
        schedule.availabilities.push(availabilityBefore)
      }
    }
  }
}

async function filterConflicts(lessonsArr, schedule){
  
  for(let i = 0; i < lessonsArr.lengh ; i++) {

  }
}

getRequests();
