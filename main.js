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

// Function to validate coordinates
function isValidCoordinate(lat, lon) {
    return typeof lat === 'number' && typeof lon === 'number' &&
           !isNaN(lat) && !isNaN(lon) &&
           lat >= -90 && lat <= 90 &&
           lon >= -180 && lon <= 180;
}

// Load existing locations from Firestore
db.collection("locations").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const lat = data.latitude;
        const lon = data.longitude;

        if (isValidCoordinate(lat, lon)) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                point: { pixelSize: 10, color: Cesium.Color.RED },
                label: { text: `(${lat.toFixed(5)}, ${lon.toFixed(5)})` }
            });
        } else {
            console.warn("Invalid coordinate skipped:", data);
        }
    });
});

// Handle form submission
document.getElementById("coordForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const lat = parseFloat(document.getElementById("latitude").value);
    const lon = parseFloat(document.getElementById("longitude").value);

    if (isValidCoordinate(lat, lon)) {
        // Add to Cesium globe
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            point: { pixelSize: 10, color: Cesium.Color.BLUE },
            label: { text: `(${lat.toFixed(5)}, ${lon.toFixed(5)})` }
        });

        // Save to Firestore
        db.collection("locations").add({
            latitude: lat,
            longitude: lon,
            timestamp: new Date()
        }).then(() => {
            console.log("Location saved:", lat, lon);
        }).catch((error) => {
            console.error("Error saving location:", error);
        });
    } else {
        alert("Koordinat tidak valid. Pastikan nilai latitude dan longitude benar.");
    }
});