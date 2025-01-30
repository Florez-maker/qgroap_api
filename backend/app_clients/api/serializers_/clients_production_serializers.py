from rest_framework import serializers

from app_clients.api.serializers_.clients_serializers import ClientSerializer
from app_clients.domain.models_.clients_models import Client
from app_clients.domain.models_.clients_production_models import ClientProduction

class ClientProductionSerializer(serializers.ModelSerializer):
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)

    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client', write_only=True
    )

    class Meta:
        model = ClientProduction
        fields = '__all__'