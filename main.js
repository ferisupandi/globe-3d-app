// Firebase configuration (dummy)
const firebaseConfig = {
  apiKey: "AIzaSyBwPFDpAJOILYaEAfzin9RhGXJ7HGD6HUc",
  authDomain: "globe-3d-app.firebaseapp.com",
  projectId: "globe-3d-app",
  storageBucket: "globe-3d-app.firebasestorage.app",
  messagingSenderId: "444017497033",
  appId: "1:444017497033:web:43916b1567234f3aab4e18",
  measurementId: "G-H4LPV0K0XN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// CesiumJS setup
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTcwNjU5Yi01YzI4LTQwZjMtYjQ4Ni01Mjc1ZDMyMjQzMGYiLCJpZCI6MzIzNjc3LCJpYXQiOjE3NTMxNTE4Njd9.erPvEBzQ0CkCZ2bwdcOQQrsK-EFvgAEwjJUEHYxcS7sOKEN';
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

// Load saved coordinates from Firestore
db.collection("locations").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude),
            point: { pixelSize: 10, color: Cesium.Color.RED },
            label: { text: `(${data.latitude}, ${data.longitude})` }
        });
    });
});

// Handle form submission
document.getElementById("coordForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const lat = parseFloat(document.getElementById("latitude").value);
    const lon = parseFloat(document.getElementById("longitude").value);

    // Add point to Cesium globe
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        point: { pixelSize: 10, color: Cesium.Color.BLUE },
        label: { text: `(${lat}, ${lon})` }
    });

    // Save to Firestore
    db.collection("locations").add({ latitude: lat, longitude: lon })
        .then(() => console.log("Location saved"))
        .catch((error) => console.error("Error saving location: ", error));
});

viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    point: { pixelSize: 10, color: Cesium.Color.RED },
    label: { text: `(${latitude}, ${longitude})` }
});

const listElement = document.getElementById("list");

db.collection("locations").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement("li");
        item.textContent = `Latitude: ${data.latitude}, Longitude: ${data.longitude}`;
        listElement.appendChild(item);
    });
});
