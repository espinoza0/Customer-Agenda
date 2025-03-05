import { createContext, useState } from "react";

const AppContext = createContext();

const AuthProvider = ({ children }) => {
  const [hasAcces, setHasAccess] = useState(false);
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/clients/getClients");
      const data = await response.json();

      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addCustomer = async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/clients/addClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const removeClient = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/clients/removeClient/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  // Notices
  const addVisit = async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/notices/addNotice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

      })

      if (!response.ok) {
        return false
      }

      return true 
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return (
    <AppContext.Provider
      value={{
        hasAcces,
        setHasAccess,
        fetchCustomers,
        addCustomer,
        removeClient,
        customers,
        setCustomers,
        addVisit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AuthProvider };
