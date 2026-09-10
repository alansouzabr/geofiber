"use client";

import L from "leaflet";

export function createDynamicIcon(
  cfg:{
    url:string;
    size:readonly[number,number];
    anchor:readonly[number,number];
    popup:readonly[number,number];
  },
  scale:number
){

  return L.icon({

    iconUrl:cfg.url,

    iconSize:[
      cfg.size[0]*scale,
      cfg.size[1]*scale
    ],

    iconAnchor:[
      cfg.anchor[0]*scale,
      cfg.anchor[1]*scale
    ],

    popupAnchor:[
      cfg.popup[0],
      cfg.popup[1]*scale
    ]

  });

}
