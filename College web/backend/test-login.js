const testLogin = async () => {
  try {
    const response = await fetch('https://college-website1-0ryx.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ballari.edu',
        password: 'admin123'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testLogin();
