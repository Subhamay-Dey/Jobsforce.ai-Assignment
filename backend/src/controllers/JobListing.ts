import { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { mockJobListings } from "../jobs/JobListing.js";

interface FilteredJobListing {
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

class JobListing {
    static async getJobListings(req: Request, res: Response){
        try {

            const filteredJobListings: FilteredJobListing[] = mockJobListings.map((job: any) => ({
              id: job.id,
              title: job.title,
              date_posted: job.date_posted,
              organization: job.organization,
              employment_type: job.employment_type,
              url: job.url,
              organization_logo: job.organization_logo,
              locations_derived: job.locations_derived,
              timezones_derived: job.timezones_derived,
              linkedin_org_description: job.linkedin_org_description,
              seniority: job.seniority
              }));

            // console.log(filteredJobListings);
            
            res.json(filteredJobListings);

        } catch (error) {
            console.error('Error fetching jobs:', error);

            if (axios.isAxiosError(error)) {
                res.status(error.response?.status || 500).json({
                  error: 'Failed to fetch job listings',
                  details: error.response?.data || error.message
                });
              } else {
                res.status(500).json({
                  error: 'An unexpected error occurred',
                  details: error instanceof Error ? error.message : 'Unknown error'
                });
              }
        }
    }
}

export default JobListing