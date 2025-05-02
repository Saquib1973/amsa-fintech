export async function getClientIpAddress() {
  try {
    const response = await fetch(
      'https://api.ipapi.com/api/check?access_key=' + process.env.IPAPI_KEY
    )
    const data = await response.json()
    return `${data.city}, ${data.region_name}, ${data.country_name}`
  } catch (error) {
    console.error('Error getting location:', error)
    return 'Unknown location'
  }
}
