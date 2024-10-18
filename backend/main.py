import asyncio
from permit_client import permit_client

async def setup_github_rebac():
    # 1. Create Resources
    resources = {
        'repo': await permit_client.create_resource({
            'key': 'repo',
            'name': 'Repository',
            'description': 'A GitHub repository resource',
            'actions': {
                'read': {},
                'write': {},
                'delete': {},
                'admin': {}
            }
        }),
        
        'organization': await permit_client.create_resource({
            'key': 'organization',
            'name': 'Organization',
            'description': 'A GitHub organization resource',
            'actions': {
                'read': {},
                'write': {},
                'delete': {},
                'admin': {}
            }
        }),
        
        'team': await permit_client.create_resource({
            'key': 'team',
            'name': 'Team',
            'description': 'A GitHub team resource',
            'actions': {
                'read': {},
                'write': {},
                'delete': {},
                'admin': {}
            }
        }),
        
        'user': await permit_client.create_resource({
            'key': 'user',
            'name': 'User',
            'description': 'A GitHub user resource',
            'actions': {
                'read': {},
                'write': {},
                'admin': {}
            }
        })
    }

    # 2. Create Repository Roles
    repo_roles = {
        'reader': await permit_client.create_role({
            'key': 'repo_reader',
            'name': 'Repository Reader',
            'description': 'Can read repository contents',
            'permissions': [{
                'resource_key': 'repo',
                'actions': ['read']
            }]
        }),
        
        'writer': await permit_client.create_role({
            'key': 'repo_writer',
            'name': 'Repository Writer',
            'description': 'Can read and write repository contents',
            'permissions': [{
                'resource_key': 'repo',
                'actions': ['read', 'write']
            }]
        }),
        
        'maintainer': await permit_client.create_role({
            'key': 'repo_maintainer',
            'name': 'Repository Maintainer',
            'description': 'Can manage repository settings',
            'permissions': [{
                'resource_key': 'repo',
                'actions': ['read', 'write', 'admin']
            }]
        }),
        
        'admin': await permit_client.create_role({
            'key': 'repo_admin',
            'name': 'Repository Admin',
            'description': 'Has full access to repository',
            'permissions': [{
                'resource_key': 'repo',
                'actions': ['read', 'write', 'delete', 'admin']
            }]
        })
    }

    # 3. Create Organization Roles
    org_roles = {
        'member': await permit_client.create_role({
            'key': 'org_member',
            'name': 'Organization Member',
            'description': 'Basic organization member',
            'permissions': [{
                'resource_key': 'organization',
                'actions': ['read']
            }]
        }),
        
        'owner': await permit_client.create_role({
            'key': 'org_owner',
            'name': 'Organization Owner',
            'description': 'Has full access to organization',
            'permissions': [{
                'resource_key': 'organization',
                'actions': ['read', 'write', 'delete', 'admin']
            }]
        })
    }

    # 4. Create Role Derivation Rules
    derivation_rules = [
        await permit_client.create_role_derivation({
            'role_key': 'org_owner',
            'on_resource': 'organization',
            'grants_role': 'repo_admin',
            'on_resource_type': 'repo',
            'when': {
                'context': {
                    'organization': {'id': '{organization.id}'}
                }
            }
        }),
        
        await permit_client.create_role_derivation({
            'role_key': 'org_member',
            'on_resource': 'team',
            'grants_role': 'repo_reader',
            'on_resource_type': 'repo',
            'when': {
                'context': {
                    'team': {'id': '{team.id}'}
                }
            }
        })
    ]

    return {
        'resources': resources,
        'repo_roles': repo_roles,
        'org_roles': org_roles,
        'derivation_rules': derivation_rules
    }


asyncio.run(setup_github_rebac())
# if __name__=="main":
# import asyncio

# from permit import Permit
# from fastapi import FastAPI, status, HTTPException
# from fastapi.responses import JSONResponse

# app = FastAPI()

# # This line initializes the SDK and connects your python app

# # to the Permit.io PDP container you've set up in the previous step.

# permit = Permit(  # in production, you might need to change this url to fit your deployment
#     pdp="https://cloudpdp.api.permit.io",  # your api key
#     token="permit_key_wpyH73WEAGxzWrXsa4PZC5XNNIQCcvtAPatq874IcUBJ2Wr9snYzSYs74SrmhQoV6gvnwVrHpyWVbLopGcyyyq",
# )

# # This user was defined by you in the previous step and

# # is already assigned with a role in the permission system.

# user = {
#     "id": "John@Doe.com",
#     "firstName": "John",
#     "lastName": "Doe",
#     "email": "John@Doe.com",
# }  # in a real app, you would typically decode the user id from a JWT token


# @app.get("/")
# async def check_permissions():  # After we created this user in the previous step, we also synced the user's identifier # to permit.io servers with permit.write(permit.api.syncUser(user)). The user identifier # can be anything (email, db id, etc) but must be unique for each user. Now that the # user is synced, we can use its identifier to check permissions with 'permit.check()'.
#     permitted = await permit.check(user["id"], "publicize", "Repository")
#     if not permitted:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
#             "result": f"{user.get('firstName')} {user.get('lastName')} is NOT PERMITTED to read document!"
#         })

#     return JSONResponse(status_code=status.HTTP_200_OK, content={
#         "result": f"{user.get('firstName')} {user.get('lastName')} is PERMITTED to read document!"
#     })