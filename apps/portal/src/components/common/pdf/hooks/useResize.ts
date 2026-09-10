"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

export default function useResize(){

  const ref=
    useRef<HTMLDivElement>(null);

  const [width,setWidth]=
    useState(900);

  useEffect(()=>{

    if(!ref.current){
      return;
    }

    const observer=
      new ResizeObserver(entries=>{

        const w=
          entries[0].contentRect.width;

        setWidth(
          Math.max(
            300,
            Math.floor(w-24)
          )
        );

      });

    observer.observe(ref.current);

    return ()=>observer.disconnect();

  },[]);

  return {

    ref,

    width

  };

}
