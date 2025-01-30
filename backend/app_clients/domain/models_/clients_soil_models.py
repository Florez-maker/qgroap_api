from django.db import models
from django.contrib.auth.models import User
from app_clients.domain.models_.clients_models import Client

class ClientSoil(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)

    STE = models.CharField(max_length=50, blank=True, null=True)
    NOM_HAC = models.CharField(max_length=50, blank=True, null=True)
    PROF = models.CharField(max_length=50, blank=True, null=True)
    TEXT = models.CharField(max_length=50, blank=True, null=True)

    pH = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Ca = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    P = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    MO = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Cea = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Pb = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    PO = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Mg = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Na = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    K = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    KNa = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Al = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    CIC = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    CaMg = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    CaMgK = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    B = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Cu = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Fe = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Mn = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    FeMn = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Zn = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    S = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    Ar = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    L = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    A = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    N = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    CO = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    CN = models.DecimalField(max_digits=12, decimal_places=2, null=True)

    updated_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.client.name

    class Meta:
        db_table = "client_soils"