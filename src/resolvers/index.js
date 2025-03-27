import api, { route } from "@forge/api";

const logAndThrowIf = (cond, message) => {
    if (cond) {
        console.error(message);
        throw new Error(message);
    };
}

export const getUsers = async (req) => {
  try {
    const issueKey = req.context.extension.request.key;
    console.log("Extracted Issue Key:", issueKey);
 
    // Fetch project details
    const projectResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
    logAndThrowIf(!projectResponse.ok, `Failed to fetch project details: ${projectResponse.status} ${projectResponse.statusText}`);
    const projectData = await projectResponse.json();
 
    // Extract projectKey
    const projectKey = projectData.fields?.project?.key;
    logAndThrowIf(!projectKey, "Project key not found in the issue data.");
    console.log(`Extracted Project Key: ${projectKey}`);
 
    // Fetch organization details for the project
    console.log(`Fetching organization details for projectKey: ${projectKey}`);
    const orgResponse = await api.asApp().requestJira(
      route`/rest/servicedeskapi/servicedesk/${projectKey}/organization`
    );
    logAndThrowIf(!orgResponse.ok, `Failed to fetch organization details: ${orgResponse.status} ${orgResponse.statusText}`);
    const orgData = await orgResponse.json();
 
    // Extract organizationId
    const organizationId = orgData.values?.[0]?.id; // Assuming the first organization is used
    logAndThrowIf(!organizationId, "Organization ID not found for the project.");
    console.log(`Extracted Organization ID: ${organizationId}`);
 
    // Fetch users from the organization
    console.log(`Fetching users for organizationId: ${organizationId}`);
    const usersResponse = await api.asApp().requestJira(
      route`/rest/servicedeskapi/organization/${organizationId}/user`
    );
    logAndThrowIf(!usersResponse.ok, `Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}`);
    const usersData = await usersResponse.json();
 
    // Log the fetched users
    console.log(`Fetched Users: ${JSON.stringify(usersData.values, null, 2)}`);
 
    // Return the list of users in the required format
    // return usersData.values
    //     .filter((user) => ["", "Former User"].includes(user.displayName ?? ""))
    //     .sort((a, b) => a.displayName.localeCompare(b.displayName))
    //     .map((user) => ({
    //         label: user.displayName,
    //         value: user.displayName
    //     }));

    return usersData.values
    .filter((user) => user.displayName !== "Former user") // Exclude users with displayName "Former User"
    .sort((a, b) => a.displayName.localeCompare(b.displayName)) // Sort alphabetically by displayName
    .map((user) => ({
        label: user.displayName,
        value: user.displayName
    }));

  } catch (error) {
    console.error("Error in getUsers:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
};
 
// Export handler for manifest usage
export const handler = async (context) => {
  return await getUsers(context);
};