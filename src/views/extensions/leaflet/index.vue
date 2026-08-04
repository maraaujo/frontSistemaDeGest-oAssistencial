<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for the missing marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})
onMounted(() => {
  const basicMap = L.map('basic-map').setView([
    51.505,
    -0.09,
  ], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap contributors' }).addTo(basicMap)

  const markerMap = L.map('marker-map').setView([
    51.505,
    -0.09,
  ], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap contributors' }).addTo(markerMap)
  L.marker([
    51.5,
    -0.09,
  ]).addTo(markerMap).bindPopup('London')
  L.marker([
    51.51,
    -0.1,
  ]).addTo(markerMap).bindPopup('Another Location')

  const polygonMap = L.map('polygon-map').setView([
    51.505,
    -0.09,
  ], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap contributors' }).addTo(polygonMap)

  // Add a polygon
  L.polygon([
    [
      51.509,
      -0.08,
    ],
    [
      51.503,
      -0.06,
    ],
    [
      51.51,
      -0.047,
    ],
  ], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
  }).addTo(polygonMap)

  const popupMap = L.map('popup-map').setView([
    51.505,
    -0.09,
  ], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap contributors' }).addTo(popupMap)
  L.marker([
    51.5,
    -0.09,
  ]).addTo(popupMap).bindPopup(`
      <div class="custom-popup">
        <h3>Custom Popup</h3>
        <p>This is a custom popup with HTML content.</p>
        <img src="https://picsum.photos/200/100" alt="Random Image" style="width: 100%; margin-top: 10px;">
      </div>
    `)
})
</script>

<template>
  <div>
    <!-- Basic Map -->
    <VCard title="Basic Map">
      <VCardText>
        <div
          id="basic-map"
          style="block-size: 400px;"
        />
      </VCardText>
    </VCard>

    <!-- Map with Markers -->
    <VCard
      class="mt-6"
      title="Map with Markers"
    >
      <VCardText>
        <div
          id="marker-map"
          style="block-size: 400px;"
        />
      </VCardText>
    </VCard>

    <!-- Map with Polygon -->
    <VCard
      class="mt-6"
      title="Map with Polygon"
    >
      <VCardText>
        <div
          id="polygon-map"
          style="block-size: 400px;"
        />
      </VCardText>
    </VCard>

    <!-- Map with Custom Popup -->
    <VCard
      class="mt-6"
      title="Map with Custom Popup"
    >
      <VCardText>
        <div
          id="popup-map"
          style="block-size: 400px;"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.custom-popup {
  padding: 10px;
  max-inline-size: 200px;
}

.custom-popup h3 {
  color: #333;
  margin-block: 0 10px;
  margin-inline: 0;
}

.custom-popup p {
  margin: 0;
  color: #666;
}
</style>
