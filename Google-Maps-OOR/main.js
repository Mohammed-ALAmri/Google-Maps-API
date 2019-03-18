//loading the map
function map(position) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: position.latitude, lng: position.longitude},
      zoom: 11,
    })

    var caricon = {
        url: "https://cdn0.iconfinder.com/data/icons/classic-cars-by-cemagraphics/512/red_512.png", // url
        scaledSize: new google.maps.Size(30, 40), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    }

    var carMarker = new google.maps.Marker({
        position: new google.maps.LatLng(position.latitude, position.longitude),
        map: map,
        title: "Car",
        icon: caricon,
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
        if(!(rectangle.getBounds().ga.j < position.longitude && rectangle.getBounds().ga.l > position.longitude 
        && rectangle.getBounds().ma.j < position.latitude  && rectangle.getBounds().ma.l > position.latitude)){
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
            //db.doc(res.id).delete()
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
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }
    // window.setInterval(function(){
    //     navigator.geolocation.getCurrentPosition(add)
    //     }, 1000);
})


