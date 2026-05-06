import axios from 'axios';

async function testMuseApi() {
  try {
    console.log('Fetching from The Muse API...');
    const response = await axios.get('https://www.themuse.com/api/public/jobs?page=1&category=Software%20Engineer');
    console.log(`Found ${response.data.results.length} jobs.`);
    if (response.data.results && response.data.results.length > 0) {
      const job = response.data.results[0];
      console.log('Sample Job:');
      console.log('- Title:', job.name);
      console.log('- Company:', job.company.name);
      console.log('- Location:', job.locations.map(l => l.name).join(', '));
      console.log('- URL:', job.refs.landing_page);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testMuseApi();
