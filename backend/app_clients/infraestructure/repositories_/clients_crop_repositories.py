from app_clients.domain.models_.clients_crop_models import ClientCrop
from app_clients.domain.interfaces_.clients_crop_interfaces import IClientCropRepository
from django.core.exceptions import ValidationError

class ClientCropRepository(IClientCropRepository):

    def get_client_crops(self):
        return ClientCrop.objects.all()

    def get_client_crop_by_id(self, id: int):
        try:
            return ClientCrop.objects.get(id=id)
        except ClientCrop.DoesNotExist:
            return None

    def create(self, data: dict):
        try:
            client_crop = ClientCrop.objects.create(**data)
            return client_crop
        except Exception as e:
            raise ValidationError(f"Error al crear el client_crop: {str(e)}")

    def client_crop_exists(self, data: dict):
        return ClientCrop.objects.filter(name=data.get('name')).exists()

    def client_crop_exists_by_id(self, id: int):
        return ClientCrop.objects.filter(id=id).exists()

    def update(self, id: int, data: dict):
        try:
            client_crop = ClientCrop.objects.get(id=id)
            for key, value in data.items():
                setattr(client_crop, key, value)
            client_crop.save()
            return client_crop
        except ClientCrop.DoesNotExist:
            raise ValidationError(f"El client_crop con ID {id} no existe.")
        except Exception as e:
            raise ValidationError(f"Error al actualizar el client_crop: {str(e)}")

    def delete(self, id: int):
        try:
            client_crop = ClientCrop.objects.get(id=id)
            client_crop.delete()
            return True
        except ClientCrop.DoesNotExist:
            raise ValidationError(f"El client_crop con ID {id} no existe.")
        except ProtectedError as e:
            raise ValidationError(str(e))
        except Exception as e:
            raise ValidationError(f"Error al eliminar el client_crop: {str(e)}")