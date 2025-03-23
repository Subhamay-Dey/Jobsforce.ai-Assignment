"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import Link from "next/link";

interface JobListing {
  id: string;
  title: string;
  date_posted: string;
  organization: string;
  employment_type: string[];
  url: string;
  organization_logo: string;
  locations_derived: string[];
  timezones_derived: string[];
  linkedin_org_description: string;
  seniority: string;
}

const truncateDescription = (description: string, maxLength: number) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).replace(/\s+\S*$/, "..."); // Ensures no word is cut off
};

const JobListings = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/joblisting");
        setJobs(response.data);
      } catch (err) {
        setError("Failed to fetch job listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>;

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold text-center mb-5">Job Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div key={index} className="border rounded-lg shadow-md p-5 bg-white">
            {job.organization_logo && (
              <div className="flex justify-center items-center w-full">
                <img src={job.organization_logo} alt={job.organization} className="flex justify-center items-center max-h-12 max-w-20"/>
              </div>
            )}
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600 text-sm">Posted on: {job.date_posted}</p>
            <p className="text-gray-700 text-sm mt-1 font-medium">{job.organization}</p>
            <p className="mt-2 text-gray-700 text-sm">
              {truncateDescription(job.linkedin_org_description, 650)}
            </p>
            <div className="mt-3">
              <span className="text-sm font-bold text-gray-800">Location: {job.locations_derived.join(", ")}</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-700 font-semibold">Seniority: {job.seniority}</p>
              <p className="text-sm text-gray-700 font-semibold">Employment Type: {job.employment_type.join(", ")}</p>
            </div>
            <div className="flex justify-between items-center">
                <Link href={job.url} target="_blank" rel="noopener noreferrer" >
                  <Button className="mt-3 cursor-pointer">View Job</Button>
                </Link>

                <Link href={`/ai-mock-interview/${job.id}`}>
                  <Button className="cursor-pointer mt-3">Ai Interview</Button>
                </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListings;
