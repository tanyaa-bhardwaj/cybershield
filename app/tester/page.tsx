"use client";

import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const route = (name: string) => {
    router.push(`/tester/${name}`);
  };
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-5">
      {["priyam", "tanya", "varsha"].map((item, index) => (
        <button
          key={index}
          onClick={() => route(item)}
          className="p-2 bg-white text-black rounded-md "
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default page;
