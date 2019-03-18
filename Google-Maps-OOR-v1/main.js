//check if the browser have the geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(map) //call function map to load the map
    } else { 
        alert("Geolocation is not supported by this browser.")
    }
}

//loading the map
function map(position) {
        console.log(position)

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
      zoom: 11,
    })
    console.log(position)
    var carMarker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: map,
        title: "Car",
    })
    var infoWindow = new google.maps.InfoWindow({
        content: "<p id = 'left'>The current location of the Car</p>"
    })
    google.maps.event.addListener(carMarker, 'click', function(){
        infoWindow.open(map, carMarker)
    })

    rectangle(map, position);
  }

//insert the radius rectangle
  function rectangle(map, position){
    var rectangle = new google.maps.Rectangle({
        map:map,
        bounds:  new google.maps.LatLngBounds(
            new google.maps.LatLng(24.498146, 46.562797),
            new google.maps.LatLng(25.008462, 46.950393),
        ),
        fillColor: "#ffffff",
        editable: true,
        draggable:true        
    })

    //check if in the radius
    function findLocation(){
        if(!(rectangle.getBounds().ga.j < position.coords.longitude && rectangle.getBounds().ga.l > position.coords.longitude 
        && rectangle.getBounds().ma.j < position.coords.latitude  && rectangle.getBounds().ma.l > position.coords.latitude)){
            alert("out of radius")
            console.log("out of radius")
        }
    }

    window.setInterval(function(){
        findLocation();
    }, 5000);
}

//getting location feed 
$(function(){
    let db = firebase.firestore().collection('location');

    db.get().then(res => {
        let changes = res.docChanges();// gets array of docs in my collection and checks for changes
        changes.forEach(res => {
            map(res.doc.data())
            //Read
            console.log(res.doc.data());            
        })
         
     }).catch(err => {
         console.log(err);
     })
})

//sending the live location feed 
$(function(){
    let db = firebase.firestore().collection('location');
    navigator.geolocation.getCurrentPosition(add)
    function add(position){
        db.add({
//            position:{
  //              coords:{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
    //            }
      //      }
        })
    }
    // window.setInterval(function(){
    //     navigator.geolocation.getCurrentPosition(add)
    //     }, 1000);
})

