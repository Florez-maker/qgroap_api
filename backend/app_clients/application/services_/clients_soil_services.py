from app_clients.infraestructure.repositories_.clients_soil_repositories import ClientSoilRepository
from django.core.exceptions import ValidationError

class ClientSoilService:

    def __init__(self):
        self.client_soil_repository = ClientSoilRepository()

    def get_client_soils(self):
        try:
            client_soils = self.client_soil_repository.get_client_soils()
            return client_soils
        except Exception as e:
            raise ValidationError(f"Error al obtener los clientes: {str(e)}")

    def get_client_soil_by_id(self, id: int):
        try:
            client_soil = self.client_soil_repository.get_client_soil_by_id(id)
            if not client_soil:
                raise ValidationError(f"El cliente con ID {id} no existe.")
            return client_soil
        except Exception as e:
            raise ValidationError(f"Error al obtener el cliente con ID {id}: {str(e)}")

    def client_soil_exists(self, data):
        try:
            exists = self.client_soil_repository.client_soil_exists(data)
            return exists
        except Exception as e:
            raise ValidationError(f"Error al verificar si el cliente existe: {str(e)}")

    def client_soil_exists_by_id(self, id: int):
        try:
            exists = self.client_soil_repository.client_soil_exists_by_id(id)
            return exists
        except Exception as e:
            raise ValidationError(f"Error al verificar si el cliente existe por ID: {str(e)}")

    def create(self, data: dict):
        try:
            if not data.get("name"):
                raise ValidationError("El nombre del cliente es obligatorio.")
            result = self.client_soil_repository.create(data)
            return result
        except Exception as e:
            raise ValidationError(f"Error al crear el cliente: {str(e)}")

    def update(self, id: int, data: dict):
        try:
            if not self.client_soil_repository.client_soil_exists_by_id(id):
                raise ValidationError(f"El cliente con ID {id} no existe.")
            result = self.client_soil_repository.update(id, data)
            return result
        except Exception as e:
            raise ValidationError(f"Error al actualizar el cliente: {str(e)}")

    def delete(self, id: int):
        try:
            if not self.client_soil_repository.client_soil_exists_by_id(id):
                raise ValidationError(f"El cliente con ID {id} no existe.")
            return self.client_soil_repository.delete(id)
        except Exception as e:
            raise ValidationError(f"Error al eliminar el cliente: {str(e)}")