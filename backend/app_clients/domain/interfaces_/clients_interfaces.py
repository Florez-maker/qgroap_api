from abc import ABC, abstractmethod

class IClientRepository(ABC):

    @abstractmethod
    def get_clients(self):
        pass

    @abstractmethod
    def create(self, data : dict):
        pass

    @abstractmethod
    def client_exists(self, data : dict):
        pass

    @abstractmethod
    def client_exists_by_id(self, id : int):
        pass

    @abstractmethod
    def update(self, id : int, data: dict):
        pass

    @abstractmethod
    def delete(self, id : int):
        pass