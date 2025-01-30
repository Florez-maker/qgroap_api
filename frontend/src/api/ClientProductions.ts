const BASE_URL = "http://127.0.0.1:8000";

const clientproductionsapi = {
  async get() {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_productions/`, {
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
      console.error("Error fetching movements:", error);
      return {
        error: true,
        message: "Failed to fetch movements",
      };
    }
  },

  async create(clientData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_productions/`, {
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
      console.error("Error creando cliente:", error);
      return {
        error: true,
        message: "Failed to create client",
      };
    }
  },

  async update(id, clientData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_productions/${id}/`, {
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
      console.error("Error actualizando cliente:", error);
      return {
        error: true,
        message: "Failed to update client",
      };
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_productions/${id}/`, {
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
      console.error("Error eliminando cliente:", error);
      return {
        error: true,
        message: "Failed to delete client",
      };
    }
  },

  async uploadProductions(formData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_productions/upload_productions/`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading productions:", error);
      return {
        error: true,
        message: "Failed to upload productions",
      };
    }
  },

};

export default clientproductionsapi;
