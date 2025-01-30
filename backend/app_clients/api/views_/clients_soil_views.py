from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_clients.application.services_.clients_soil_services import ClientSoilService
from app_clients.api.serializers_.clients_soil_serializers import ClientSoilSerializer

class ClientSoilView(APIView):

    def __init__(self):
        self.client_soil_service = ClientSoilService()

    def get(self, request, client_soil_id=None):
        try:
            if client_soil_id:
                client_soil = self.client_soil_service.get_client_soil_by_id(client_soil_id)
                if not client_soil:
                    return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)
                serializer_client_soil = ClientSoilSerializer(client_soil)
                return Response({"client_soil": serializer_client_soil.data}, status=status.HTTP_200_OK)
            else:
                client_soils = self.client_soil_service.get_client_soils()
                serializer_client_soil = ClientSoilSerializer(client_soils, many=True)
                return Response({"client_soils": serializer_client_soil.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ClientSoilSerializer(data=request.data)
        if serializer.is_valid():
            if self.client_soil_service.client_soil_exists(serializer.validated_data["name"]):
                return Response({"error": "Movement Type already exists"}, status=status.HTTP_409_CONFLICT)

            try:
                client_soil = self.client_soil_service.create_client_soil(serializer.validated_data["name"])
                if client_soil:
                    client_soil_serializer = ClientSoilSerializer(client_soil)
                    return Response({"client_soil": client_soil_serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        client_soil_id = request.data.get("id")
        if not client_soil_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        client_soil = self.client_soil_service.get_client_soil_by_id(client_soil_id)
        if not client_soil:
            return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            updated_client_soil = self.client_soil_service.update_client_soil(client_soil_id, request.data.get("name"))
            if updated_client_soil:
                serializer_client_soil = ClientSoilSerializer(updated_client_soil)
                return Response({"client_soil": serializer_client_soil.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Movement Type update failed"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        client_soil_id = request.data.get("id")
        if not client_soil_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        client_soil = self.client_soil_service.get_client_soil_by_id(client_soil_id)
        if not client_soil:
            return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            result = self.client_soil_service.delete_client_soil(client_soil_id)
            if result:
                return Response({"message": "Movement Type successfully deleted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Movement Type deletion failed"}, status=status.HTTP_400_BAD_REQUEST)