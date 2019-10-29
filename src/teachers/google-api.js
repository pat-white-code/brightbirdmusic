const googleApiKey = 'AIzaSyAzq7W-eXQNz0ptPkQqWi9LBluABETr7Zs';

const travelDisplay = document.getElementById('travel-time');

const origins = "7412+Poinsetta+Ln+Austin+TX+78746";

const destinations = "Lacrosse+Avenue+Austin+TX+78739";

const requestUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destinations}&key=${googleApiKey}`;

async function fetchMap() {
  const response = await fetch(requestUrl);
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
}

fetchMap();

// request.onLoad = function() {
//   let mapData = request.response;
//   console.log(mapData);
// }

//this works when pasted into browser: "https:maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=7412+Poinsetta+Ln+Austin+TX+78746&destinations=Lacrosse+Avenue+Austin+TX+78739&key=AIzaSyAzq7W-eXQNz0ptPkQqWi9LBluABETr7Zs"



// DistanceMatrixService.getDistanceMatrix()

// var service = new google.maps.DistanceMatrixService();
// service.getDistanceMatrix(
//   {
//     origins: [origin1, origin2],
//     destinations: [destinationA],
//     travelMode: 'DRIVING',
//     unitSystem: 'IMPERIAL',
//     avoidHighways: Boolean,
//     avoidTolls: Boolean,
//   }, callback);

//   function callback(response, status) {
//     if (status == 'OK') {
//       var origins = response.originAddresses;
//       var destinations = response.destinationAddresses;
  
//       for (var i = 0; i < origins.length; i++) {
//         var results = response.rows[i].elements;
//         for (var j = 0; j < results.length; j++) {
//           var element = results[j];
//           var distance = element.distance.text;
//           var duration = element.duration.text;
//           var from = origins[i];
//           var to = destinations[j];
//         }
//       }
//     }
//   }