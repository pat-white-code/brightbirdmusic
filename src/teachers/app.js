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
  this.startTime = startTime;
  this.endTime = endTime;
};

Lesson.prototype.isAvailableBefore(lessonDuration, driveDuration) {
  for (i = 0 ; i < lessons.length ; i++) {
    if(!(this === lessons[i])) {
      if(this.startTime - lessonDuration - driveDuration > lessons[i].endTime) {return true}
    }
  }

};

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}