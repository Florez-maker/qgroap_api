import numpy as np
import pandas as pd
from app_clients.api.serializers_.clients_production_serializers import ClientProductionSerializer
from app_clients.domain.models_.clients_models import Client
from app_clients.domain.models_.clients_production_models import ClientProduction
from app_clients.infraestructure.repositories_.clients_production_repositories import ClientProductionRepository
from app_clients.infraestructure.repositories_.clients_repositories import ClientRepository
from django.core.exceptions import ValidationError
from django.db import transaction

class ClientProductionService:

    def __init__(self):
        self.client_production_repository = ClientProductionRepository()
        self.client_repository = ClientRepository()

    def get_client_productions(self):
        try:
            client_productions = self.client_production_repository.get_client_productions()
            return client_productions
        except Exception as e:
            raise ValidationError(f"Error al obtener los produccion clientes: {str(e)}")

    def get_client_production_by_id(self, id: int):
        try:
            client_production = self.client_production_repository.get_client_production_by_id(id)
            if not client_production:
                raise ValidationError(f"El produccion cliente con ID {id} no existe.")
            return client_production
        except Exception as e:
            raise ValidationError(f"Error al obtener el produccion cliente con ID {id}: {str(e)}")

    def client_production_exists(self, data):
        try:
            exists = self.client_production_repository.client_production_exists(data)
            return exists
        except Exception as e:
            raise ValidationError(f"Error al verificar si el produccion cliente existe: {str(e)}")

    def client_production_exists_by_id(self, id: int):
        try:
            exists = self.client_production_repository.client_production_exists_by_id(id)
            return exists
        except Exception as e:
            raise ValidationError(f"Error al verificar si el produccion cliente existe por ID: {str(e)}")

    def create(self, data: dict):
        try:
            if not data.get("name"):
                raise ValidationError("El nombre del produccion cliente es obligatorio.")
            result = self.client_production_repository.create(data)
            return result
        except Exception as e:
            raise ValidationError(f"Error al crear el produccion cliente: {str(e)}")

    def update(self, id: int, data: dict):
        try:
            if not self.client_production_repository.client_production_exists_by_id(id):
                raise ValidationError(f"El produccion cliente con ID {id} no existe.")
            result = self.client_production_repository.update(id, data)
            return result
        except Exception as e:
            raise ValidationError(f"Error al actualizar el produccion cliente: {str(e)}")

    def delete(self, id: int):
        try:
            if not self.client_production_repository.client_production_exists_by_id(id):
                raise ValidationError(f"El produccion cliente con ID {id} no existe.")
            return self.client_production_repository.delete(id)
        except Exception as e:
            raise ValidationError(f"Error al eliminar el produccion cliente: {str(e)}")

    @transaction.atomic
    def upload_productions(self, request):

        def load_file(file):
            def find_delimiter(csv_file):
                try:
                    sample = csv_file.read(1024)
                    sample = sample.decode('utf-8', errors='ignore')
                    csv_file.seek(0)
                    delimiters = [',', ';', ':', '|', '\t']
                    delimiter_counts = {delim: 0 for delim in delimiters}

                    for line in sample:
                        for delim in delimiters:
                            delimiter_counts[delim] += len(re.findall(re.escape(delim), line))

                    delimiter = max(delimiter_counts, key=delimiter_counts.get)

                    return delimiter
                except Exception as e:
                    return None

            if file.name.endswith('.csv') or file.name.endswith('.CSV'):
                try:
                    delimiter = find_delimiter(file)
                    df = pd.read_csv(file, on_bad_lines='skip', sep=delimiter)
                except Exception as e:
                    return [f"Error al leer CSV: {e}"]

            elif file.name.endswith('.xls') or file.name.endswith('.xlsx'):
                try:
                    df = pd.ExcelFile(file)
                    df = pd.read_excel(df, engine='openpyxl')
                except Exception as e:
                    return [f"Error al leer Excel: {e}"]

            else:
                return ["Formato de archivo no válido."]

            return df

        file = request.FILES.get("document")
        client_id = request.data["client_id"]

        client = self.client_repository.get_client_by_id(client_id)

        if not client:
            return 0, [f"No se encontró un cliente con el ID {client_id}."]

        client_name = client.name

        try:
            df = load_file(file)

            productions_created = 0
            productions_to_create = []
            errors = []

            if client_name == "Manuelita":

                for index, row in df.iterrows():
                    try:
                        NOM_HAC = str(row['NOM_HAC'])
                        STE = str(row['STE'])
                        STE2 = str(row['STE2'])
                        VAR = str(row['VAR'])
                        AREA = str(row['AREA'])
                        EDAD_COS = str(row['EDAD_COS'])
                        NCTE = str(row['NCTE'])
                        SAC = np.round(row['SAC'],2)
                        TCH = np.round(row['TCH'],2)
                        TCHM = np.round(row['TCHM'],2)
                        TAH = np.round(row['TAH'],2)
                        TAHM = np.round(row['TAHM'],2)
                        REND_COM = np.round(row['REND_COM'],2)
                        MAT_EXT = np.round(row['MAT_EXT'],2)

                        production_data = {
                            'NOM_HAC': NOM_HAC,
                            'STE': STE,
                            'STE2': STE2,
                            'VAR': VAR,
                            'AREA': AREA,
                            'EDAD_COS': EDAD_COS,
                            'NCTE': NCTE,
                            'SAC': SAC,
                            'TCH': TCH,
                            'TCHM': TCHM,
                            'TAH': TAH,
                            'TAHM': TAHM,
                            'REND_COM': REND_COM,
                            'MAT_EXT': MAT_EXT,
                            'client_id': client_id,
                        }

                        serializer = ClientProductionSerializer(data=production_data)
                        if serializer.is_valid():

                            productions_to_create.append(ClientProduction(**serializer.validated_data))
                            productions_created += 1

                        else:
                            errors.append(f"Error en la fila {index + 2}: {serializer.errors}")

                    except ValueError:
                        errors.append(
                            f"Formato de fecha inválido en la fila {index + 2}. Se espera YYYY-MM-DD HH:MM:SS")
                        continue
                    except KeyError as e:
                        errors.append(f"Error en la fila {index + 2}: {e}")
                        continue

                if errors:
                    return 0, errors

                ClientProduction.objects.bulk_create(productions_to_create)

                return productions_created, []

        except Exception as e:
            return 0, [str(e)]