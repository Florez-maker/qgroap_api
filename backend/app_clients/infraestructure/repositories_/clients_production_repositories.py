from app_clients.domain.models_.clients_production_models import ClientProduction
from app_clients.domain.interfaces_.clients_production_interfaces import IClientProductionRepository
from django.core.exceptions import ValidationError

class ClientProductionRepository(IClientProductionRepository):

    def get_client_productions(self):
        return ClientProduction.objects.all()

    def get_client_production_by_id(self, id: int):
        try:
            return ClientProduction.objects.get(id=id)
        except ClientProduction.DoesNotExist:
            return None

    def create(self, data: dict):
        try:
            client_production = ClientProduction.objects.create(**data)
            return client_production
        except Exception as e:
            raise ValidationError(f"Error al crear el client_production: {str(e)}")

    def client_production_exists(self, data: dict):
        return ClientProduction.objects.filter(name=data.get('name')).exists()

    def client_production_exists_by_id(self, id: int):
        return ClientProduction.objects.filter(id=id).exists()

    def update(self, id: int, data: dict):
        try:
            client_production = ClientProduction.objects.get(id=id)
            for key, value in data.items():
                setattr(client_production, key, value)
            client_production.save()
            return client_production
        except ClientProduction.DoesNotExist:
            raise ValidationError(f"El client_production con ID {id} no existe.")
        except Exception as e:
            raise ValidationError(f"Error al actualizar el client_production: {str(e)}")

    def delete(self, id: int):
        try:
            client_production = ClientProduction.objects.get(id=id)
            client_production.delete()
            return True
        except ClientProduction.DoesNotExist:
            raise ValidationError(f"El client_production con ID {id} no existe.")
        except ProtectedError as e:
            raise ValidationError(str(e))
        except Exception as e:
            raise ValidationError(f"Error al eliminar el client_production: {str(e)}")