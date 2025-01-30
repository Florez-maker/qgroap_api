from app_clients.infraestructure.repositories_.clients_crop_repositories import ClientCropRepository
from django.core.exceptions import ValidationError

class ClientCropService:

    def __init__(self):
        self.client_crop_repository = ClientCropRepository()

    def get_client_crops(self):
        try:
            client_crops = self.client_crop_repository.get_client_crops()
            return client_crops
        except Exception as e:
            raise ValidationError(f"Error al obtener los bancos: {str(e)}")

    def get_client_crop_by_id(self, id: int):
        try:
            client_crop = self.client_crop_repository.get_client_crop_by_id(id)
            if not client_crop:
                raise ValidationError(f"El banco con ID {id} no existe.")
            return client_crop
        except Exception as e:
            raise ValidationError(f"Error al obtener el banco con ID {id}: {str(e)}")

    def client_crop_exists(self, data):
        try:
            exists = self.client_crop_repository.client_crop_exists(data)
            return exists
        except Exception as e:
            raise ValidationError(f"Error al verificar si el banco existe: {str(e)}")

    def client_crop_exists_by_id(self, id: int):
        try:
            exists = self.client_crop_repository.client_crop_exists_by_id(id)
            return exists
        except Exception as e:
            raise ValidationError(f"Error al verificar si el banco existe por ID: {str(e)}")

    def create(self, data: dict):
        try:
            if not data.get("name"):
                raise ValidationError("El nombre del banco es obligatorio.")
            result = self.client_crop_repository.create(data)
            return result
        except Exception as e:
            raise ValidationError(f"Error al crear el banco: {str(e)}")

    def update(self, id: int, data: dict):
        try:
            if not self.client_crop_repository.client_crop_exists_by_id(id):
                raise ValidationError(f"El banco con ID {id} no existe.")
            result = self.client_crop_repository.update(id, data)
            return result
        except Exception as e:
            raise ValidationError(f"Error al actualizar el banco: {str(e)}")

    def delete(self, id: int):
        try:
            if not self.client_crop_repository.client_crop_exists_by_id(id):
                raise ValidationError(f"El banco con ID {id} no existe.")
            return self.client_crop_repository.delete(id)
        except Exception as e:
            raise ValidationError(f"Error al eliminar el banco: {str(e)}")