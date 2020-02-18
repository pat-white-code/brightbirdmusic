array = [event1, event2, event3];

Event.prototype.detectConflict = () => {
  for(i = 0 ; i < array.length ; i++) {
    if (!(array[i] === this)) { 
      if (this.startTime === array[i].startTime) {
        console.log('CONFLICT DETECTED')
      }
    }
  }
}