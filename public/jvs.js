const socket = io();



const marker = {};

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
const map = L.map('map').setView([51.505, -0.09], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
socket.on("received-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude],16);
    if(marker[id])marker=setLatLng([latitude,longitude]);
    else marker[id] = L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Current Location')
        .openPopup();
});
