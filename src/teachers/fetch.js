const clientId = 1;
// fetch students by studentId
let globalTeachers = [];
let globalClient = {};
let globalRequests = [];
var directionsService = new google.maps.DirectionsService();
let fetchDelay = 0;

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

function fetchDriveTime(lesson, schedule) {
  let origin = lesson.address.replace(/\d+ /, "");
  origin = origin.replace(/ /g, "+");
  let destination = schedule.requestedAddress.replace(/\d+ /, "");
  destination = destination.replace(/ /g, "+");
  console.log('ORIGIN', origin);
  console.log('DESTINATION', destination);
  if(origin == destination) {return new Promise((resolve,reject)=> {
    lesson.driveTime = 0;
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
    resolve(lesson)
  })}
  return fetch(`http://127.0.0.1:4001/api/driveTimes?origin=${origin}&destination=${destination}`)
    .then(res=> res.json())
    .then(json => {
      lesson.driveTime = Math.ceil(json[0].drive_time_seconds / 60)
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
    })

  // let request = {
  //   origin: lesson.address,
  //   destination: schedule.requestedAddress,
  //   travelMode: 'DRIVING',
  // }

  // return new Promise((resolve, reject)=> {
    
    //delays fetch so it does not trigger overQueryLimit Error
    
    // fetchDelay = fetchDelay + 200;
    // setTimeout(()=> {
    //   directionsService.route(request, (result, status) => {
    //     if (status == 'OK') {
    //       console.log(result)
    //       lesson.driveTime = Math.ceil(result.routes[0].legs[0].duration.value / 60);
    //     }
    //     lesson.availabilityAfter = {
    //       lesson_duration: schedule.requestedTime,
    //       startMoment: lesson.endMoment.clone().add(lesson.driveTime, 'minutes')  
    //     }
    //     lesson.availabilityAfter.endMoment = lesson.availabilityAfter.startMoment.clone().add(schedule.requestedTime, 'minutes');
    //     lesson.availabilityAfter.description = lesson.availabilityAfter.startMoment.format('LL LT');
    
    //     lesson.availabilityBefore = {
    //       lesson_duration: schedule.requestedTime,
    //       startMoment: lesson.startMoment.clone().subtract(lesson.driveTime, 'minutes').subtract(schedule.requestedTime, 'minutes')
    //     }
    //     lesson.availabilityBefore.description = lesson.availabilityBefore.startMoment.format('LL LT');
    //     resolve(lesson)
    //   });
    // }, fetchDelay)
  // })
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
  console.log('LESSONS', lessons)
  for(let i = 0 ; i < lessons.length ; i++) {
    //if a lesson is sandwiched in between a previous lesson / schedule.start time and next lesson / schedule.endTime it is not openEnded. Therefore it is not worth fetch a drive time, because there is no time for a lesson in between

    let thisLesson = lessons[i];
    let nextLesson = lessons[i+1];
    let prevLesson = lessons[i-1];
    thisLesson.openEnded = true;

    //if there is no previous lesson, substitute the schedule start time
    if(!prevLesson) {
      prevLesson = {};
      prevLesson.endMoment = schedule.startTime
    }

    //if there is no next lesson, substitute the schedule.endTime
    if(!nextLesson) {
      nextLesson = {};
      nextLesson.startMoment = schedule.endTime
    }

    //if next lesson starts 30 minutes or less after this lesson ends and previous lesson ended 30 minutes or less before this lesson starts
    if((nextLesson.startMoment.valueOf() - thisLesson.endMoment.valueOf() < 1800000) && (thisLesson.startMoment.valueOf() - prevLesson.endMoment.valueOf() < 1800000)) {
      thisLesson.openEnded = false
    }
  }

  //filter out 'landlocked' lessons so that their drivetime is not calculated
  lessons = lessons.filter(lesson => lesson.openEnded)

  let promises = lessons.map(lesson => {
    return fetchDriveTime(lesson, schedule);
  })

  console.log('PROMISES', promises);

  //attaches lessons to the schedule object
  schedule.lessons = lessons;

  //once all the relevant drive times are fetched...
  let resolved = await Promise.all(promises);
  console.log('RESOLVED:::', resolved);
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
      if(thisLesson.availabilityBefore.startMoment.clone().subtract(prevLesson.driveTime, 'minutes').valueOf() > prevLesson.endMoment.valueOf()){
        schedule.availabilities.push(thisLesson.availabilityBefore)
      }
    }

    if(!prevLesson) {
      //if there is no previous lesson, and if availabilityBefore is not before the teacher's start time
      if(thisLesson.availabilityBefore.startMoment.valueOf() > schedule.startTime.valueOf()) {
        schedule.availabilities.push(thisLesson.availabilityBefore)
      }
    }
  }
}

getRequests();
