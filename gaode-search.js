let map1Markers = L.featureGroup().addTo(map);
let map2Markers = L.featureGroup().addTo(gdmap);

function getAmapBounds() {
  const bounds = gdmap.getBounds();
  const conv = L.coordConver();
  let northEast = conv.gps84_To_gcj02(bounds._northEast.lng, bounds._northEast.lat);
  let southWest = conv.gps84_To_gcj02(bounds._southWest.lng, bounds._southWest.lat);
  return `${southWest.lng},${southWest.lat};${northEast.lng},${northEast.lat}`;
}

async function searchPoi(name) {
  map2Markers.clearLayers();

  const conv = L.coordConver();
  
  const data = await fetch(`https://restapi.amap.com/v3/place/polygon?polygon=${getAmapBounds()}` +
    `&key=d656a05a71ec4814047c331fcf15d6f9&city=%E7%9F%B3%E5%AE%B6%E5%BA%84&page=1&offset=10&keywords=${name}`)
    .then(res => res.json());
  
  console.log(data);
  for (const item of data.pois) {
    const ll = item.location.split(',');
    item.location = conv.gcj02_To_gps84(Number(ll[0]), Number(ll[1]));
    const theMarker = L.marker(item.location).bindTooltip(item.name);
    theMarker.bindPopup(`<strong>${item.name}</strong><br>
    ${item.location.lat.toFixed(7)},${item.location.lng.toFixed(7)}<br>${item.address}`)
    theMarker.addTo(map2Markers);
  }
}
