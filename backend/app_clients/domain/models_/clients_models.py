from django.db import models
from django.contrib.auth.models import User

from app_clients.domain.models_.clients_crop_models import ClientCrop

class Client(models.Model):
    name = models.CharField(max_length=150, unique=True)
    company = models.CharField(max_length=150)
    country = models.CharField(max_length=150)
    city = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    client_crop = models.ForeignKey(ClientCrop, on_delete=models.CASCADE, null=True)
    is_active = models.BooleanField(default=True)
    updated_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "clients"