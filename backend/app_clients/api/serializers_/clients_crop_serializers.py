from rest_framework import serializers

from app_clients.domain.models_.clients_crop_models import ClientCrop

class ClientCropSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientCrop
        fields = '__all__'