from django.db import models
from django.contrib.auth.models import User
from app_clients.domain.models_.clients_models import Client

class ClientProduction(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)

    FECHA_COS = models.DateField(null=True)
    FECHA_SIEM = models.DateField(null=True)

    NOM_HAC = models.CharField(max_length=50, blank=True, null=True)
    STE = models.CharField(max_length=50, blank=True, null=True)
    STE2 = models.CharField(max_length=50, blank=True, null=True)
    VAR = models.CharField(max_length=50, blank=True, null=True)

    AREA = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    EDAD_COS = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    NCTE = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    SAC = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    TCH = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    TCHM = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    TAH = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    TAHM = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    REND_COM = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    MAT_EXT = models.DecimalField(max_digits=12, decimal_places=2, null=True)

    updated_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.client.name

    class Meta:
        db_table = "client_productions"