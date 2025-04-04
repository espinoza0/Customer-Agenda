import { format } from "date-fns";
import { createContext, useState } from "react";

const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL 
// const BACKEND_URL = "http://localhost:3000" //desarrollo
// const BACKEND_URL = "http://192.168.1.128:3000" //desarrollo

const AuthProvider = ({ children }) => {
  const [hasAcces, setHasAccess] = useState(false);
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async (client_id = null) => {
    try {
      let url = `${BACKEND_URL}/clients/getClients`;

      // console.log(url)
      if (client_id) {
        url += `?client_id=${client_id}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addCustomer = async (data) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/clients/addClient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
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

  const removeClient = async (id) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/clients/removeClient/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return false;
        // throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
      // return await response.json();
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const editClient = async (id, data) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/clients/editClient/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
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
      const response = await fetch(
        `${BACKEND_URL}/notices/addNotice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchVisits = async (
    client_id = null,
    pending = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `${BACKEND_URL}/notices/getNotices`;
      let filtersParams = [];

      if (client_id) {
        filtersParams.push(`client_id=${client_id}`);
      }

      if (pending !== null) {
        let pendingType;

        switch (pending) {
          case "pendiente":
            pendingType = 1;
            break;
          case "realizado":
            pendingType = 0;
            break;
          default:
            pendingType = null;
            break;
        }

        if (pendingType !== null) {
          filtersParams.push(`pending=${pendingType}`);
        }
      }

      if (startDate && endDate) {
        const formattedStartDate = format(startDate, "yyyyMMdd");
        const formattedEndDate = format(endDate, "yyyyMMdd");

        filtersParams.push(
          `start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        );
      }

      if (filtersParams.length > 0) {
        url += `?${filtersParams.join("&")}`;
      }

      // console.log(url);

      const response = await fetch(url);
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedState, setSelectedState] = useState(null);

  const editVisit = async (data) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/notices/editNotice`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const removeVisit = async (id) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/notices/removeNotice/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const [visits, setVisits] = useState([]);

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
        addVisit,
        visits,
        setVisits,
        fetchVisits,
        editClient,
        editVisit,
        removeVisit,
        selectedState, 
        setSelectedState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AuthProvider };
