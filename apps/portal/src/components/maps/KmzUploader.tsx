"use client";

import {
  UploadCloud
} from "lucide-react";

import JSZip from "jszip";

interface Props {

  onLoaded: (
    points: any[]
  ) => void;
}

export default function KmzUploader({
  onLoaded
}: Props) {

  async function handleFile(
    e: any
  ) {

    const file =
      e.target.files?.[0];

    if (!file)
      return;

    const zip =
      await JSZip.loadAsync(file);

    const kmlFile =
      Object.values(zip.files)
        .find((f: any) =>
          f.name.endsWith(".kml")
        );

    if (!kmlFile)
      return;

    const kmlText =
      await kmlFile.async("text");

    const parser =
      new DOMParser();

    const xml =
      parser.parseFromString(
        kmlText,
        "text/xml"
      );

    const coords =
      Array.from(
        xml.getElementsByTagName(
          "coordinates"
        )
      );

    const points =
      coords.flatMap((node: any) => {

        const raw =
          node.textContent
            ?.trim()
            ?.split(" ");

        return raw.map((line: any) => {

          const [
            lng,
            lat
          ] = line.split(",");

          return {
            lat:
              Number(lat),

            lng:
              Number(lng)
          };
        });
      });

    onLoaded(points);
  }

  return (

    <label
      className="
        absolute
        top-5
        right-5
        z-[9999]
        bg-cyan-500
        text-black
        px-5
        py-3
        rounded-2xl
        font-bold
        cursor-pointer
        shadow-2xl
        flex
        items-center
        gap-3
      "
    >

      <UploadCloud size={20} />

      Upload KMZ

      <input
        type="file"
        accept=".kmz"
        hidden
        onChange={handleFile}
      />

    </label>
  );
}
