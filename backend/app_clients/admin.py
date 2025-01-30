from django.contrib import admin

from .domain.models_.clients_crop_models import ClientCrop
from .domain.models_.clients_models import Client

admin.site.register(Client)
admin.site.register(ClientCrop)
