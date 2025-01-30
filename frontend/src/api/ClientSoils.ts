const BASE_URL = "http://127.0.0.1:8000";

const clientsoilsapi = {
  async get() {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_soils/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching client soil:", error);
      return {
        error: true,
        message: "Failed to fetch client soils",
      };
    }
  },

  async create(clientData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_soils/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creando suelo de cliente:", error);
      return {
        error: true,
        message: "Failed to create client soil",
      };
    }
  },

  async update(id, clientData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_soils/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error actualizando el suelo del cliente:", error);
      return {
        error: true,
        message: "Failed to update client soil",
      };
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_soils/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { success: true };
    } catch (error) {
      console.error("Error eliminando suelos de cliente:", error);
      return {
        error: true,
        message: "Failed to delete client soils",
      };
    }
  },
};

export default clientsoilsapi;
