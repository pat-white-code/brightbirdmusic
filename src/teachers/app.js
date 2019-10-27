console.log('app.js Here!')

let teachers = [
  {
    name: {
    first: 'Jim',
    last: 'Foster'
  },
    instruments: [{
      name: 'guitar',
      minAge: 6,
      maxExp: 10,
      styles: ['classical', 'jazz', 'gypsey jazz', 'pop', 'rock'],
      skills: ['songwriting', 'improvisation']
    }],
    calendar: [ //"schedule"
    {
      start: moment('10/28/19 3:00 PM', 'MM/DD/YY hh:mm a'),
      end: moment('10/28/19 8:00 PM', 'MM/DD/YY hh:mm a'),
      scheduledLessons: [],
      availability: []
    }
  ]
}
];


function Lesson(startTime, lessonMinutes){
  this.startTime = moment(startTime, 'MM/DD/YY hh:mm a');
  this.startTime._i = this.startTime.format("MM/DD/YY hh:mm a");
  this.endTime = this.startTime.clone().add(lessonMinutes, 'minutes');
  this.endTime._i = this.endTime.format("MM/DD/YY hh:mm a");
  // this.endTime = moment (endTime, 'MM/DD/YY hh:mm a');
};

const lesson1 = new Lesson('10/28/19 3:30 PM', 30);
const lesson2 = new Lesson('10/28/19 4:30 PM', 30);
const lesson3 = new Lesson('10/28/19 6:00 PM', 30);


teachers['0']['calendar'][0]['scheduledLessons'].push(lesson1);
teachers['0']['calendar'][0]['scheduledLessons'].push(lesson2);
teachers['0']['calendar'][0]['scheduledLessons'].push(lesson3);


const potentialAvailabilityDraft = (newDuration, newAddress) => {
  let currentLessons = teachers['0']['calendar'][0]['scheduledLessons'];
  currentLessons.forEach(lesson => {
    const lessonBefore = makeLessonBeforeDraft(lesson.startTime, lesson.address, newDuration, newAddress);
    const lessonAfter = makeLessonAfterDraft()
  });
};


function makeLessonBeforeDraft(currentStart, currentAddress, newDuration, newAddress){

  //Fetch Drive data from GoogleAPI
  //Destination = currentAddress
  //Departure = newAddress
  //ArrivesBy = currentStart

  //driveDuration = returned from Google plus 3(
  //newStartTime = currentStart.clone().subtract(travelDuration, 'minutes').subtract(lessonDuration. 'minutes').subtact(1, 'minute') until result is divisible by 5(3:05, 4:10 example);
  //const newLesson = newLesson(newStartTime, newDuration, newAddress);
  //return new lesson;
}

function makeLessonAfterDraft(currentEnd, currentAddress, newDuration, newAddress){

  //Fetch Drive data from GoogleAPI
  //Destination = newAddress;
  //Departure = currentAddress
  //Departs at = currentEnd

  //driveDuration = returned from Google plus 3 minutes
  //newStartTime = currentEnd.clone().add(driveDuration, 'minutes').add(1, 'minute') until result is divisible by 5(3:05, 4:10 example);
  //const newLesson = newLesson(newStartTime, newDuration, newAddress);
  //return new lesson;
}

function potentialAvailability (lessonDuration, travelDuration) {
  let currentLessons = teachers['0']['calendar'][0]['scheduledLessons'];
  currentLessons.forEach(lesson => {
  
    const lessonBefore = makeLessonBefore(lesson.startTime, lessonDuration, travelDuration);
    teachers['0']['calendar'][0]['availability'].push(lessonBefore);

    const lessonAfter = makeLessonAfter(lesson.endTime, lessonDuration, travelDuration);
    teachers['0']['calendar'][0]['availability'].push(lessonAfter);
  });
}

function makeLessonBefore(momentStart, lessonDuration, travelDuration){
  
  newStartTime = momentStart.clone().subtract(lessonDuration, 'minutes').subtract(travelDuration, 'minutes');
  const newLesson = new Lesson(newStartTime, lessonDuration);
  return newLesson;
}

function makeLessonAfter(momentEnd, lessonDuration, travelDuration) {
  newStartTime = momentEnd.clone().add(travelDuration, 'minutes');
  const newLesson = new Lesson(newStartTime, lessonDuration);
  return newLesson;
}

// const sameLessonTime = (startTime1, startTime2) => {
//   !(startTime1 === startTime2);
// }

// const endsTooLate = (startTime1, startTime2, endTime1) => {
//   (startTime1 < startTime2 && endTime1 > startTime2);
// }

// const startsTooSoon = (startTime1, startTime2, endTime2) => {
//   !(startTime1 > startTime2 && startTime1 < endTime2);
// }

function filterConflicts(){ //WORKS!
  let potentialLessons = teachers['0']['calendar'][0]['availability'];
  let scheduledLessons = teachers['0']['calendar'][0]['scheduledLessons'];


  scheduledLessons.forEach(lesson => {
    //return only new lessons that do not have the same start time as this current lesson
    potentialLessons = potentialLessons.filter(newLesson => !(newLesson.startTime.valueOf() === lesson.startTime.valueOf()));

    //return only new lessons that do not run into this current lessons
    potentialLessons = potentialLessons.filter(newLesson => !(newLesson.startTime.valueOf() < lesson.startTime.valueOf() && newLesson.endTime.valueOf() > lesson.startTime.valueOf()));

    //return only new lessons that do not start while this lesson is happening
    potentialLessons = potentialLessons.filter(newLesson => !(newLesson.startTime.valueOf() > lesson.startTime.valueOf() && newLesson.startTime.valueOf() < lesson.endTime.valueOf()))

  });
  teachers['0']['calendar'][0]['availability'] = potentialLessons;
}


potentialAvailability(30, 15);

// console.log(moment().format());


//function takes in current lessons array and new lessons array.

//filter the current lessons array for each current lesson.

//save the current lessons array as the filtered array.

//const filtered array = lesson.filter.c

filterConflicts();
