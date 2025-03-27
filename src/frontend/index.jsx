import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Select } from '@forge/react';
import { invoke } from '@forge/bridge';

const PortalDropdown = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await invoke("getUsers", {});
        console.log("Response from getUsers:", users);
        setDropdownOptions(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = async (value) => {
    setSelectedValue(value);
    console.log('Selected value:', value);

    try {
      await invoke("updatePartnerAssignee", { selectedUser: value });
      console.log("Partner Assignee updated successfully.");
    } catch (error) {
      console.error("Error updating Partner Assignee:", error);
    }
  };

  return (
    <>
      <Text>Select a User:</Text>
      <Select
        className="custom-dropdown"
        label="Select a Partner"
        isLoading={isLoading}
        onChange={handleChange}
        value={selectedValue}
        options={dropdownOptions}
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <PortalDropdown />
  </React.StrictMode>
);