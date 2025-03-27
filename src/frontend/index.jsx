import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Select, options } from '@forge/react';
import { invoke } from '@forge/bridge';

const PortalDropdown = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    try {
      const users = await invoke("getUsers", {});
      console.log("Response from getUsers:", users);
      setDropdownOptions(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (value) => {
    setSelectedValue(value);
    console.log('Selected value:', value);
  };
 console.log('DropdownOptions:', dropdownOptions);
  return (
    <>
      <Text>Select a User:</Text>
      <Select
        className="custom-dropdown" // Add a custom class
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