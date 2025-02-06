from django.contrib import admin

from .domain.models_.clients_crop_models import ClientCrop
from .domain.models_.clients_models import Client
from .domain.models_.clients_production_models import ClientProduction
from .domain.models_.clients_soil_models import ClientSoil

admin.site.register(Client)
admin.site.register(ClientCrop)
admin.site.register(ClientProduction)
admin.site.register(ClientSoil)
