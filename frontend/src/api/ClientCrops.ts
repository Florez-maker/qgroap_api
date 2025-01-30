const BASE_URL = "http://127.0.0.1:8000";

const clientcropsapi = {
  async get() {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_crops/`, {
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

  async create(clientCropData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_crops/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientCropData),
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

  async update(id, clientCropData) {
    try {
      const response = await fetch(`${BASE_URL}/clients/client_crops/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientCropData),
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
      const response = await fetch(`${BASE_URL}/clients/client_crops/${id}/`, {
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
};

export default clientcropsapi;
