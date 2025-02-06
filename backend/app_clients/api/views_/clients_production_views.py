from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_clients.application.services_.clients_production_services import ClientProductionService
from app_clients.api.serializers_.clients_production_serializers import ClientProductionSerializer

class ClientProductionView(APIView):

    def __init__(self):
        self.client_production_service = ClientProductionService()

    def get(self, request, client_production_id=None):
        try:
            if client_production_id:
                client_production = self.client_production_service.get_client_production_by_id(client_production_id)
                if not client_production:
                    return Response({"error": "Client production not found"}, status=status.HTTP_404_NOT_FOUND)
                serializer_client_production = ClientProductionSerializer(client_production)
                return Response({"client_production": serializer_client_production.data}, status=status.HTTP_200_OK)
            else:
                client_productions = self.client_production_service.get_client_productions()
                serializer_client_production = ClientProductionSerializer(client_productions, many=True)
                return Response({"client_productions": serializer_client_production.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ClientProductionSerializer(data=request.data)
        if serializer.is_valid():
            if self.client_production_service.client_production_exists(serializer.validated_data["name"]):
                return Response({"error": "Movement Type already exists"}, status=status.HTTP_409_CONFLICT)

            try:
                client_production = self.client_production_service.create_client_production(serializer.validated_data["name"])
                if client_production:
                    client_production_serializer = ClientProductionSerializer(client_production)
                    return Response({"client_production": client_production_serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        client_production_id = request.data.get("id")
        if not client_production_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        client_production = self.client_production_service.get_client_production_by_id(client_production_id)
        if not client_production:
            return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            updated_client_production = self.client_production_service.update_client_production(client_production_id, request.data.get("name"))
            if updated_client_production:
                serializer_client_production = ClientProductionSerializer(updated_client_production)
                return Response({"client_production": serializer_client_production.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Movement Type update failed"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        client_production_id = request.data.get("id")
        if not client_production_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        client_production = self.client_production_service.get_client_production_by_id(client_production_id)
        if not client_production:
            return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            result = self.client_production_service.delete_client_production(client_production_id)
            if result:
                return Response({"message": "Movement Type successfully deleted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Movement Type deletion failed"}, status=status.HTTP_400_BAD_REQUEST)

class UploadProductionView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.client_production_service = ClientProductionService()

    def post(self, request):
        if 'document' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            productions_created, errors = self.client_production_service.upload_productions(request)

            if errors:
                print(errors)
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": f"{productions_created} productions created successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)