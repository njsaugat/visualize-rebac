import { Permit} from "permitio";

const permit = new Permit({
    pdp: "https://cloudpdp.api.permit.io",
    token: process.env.PERMIT_API_KEY,
});



const createGitHubPermissionModel = async () => {
  const resources = {
    organization: {
      key: "organization",
      name: "Organization",
      description: "GitHub Organization",
      actions: {
        member: "Can access organization resources",
        owner: "Can manage organization",
        repo_admin: "Can administrate repositories",
        repo_reader: "Can read repositories",
        repo_writer: "Can write to repositories"
      }
    },
    repo: {
      key: "repo",
      name: "Repository",
      description: "GitHub Repository",
      actions: {
        admin: "Full repository access",
        maintainer: "Can maintain repository",
        reader: "Can read repository",
        writer: "Can write to repository",
        triager: "Can triage issues and PRs",
        owner: "Owns the repository"
      }
    },
    team: {
      key: "team",
      name: "Team",
      description: "GitHub Team",
      actions: {
        member: "Is a member of the team"
      }
    },
    user: {
      key: "user",
      name: "User",
      description: "GitHub User",
      actions: {}
    }
  };

  for (const [_, resource] of Object.entries(resources)) {
    await permit.api.createResource(JSON.stringify(resource));
  }

  const roles = {
    organization: [
      {
        key: "owner",
        name: "Owner",
        description: "Organization owner",
        permissions: ["owner"]
      },
      {
        key: "member",
        name: "Member",
        description: "Organization member",
        permissions: ["member"]
      },
      {
        key: "repo_admin",
        name: "Repository Admin",
        description: "Can administer repositories",
        permissions: ["repo_admin"]
      },
      {
        key: "repo_reader",
        name: "Repository Reader",
        description: "Can read repositories",
        permissions: ["repo_reader"]
      },
      {
        key: "repo_writer",
        name: "Repository Writer",
        description: "Can write to repositories",
        permissions: ["repo_writer"]
      }
    ],
    repo: [
      {
        key: "admin",
        name: "Admin",
        description: "Repository administrator",
        permissions: ["admin"]
      },
      {
        key: "maintainer",
        name: "Maintainer",
        description: "Repository maintainer",
        permissions: ["maintainer", "writer", "reader"]
      },
      {
        key: "writer",
        name: "Writer",
        description: "Repository writer",
        permissions: ["writer", "reader"]
      },
      {
        key: "triager",
        name: "Triager",
        description: "Repository triager",
        permissions: ["triager", "reader"]
      },
      {
        key: "reader",
        name: "Reader",
        description: "Repository reader",
        permissions: ["reader"]
      }
    ],
    team: [
      {
        key: "member",
        name: "Member",
        description: "Team member",
        permissions: ["member"]
      }
    ]
  };

  for (const [resource, resourceRoles] of Object.entries(roles)) {
    for (const role of resourceRoles) {
      await permit.api.createRole(JSON.stringify({
        ...role,
        resource: resource
      }));
    }
  }

  const relations = [
    {
      resource: "organization",
      relation: {
        key: "has_member",
        name: "Has Member",
        subject_resource: "user"
      }
    },
    {
      resource: "organization",
      relation: {
        key: "owns_repo",
        name: "Owns Repository",
        subject_resource: "repo"
      }
    },
    {
      resource: "team",
      relation: {
        key: "belongs_to",
        name: "Belongs To",
        subject_resource: "organization"
      }
    },
    {
      resource: "team",
      relation: {
        key: "has_member",
        name: "Has Member",
        subject_resource: "user"
      }
    },
    {
      resource: "repo",
      relation: {
        key: "owned_by",
        name: "Owned By",
        subject_resource: "organization"
      }
    }
  ];

  for (const relation of relations) {
    await permit.api.resourceRelations.create(relation.resource, relation.relation);
  }

  const roleDerivations = [
    {
      resource: "organization",
      role: "member",
      derivation: {
        granted_to: {
          users_with_role: [
            {
              role: "owner",
              on_resource: "organization"
            }
          ]
        }
      }
    },
    {
      resource: "repo",
      role: "admin",
      derivation: {
        granted_to: {
          users_with_role: [
            {
              role: "repo_admin",
              on_resource: "organization",
              linked_by_relation: "owned_by"
            }
          ]
        }
      }
    },
    {
      resource: "repo",
      role: "writer",
      derivation: {
        granted_to: {
          users_with_role: [
            {
              role: "repo_writer",
              on_resource: "organization",
              linked_by_relation: "owned_by"
            }
          ]
        }
      }
    }
  ];

  for (const derivation of roleDerivations) {
    await permit.api.resourceRoles.update(
      derivation.resource,
      derivation.role,
      derivation.derivation
    );
  }
};

const setupPermitResources = async () => {
  try {
    await createGitHubPermissionModel();
    console.log("Successfully created GitHub permission model in Permit.io");
  } catch (error) {
    console.error("Error creating GitHub permission model:", error);
    throw error;
  }
};
setupPermitResources()
