const socket = io();
const markers = {}; 
const bounds = L.latLngBounds(); 
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}

const map = L.map('map').setView([51.505, -0.09], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

socket.on("received-location", (data) => {
    const { id, latitude, longitude } = data;
    const latLng = [latitude, longitude];

    if (markers[id]) {
        markers[id].setLatLng(latLng);
    } else {
        markers[id] = L.marker(latLng).addTo(map)
            .bindPopup('Current Location')
            .openPopup();
    }

    bounds.extend(latLng); 
    map.fitBounds(bounds, { padding: [50, 50] }); 
});
