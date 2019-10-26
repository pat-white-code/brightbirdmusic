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
const lesson2 = new Lesson('10/28/19 4:15 PM', 30);
const lesson3 = new Lesson('10/28/19 5:00 PM', 30);


teachers['0']['calendar'][0]['scheduledLessons'].push(lesson1);
teachers['0']['calendar'][0]['scheduledLessons'].push(lesson2);
teachers['0']['calendar'][0]['scheduledLessons'].push(lesson3);




function potentialAvailability (lessonDuration, travelDuration) {
  let currentLessons = teachers['0']['calendar'][0]['scheduledLessons'];
  currentLessons.forEach(lesson => {
    const lessonBefore = makeLessonBefore(lesson.startTime, lessonDuration, travelDuration);
    teachers['0']['calendar'][0]['availability'].push(lessonBefore);
    const lessonAfter = makeLessonAfter(lesson.endTime, lessonDuration, travelDuration);
    teachers['0']['calendar'][0]['availability'].push(lessonAfter);
  });
}

const sameLessonTime = (startTime1, startTime2) => {
  !(startTime1 === startTime2);
}

const endsTooLate = (startTime1, startTime2, endTime1) => {
  !(startTime1 < startTime2 && endTime1 > startTime2);
}

const startsTooSoon = (startTime1, startTime2, endTime2) => {
  !(startTime1 > startTime2 && startTime1 < endTime2);
}


function filteredLessons(lessonArray, currentLesson){
  let start1 = currentLesson.startTime.valueOf;
  let start2 = lesson2.startTime.valueOf;
  let end1 = currentLesson.endTime.valueOf;
  let end2 = lesson2.endTime.valueOf;
  const filter1 = lessonArray.filter(sameLessonTime());
}

const filterLessons = (arr, startTime, endTime) => {
  startTime = this.startTime.valueOf;
  endTime = this.endTime.valueOf;
  return arr.filter(lesson => sameLessonTime(lesson.startTime, lesson.endTime, startTime, endTime));
};


function qualifyAvailability(){
  //stores location of lists:
  let potentialLessons = teachers['0']['calendar'][0]['availability'];
  let scheduledLessons = teachers['0']['calendar'][0]['scheduledLessons'];
  //For every potential lesson:
    for (i = 0 ; i < potentialLessons.length ; i++) {
      //Creates variables to store new lesson[i] info:
      let startTime = potentialLessons[i].startTime.valueOf();
      let endTime = potentialLessons[i].endTime.valueOf();
      //look at every lesson on teacher's schedule
      for (j = 0 ; j < scheduledLessons.length ; j++) {

        //create variables to store current lesson[j] info:
        let currentStartTime = scheduledLessons[j].startTime.valueOf();
        let currentEndTime = scheduledLessons[j].endTime.valueOf();

        //Check for conflicts
        //check if lesson starts at the same time as this lesson or starts right when another lesson ends
        if (startTime === currentStartTime || startTime === currentEndTime){
          //remove item
          potentialLessons.splice(i, 1);
        } else 

        //check if new lesson starts before current lesson, but runs into current lesson
        if (startTime < currentStartTime && endTime >= currentStartTime) {
          //remove item
          potentialLessons.splice(i, 1);
        } else

        //check if new lesson starts after current lesson starts but before current lesson ends:
        if (startTime > currentStartTime && startTime <= currentEndTime){
          //remove item
          potentialLessons.splice(i, 1);
        } else {
          console.log(`${potentialLessons[i]} does not conflict with ${scheduledLessons[j]}`) //for testing
        } 
      }
    }
  
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

potentialAvailability(30, 15);

// console.log(moment().format());
