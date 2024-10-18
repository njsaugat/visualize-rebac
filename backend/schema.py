import asyncio
from permit import Permit

async def main():
    # Create Organization Resource
    await permit.api.create_resource(
        resource_type="organization",
        schema="1.1",
        relations={
            "member": "[user] or owner",
            "owner": "[user]",
            "repo_admin": "[user, organization#member]",
            "repo_reader": "[user, organization#member]",
            "repo_writer": "[user, organization#member]"
        }
    )

    # Create Repo Resource
    await permit.api.create_resource(
        resource_type="repo",
        schema="1.1",
        relations={
            "admin": "[user, team#member] or repo_admin from owner",
            "maintainer": "[user, team#member] or admin",
            "owner": "[organization]",
            "reader": "[user, team#member] or triager or repo_reader from owner",
            "triager": "[user, team#member] or writer",
            "writer": "[user, team#member] or maintainer or repo_writer from owner"
        }
    )

    # Create Team Resource
    await permit.api.create_resource(
        resource_type="team",
        schema="1.1",
        relations={
            "member": "[user, team#member]"
        }
    )

    # Create User Resource
    await permit.api.create_resource(
        resource_type="user"
    )


if __name__=="main":
    asyncio.run(main)