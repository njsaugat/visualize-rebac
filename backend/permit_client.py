from permit import Permit  
from config import settings

class PermitClient:
    def __init__(self):
        self.permit = Permit(
            token=settings.PERMIT_API_KEY,
            pdp_url=settings.PERMIT_PDP_URL,
            # env_id=settings.PERMIT_ENV_ID
        )
        
    async def create_resource(self, resource_data: dict):
        try:
            return await self.permit.api.resources.create(**resource_data)
        except Exception as e:
            print(f"Error creating resource: {e}")
            raise

    async def create_role(self, role_data: dict):
        try:
            return await self.permit.api.roles.create(**role_data)
        except Exception as e:
            print(f"Error creating role: {e}")
            raise

    async def create_role_derivation(self, derivation_data: dict):
        try:
            return await self.permit.api.role_derivations.create(**derivation_data)
        except Exception as e:
            print(f"Error creating role derivation: {e}")
            raise

    async def sync_user(self, user_data: dict):
        try:
            return await self.permit.api.users.sync(**user_data)
        except Exception as e:
            print(f"Error syncing user: {e}")
            raise

    async def check_permission(self, check_data: dict):
        try:
            return await self.permit.check(**check_data)
        except Exception as e:
            print(f"Error checking permission: {e}")
            raise

permit_client = PermitClient()