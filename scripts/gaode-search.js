let map1Markers = L.featureGroup().addTo(map);
let map2Markers = L.featureGroup().addTo(gdmap);

function getAmapBounds() {
  const bounds = gdmap.getBounds();
  const conv = L.coordConver();
  let northEast = conv.gps84_To_gcj02(bounds._northEast.lng, bounds._northEast.lat);
  let southWest = conv.gps84_To_gcj02(bounds._southWest.lng, bounds._southWest.lat);
  return `${southWest.lng},${southWest.lat};${northEast.lng},${northEast.lat}`;
}

async function searchPoi(name, jsonTemplate, page) {
  map2Markers.clearLayers();

  page = page || 1;
  const conv = L.coordConver();
  
  const data = await fetch(`https://restapi.amap.com/v3/place/polygon?polygon=${getAmapBounds()}` +
    `&key=d656a05a71ec4814047c331fcf15d6f9&city=%E7%9F%B3%E5%AE%B6%E5%BA%84&page=${page}&offset=10&keywords=${name}`)
    .then(res => res.json());
  
  const level0 = [];
  for (const item of data.pois) {
    const ll = item.location.split(',');
    item.location = conv.gcj02_To_gps84(Number(ll[0]), Number(ll[1]));
    const theMarker = L.marker(item.location).bindTooltip(item.name);
    theMarker.bindPopup(`<strong>${item.name}</strong><br>
    ${item.location.lat.toFixed(7)},${item.location.lng.toFixed(7)}<br>${item.address}<br>
    ${(item.tel && item.tel.length) ? '电话：'+item.tel : ''}`)
    theMarker.addTo(map2Markers);
    
    if (jsonTemplate) {
      jsonTemplate.name = item.name;
      const addrMatch = item.address.match(/^(.*?[路|街|道])(\d+号)/);
      if (addrMatch) {
        jsonTemplate['addr:street'] = addrMatch[1];
        jsonTemplate['addr:housenumber'] = addrMatch[2];
      }
      if (item.tel && item.tel.length) {
        jsonTemplate.phone = item.tel;
      }
      level0.push(`node: ${item.location.lat.toFixed(7)},${item.location.lng.toFixed(7)}\n` +
        Object.entries(jsonTemplate).map(x => `  ${x[0]} = ${x[1]}\n`).join(''));
    }
  }
  console.log(level0.join('\n'))
}
