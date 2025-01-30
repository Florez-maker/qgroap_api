from rest_framework import serializers

from app_clients.api.serializers_.clients_crop_serializers import ClientCropSerializer
from app_clients.domain.models_.clients_crop_models import ClientCrop
from app_clients.domain.models_.clients_models import Client

class ClientSerializer(serializers.ModelSerializer):
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)

    client_crop = ClientCropSerializer(read_only=True)
    client_crop_id = serializers.PrimaryKeyRelatedField(
        queryset=ClientCrop.objects.all(), source='client_crop', write_only=True
    )

    class Meta:
        model = Client
        fields = '__all__'