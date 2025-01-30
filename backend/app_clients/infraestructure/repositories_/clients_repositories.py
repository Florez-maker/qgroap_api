from app_clients.domain.models_.clients_models import Client
from app_clients.domain.interfaces_.clients_interfaces import IClientRepository
from django.core.exceptions import ValidationError

class ClientRepository(IClientRepository):

    def get_clients(self):
        return Client.objects.all()

    def get_client_by_id(self, id: int):
        try:
            return Client.objects.get(id=id)
        except Client.DoesNotExist:
            return None

    def create(self, data: dict):
        try:
            client = Client.objects.create(**data)
            return client
        except Exception as e:
            raise ValidationError(f"Error al crear el client: {str(e)}")

    def client_exists(self, data: dict):
        return Client.objects.filter(name=data.get('name')).exists()

    def client_exists_by_id(self, id: int):
        return Client.objects.filter(id=id).exists()

    def update(self, id: int, data: dict):
        try:
            client = Client.objects.get(id=id)
            for key, value in data.items():
                setattr(client, key, value)
            client.save()
            return client
        except Client.DoesNotExist:
            raise ValidationError(f"El client con ID {id} no existe.")
        except Exception as e:
            raise ValidationError(f"Error al actualizar el client: {str(e)}")

    def delete(self, id: int):
        try:
            client = Client.objects.get(id=id)
            client.delete()
            return True
        except Client.DoesNotExist:
            raise ValidationError(f"El client con ID {id} no existe.")
        except ProtectedError as e:
            raise ValidationError(str(e))
        except Exception as e:
            raise ValidationError(f"Error al eliminar el client: {str(e)}")