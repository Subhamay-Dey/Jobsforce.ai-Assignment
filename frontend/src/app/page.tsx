import JobListings from "@/components/joblisting/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="container flex flex-col items-center justify-center min-h-screen py-2">
        <JobListings/>
      </div>
    </>
  );
}
