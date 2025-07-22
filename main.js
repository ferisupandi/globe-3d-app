// Firebase configuration (dummy)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// CesiumJS setup
Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_TOKEN';
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
