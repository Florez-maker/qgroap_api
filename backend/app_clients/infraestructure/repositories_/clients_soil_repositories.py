from app_clients.domain.models_.clients_soil_models import ClientSoil
from app_clients.domain.interfaces_.clients_soil_interfaces import IClientSoilRepository
from django.core.exceptions import ValidationError

class ClientSoilRepository(IClientSoilRepository):

    def get_client_soils(self):
        return ClientSoil.objects.all()

    def get_client_soil_by_id(self, id: int):
        try:
            return ClientSoil.objects.get(id=id)
        except ClientSoil.DoesNotExist:
            return None

    def create(self, data: dict):
        try:
            client_soil = ClientSoil.objects.create(**data)
            return client_soil
        except Exception as e:
            raise ValidationError(f"Error al crear el client_soil: {str(e)}")

    def client_soil_exists(self, data: dict):
        return ClientSoil.objects.filter(name=data.get('name')).exists()

    def client_soil_exists_by_id(self, id: int):
        return ClientSoil.objects.filter(id=id).exists()

    def update(self, id: int, data: dict):
        try:
            client_soil = ClientSoil.objects.get(id=id)
            for key, value in data.items():
                setattr(client_soil, key, value)
            client_soil.save()
            return client_soil
        except ClientSoil.DoesNotExist:
            raise ValidationError(f"El client_soil con ID {id} no existe.")
        except Exception as e:
            raise ValidationError(f"Error al actualizar el client_soil: {str(e)}")

    def delete(self, id: int):
        try:
            client_soil = ClientSoil.objects.get(id=id)
            client_soil.delete()
            return True
        except ClientSoil.DoesNotExist:
            raise ValidationError(f"El client_soil con ID {id} no existe.")
        except ProtectedError as e:
            raise ValidationError(str(e))
        except Exception as e:
            raise ValidationError(f"Error al eliminar el client_soil: {str(e)}")