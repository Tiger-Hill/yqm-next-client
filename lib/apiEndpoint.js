// ! HERE WE DEFINE THE BASE URL OF THE ENDPOINTS TO FETCH DATA FROM THE SERVER

let baseEndpointUrl = "";
if (["development", "test"].includes(process.env.NODE_ENV)) {
  baseEndpointUrl = "http://localhost:3000";
} else if (["production"].includes(process.env.NODE_ENV)) {
  baseEndpointUrl = process.env.NEXT_PUBLIC_API_URL;
}

// TODO: REMOVE BELOW. ONLY FOR SMALL DEVICE DEVELOPMENT
// TODO: =====================================================
// baseEndpointUrl = "http://localhost:8080";
// TODO: =====================================================

export default baseEndpointUrl;
