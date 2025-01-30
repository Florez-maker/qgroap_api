from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_clients.application.services_.clients_services import ClientService
from app_clients.api.serializers_.clients_serializers import ClientSerializer
from django.core.exceptions import ValidationError

class ClientView(APIView):

    def __init__(self):
        self.client_service = ClientService()

    def get(self, request, id=None):
        try:
            if id:
                client = self.client_service.get_client_by_id(id)
                if not client:
                    return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)
                serializer_client = ClientSerializer(client)
                return Response({"client": serializer_client.data}, status=status.HTTP_200_OK)
            else:
                clients = self.client_service.get_clients()
                serializer_client = ClientSerializer(clients, many=True)
                return Response({"clients": serializer_client.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = ClientSerializer(data=request.data)
            if not serializer.is_valid():
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if self.client_service.client_exists(request.data):
                return Response({"error": "Client already exists"}, status=status.HTTP_409_CONFLICT)

            client = self.client_service.create(request.data)
            if client:
                serializer_client = ClientSerializer(client)
                return Response({"client": serializer_client.data}, status=status.HTTP_201_CREATED)
            return Response({"error": "Client creation failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, id=None):
        try:
            if not id:
                return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not self.client_service.client_exists_by_id(id):
                return Response({"error": "Client doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

            client = self.client_service.update(id, request.data)
            if client:
                serializer_client = ClientSerializer(client)
                return Response({"client": serializer_client.data}, status=status.HTTP_200_OK)
            return Response({"error": "Client update failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id=None):
        try:
            if not id:
                return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not self.client_service.client_exists_by_id(id):
                return Response({"error": "Client doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

            try:
                self.client_service.delete(id)
            except ValidationError as e:
                return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)