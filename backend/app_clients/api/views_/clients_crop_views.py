from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_clients.application.services_.clients_crop_services import ClientCropService
from app_clients.api.serializers_.clients_crop_serializers import ClientCropSerializer

class ClientCropView(APIView):

    def __init__(self):
        self.client_crop_service = ClientCropService()

    def get(self, request, client_crop_id=None):
        try:
            if client_crop_id:
                client_crop = self.client_crop_service.get_client_crop_by_id(client_crop_id)
                if not client_crop:
                    return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)
                serializer_client_crop = ClientCropSerializer(client_crop)
                return Response({"client_crop": serializer_client_crop.data}, status=status.HTTP_200_OK)
            else:
                client_crops = self.client_crop_service.get_client_crops()
                serializer_client_crop = ClientCropSerializer(client_crops, many=True)
                return Response({"client_crops": serializer_client_crop.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ClientCropSerializer(data=request.data)
        if serializer.is_valid():
            if self.client_crop_service.client_crop_exists(serializer.validated_data["name"]):
                return Response({"error": "Movement Type already exists"}, status=status.HTTP_409_CONFLICT)

            try:
                client_crop = self.client_crop_service.create_client_crop(serializer.validated_data["name"])
                if client_crop:
                    client_crop_serializer = ClientCropSerializer(client_crop)
                    return Response({"client_crop": client_crop_serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        client_crop_id = request.data.get("id")
        if not client_crop_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        client_crop = self.client_crop_service.get_client_crop_by_id(client_crop_id)
        if not client_crop:
            return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            updated_client_crop = self.client_crop_service.update_client_crop(client_crop_id, request.data.get("name"))
            if updated_client_crop:
                serializer_client_crop = ClientCropSerializer(updated_client_crop)
                return Response({"client_crop": serializer_client_crop.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Movement Type update failed"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        client_crop_id = request.data.get("id")
        if not client_crop_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        client_crop = self.client_crop_service.get_client_crop_by_id(client_crop_id)
        if not client_crop:
            return Response({"error": "Movement Type not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            result = self.client_crop_service.delete_client_crop(client_crop_id)
            if result:
                return Response({"message": "Movement Type successfully deleted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Movement Type deletion failed"}, status=status.HTTP_400_BAD_REQUEST)