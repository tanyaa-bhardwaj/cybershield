"use client";

import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  console.log(params);
  return <div>{params.id}</div>;
};

export default page;
