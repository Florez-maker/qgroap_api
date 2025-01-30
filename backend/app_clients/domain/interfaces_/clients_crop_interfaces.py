from abc import ABC, abstractmethod

class IClientCropRepository(ABC):

    @abstractmethod
    def get_client_crops(self):
        pass

    @abstractmethod
    def create(self, data : dict):
        pass

    @abstractmethod
    def client_crop_exists(self, data : dict):
        pass

    @abstractmethod
    def client_crop_exists_by_id(self, id : int):
        pass

    @abstractmethod
    def update(self, id : int, data: dict):
        pass

    @abstractmethod
    def delete(self, id : int):
        pass