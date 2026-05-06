import axios from 'axios';

async function testApi() {
  try {
    console.log('Fetching from Remotive API...');
    const response = await axios.get('https://remotive.com/api/remote-jobs?search=react&limit=5');
    console.log(`Found ${response.data.jobCount} jobs.`);
    if (response.data.jobs && response.data.jobs.length > 0) {
      const job = response.data.jobs[0];
      console.log('Sample Job:');
      console.log('- Title:', job.title);
      console.log('- Company:', job.company_name);
      console.log('- URL:', job.url);
      console.log('- Description snippet:', job.description.substring(0, 100) + '...');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testApi();
