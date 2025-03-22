import axios from "axios";
class JobListing {
    static async getJobListings(req, res) {
        try {
            const { query = '', location = '', page = '1', limit = '20' } = req.query;
            const joblisting = await axios.get("https://upwork-jobs-api2.p.rapidapi.com/active-freelance-7d?search=%22Data%20Engineer%22&location_filter=%22United%20States%22", {
                params: {
                    query: query,
                    page: page,
                    num_pages: limit,
                    location: location
                },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                    'X-RapidAPI-Host': process.env.RAPID_API_HOST,
                }
            });
            res.json(joblisting.data);
        }
        catch (error) {
            console.error('Error fetching jobs:', error);
            if (axios.isAxiosError(error)) {
                res.status(error.response?.status || 500).json({
                    error: 'Failed to fetch job listings',
                    details: error.response?.data || error.message
                });
            }
            else {
                res.status(500).json({
                    error: 'An unexpected error occurred',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    }
}
export default JobListing;
