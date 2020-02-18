const student = {
  instId: 1,
  zipCode: 78746,
  age: 6
}

const getTeachers = () => {
  fetch(`../../api/teachers/?instId=1&zipCode=78746&studentAge=6`)
    .then(res => console.log(res));
    // .then(json => console.log(json));
}

const fetchResponse = () => {
  fetch('/api/')
    .then(res => res.json());
}

getTeachers();

// const fetchPokeOne = (name) => {
//   fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
//   .then(res => res.json())
//   .then(json => {playerOne = json})
// }

// localhost:4001/api/teachers?instId=${student.instId}&zipCode=${student.zipCode}&student_age=${student.age}