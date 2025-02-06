from django.urls import path
from app_clients.api.views_.clients_production_views import ClientProductionView, UploadProductionView
from app_clients.api.views_.clients_soil_views import ClientSoilView
from app_clients.api.views_.clients_views import ClientView
from app_clients.api.views_.clients_crop_views import ClientCropView

urlpatterns = [
    path('clients/', ClientView.as_view(), name='client_list'),
    path('clients/<int:id>/', ClientView.as_view(), name='client_detail'),
    path('client_crops/', ClientCropView.as_view(), name='client_crop_list'),
    path('client_crops/<int:id>/', ClientCropView.as_view(), name='client_crop_detail'),
    path('client_productions/', ClientProductionView.as_view(), name='client_production_list'),
    path('client_productions/<int:id>/', ClientProductionView.as_view(), name='client_production_detail'),
    path('client_productions/upload_productions/', UploadProductionView.as_view(), name='upload_prodcutions'),
    path('client_soils/', ClientSoilView.as_view(), name='client_soil_list'),
    path('client_soils/<int:id>/', ClientSoilView.as_view(), name='client_soil_detail'),
]
