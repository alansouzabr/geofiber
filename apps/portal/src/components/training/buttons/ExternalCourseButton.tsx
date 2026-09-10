"use client";

export default function ExternalCourseButton() {

  function openPlatform() {

    window.open(
      "https://cursos.institutoatilansouza.com.br",
      "_blank",
      "noopener,noreferrer"
    );

  }

  return (

    <button
      onClick={openPlatform}
      className="
        mt-4
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-white
        hover:bg-blue-700
        transition
      "
    >

      🎓 Acessar Plataforma de Cursos

    </button>

  );

}
