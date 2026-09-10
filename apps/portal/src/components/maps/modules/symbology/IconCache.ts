import L from "leaflet";

const cache =
  new Map<string,L.Icon>();

export function getCachedIcon(
  key:string
){

  return cache.get(key);

}

export function storeCachedIcon(
  key:string,
  icon:L.Icon
){

  cache.set(
    key,
    icon
  );

}

export function clearIconCache(){

  cache.clear();

}
