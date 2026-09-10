"use client";

import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
};

export default function TrainingCard({
  title,
  description,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="
        rounded-xl
        border
        p-6
        hover:shadow-lg
        transition
        block
      "
    >
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="text-gray-500 mt-3">
        {description}
      </p>
    </Link>
  );
}
