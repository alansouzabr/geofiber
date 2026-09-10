"use client";

interface Props{

  src:string;

  alt:string;

}

export default function CardImage({

  src,

  alt

}:Props){

  return(

    <div
      className="
        flex
        items-center
        justify-center
        py-10
      "
    >

      <img

        src={src}

        alt={alt}

        className="
          w-full
          max-w-[320px]
          object-contain
          drop-shadow-2xl
          select-none
          pointer-events-none
        "

      />

    </div>

  );

}
