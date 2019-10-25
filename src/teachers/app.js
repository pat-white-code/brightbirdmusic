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
    schedule: [
    {
      type: 'lesson',
      startTime: new Date('Fri oct 25 15:30:00 GMT-500'),
      endTime: new Date('Fri oct 25 16:00:00 GMT'),
      duration: 30*60*1000,
      address: '1200 Westlake Dr, Austin, TX 78746'
    }]
}
];

function Lesson(startTime, endTime) {
  this.startTime = new Date(startTime);
  this.endTime = new Date(endTime);
};

const lesson1 = new Lesson('Mon oct 28 15:30:00 GMT-500', 'Mon oct 28 16:00:00 GMT-500');
const lesson2 = new Lesson('Mon oct 28 16:15:00 GMT-500', 'Mon oct 28 16:45:00 GMT-500');
const lesson3 = new Lesson('Mon oct 28 18:30:00 GMT-500', 'Mon oct 28 19:00:00 GMT-500');


teachers['0']['schedule'].push(lesson1);
teachers['0']['schedule'].push(lesson2);
teachers['0']['schedule'].push(lesson3);


function potentialAvailability (lessonDuration, travelDuration) {
  let potentialLessons = []
  let currentLessons = teachers['0']['schedule']
  currentLessons.forEach(lesson => {
    const lessonBefore = makeLessonBefore(lessonDuration, travelDuration);
    potentialLessons.push(lessonBefore);
    const lessonAfter = makeLessonAfter(lessonDuration, travelDuration);
    potentialLessons.push(lessonAfter);
  })
  return potentialLessons;
}

function makeLessonBefore(lessonDuration, travelDuration){
  newStartTime = new Date (this.startTime - lessonDuration - travelDuration);
  newEndTime = new Date (this.startTime + lessonDuration);
  const newLesson = new Lesson(newStartTime, newEndTime);
  return newLesson
}

function makeLessonAfter(lessonDuration, travelDuration) {
  newStartTime = new Date(this.endTime + travelDuration);
  newEndTime = new Date(this.endTime + travelDuration + lessonDuration);
  const newLesson = new Lesson(newStartTime, newEndTime);
  return newLesson
}

potentialAvailability(30*60*1000, 15*16*1000);