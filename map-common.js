function parseMapHash() {
  let matched = location.hash.match(/^#map=([.\d]+)\/([.\d]+)\/([.\d]+)/);
  if (matched) {
    return {
      zoom: matched[1],
      latlon: [ matched[2], matched[3] ]
    }
  }
}

function getMapHash(zoom, center) {
  if (zoom < 17) {
    return `#map=${zoom}/${center.lat.toFixed(4)}/${center.lng.toFixed(4)}`;
  } else {
    return `#map=${zoom}/${center.lat.toFixed(5)}/${center.lng.toFixed(5)}`;
  }
}
