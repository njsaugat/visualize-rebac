// First, set up the API client
// import { PermitApiClient } from '@permitio/permit-node';
import { Permit} from "permitio";

// const API_KEY = 'YOUR_PERMIT_API_KEY';
// const ENV_ID = 'YOUR_ENVIRONMENT_ID';
// const { Permit } = require('permitio');
const permit = new Permit({
    pdp: "https://cloudpdp.api.permit.io",
    token: process.env.PERMIT_API_KEY,
});


// async function createReBAC(){
//     // Define the Organization Resource
//     const organizationResource = {
//         key: "organization",
//         name: "Organization",
//         roles: {["member", "owner", "repo_admin", "repo_reader", "repo_writer"]}
//     };
//     await permit.api.createResource(JSON.stringify(organizationResource));

//     // Define the Repo Resource
//     const repoResource = {
//         key: "repo",
//         name: "Repository",
//         roles: ["admin", "maintainer", "owner", "reader", "triager", "writer"]
//     };
//     await permit.api.createResource(JSON.stringify(repoResource));

//     // Define the Team Resource
//     const teamResource = {
//         key: "team",
//         name: "Team",
//         roles: ["member"]
//     };
//     await permit.api.createResource(JSON.stringify(teamResource));

//     // Define the User Resource (No roles required for user type)
//     const userResource = {
//         key: "user",
//         name: "User"
//     };
//     await permit.api.createResource(JSON.stringify(userResource));



//     // Define relations for the Organization resource
//     await permit.api.resourceRelations.create("organization", {
//         key: "member",
//         name: "Member",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("organization", {
//         key: "owner",
//         name: "Owner",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("organization", {
//         key: "repo_admin",
//         name: "Repo Admin",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("organization", {
//         key: "repo_reader",
//         name: "Repo Reader",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("organization", {
//         key: "repo_writer",
//         name: "Repo Writer",
//         subject_resource: "user"
//     });

//     // Define relations for the Repo resource
//     await permit.api.resourceRelations.create("repo", {
//         key: "admin",
//         name: "Admin",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("repo", {
//         key: "maintainer",
//         name: "Maintainer",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("repo", {
//         key: "reader",
//         name: "Reader",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("repo", {
//         key: "triager",
//         name: "Triager",
//         subject_resource: "user"
//     });
//     await permit.api.resourceRelations.create("repo", {
//         key: "writer",
//         name: "Writer",
//         subject_resource: "user"
//     });

//     // Define relations for the Team resource
//     await permit.api.resourceRelations.create("team", {
//         key: "member",
//         name: "Member",
//         subject_resource: "user"
//     });



//     // Role Derivation for Repo Admin (inherited from Organization Repo Admin)
//     await permit.api.resourceRoles.update("repo", "admin", {
//         granted_to: {
//             users_with_role: [
//                 {
//                     linked_by_relation: "repo_admin",
//                     on_resource: "organization",
//                     role: "repo_admin"
//                 }
//             ]
//         }
//     });

//     // Role Derivation for Repo Maintainer (inherited from Admin)
//     await permit.api.resourceRoles.update("repo", "maintainer", {
//         granted_to: {
//             users_with_role: [
//                 {
//                     linked_by_relation: "admin",
//                     on_resource: "repo",
//                     role: "admin"
//                 }
//             ]
//         }
//     });

//     // Role Derivation for Repo Reader (inherited from Triager and Repo Reader of Organization)
//     await permit.api.resourceRoles.update("repo", "reader", {
//         granted_to: {
//             users_with_role: [
//                 {
//                     linked_by_relation: "triager",
//                     on_resource: "repo",
//                     role: "triager"
//                 },
//                 {
//                     linked_by_relation: "repo_reader",
//                     on_resource: "organization",
//                     role: "repo_reader"
//                 }
//             ]
//         }
//     });

//     // Role Derivation for Repo Triager (inherited from Writer)
//     await permit.api.resourceRoles.update("repo", "triager", {
//         granted_to: {
//             users_with_role: [
//                 {
//                     linked_by_relation: "writer",
//                     on_resource: "repo",
//                     role: "writer"
//                 }
//             ]
//         }
//     });

//     // Role Derivation for Repo Writer (inherited from Maintainer and Repo Writer of Organization)
//     await permit.api.resourceRoles.update("repo", "writer", {
//         granted_to: {
//             users_with_role: [
//                 {
//                     linked_by_relation: "maintainer",
//                     on_resource: "repo",
//                     role: "maintainer"
//                 },
//                 {
//                     linked_by_relation: "repo_writer",
//                     on_resource: "organization",
//                     role: "repo_writer"
//                 }
//             ]
//         }
//     });


//     // Assign a role to a user
//     await permit.api.roleAssignments.assign({
//         user: "alice@example.com",
//         role: "admin",
//         resource_instance: "repo:my-repo"
//     });


//     // Create an instance of a Repo
//     await permit.api.resourceInstances.create({
//         resource: "repo",
//         key: "my-repo",
//         tenant: "default"
//     });

//     // Create an instance of an Organization
//     await permit.api.resourceInstances.create({
//         resource: "organization",
//         key: "my-organization",
//         tenant: "default"
//     });

// }

// createReBAC()










// Initialize the required resources and their relationships
const createGitHubPermissionModel = async () => {
  // 1. Create Resources
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

  // Create all resources
  for (const [key, resource] of Object.entries(resources)) {
    await permit.api.createResource(JSON.stringify(resource));
  }

  // 2. Create Roles
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

  // Create all roles
  for (const [resource, resourceRoles] of Object.entries(roles)) {
    for (const role of resourceRoles) {
      await permit.api.createRole(JSON.stringify({
        ...role,
        resource: resource
      }));
    }
  }

  // 3. Create Resource Relations
  const relations = [
    // Organization relations
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
    // Team relations
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
    // Repository relations
    {
      resource: "repo",
      relation: {
        key: "owned_by",
        name: "Owned By",
        subject_resource: "organization"
      }
    }
  ];

  // Create all relations
  for (const relation of relations) {
    await permit.api.resourceRelations.create(relation.resource, relation.relation);
  }

  // 4. Set up role derivations
  const roleDerivations = [
    // Organization member gets access through owner
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
    // Repository admin gets access through organization repo_admin
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
    // Repository writer gets access through organization repo_writer
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

  // Create all role derivations
  for (const derivation of roleDerivations) {
    await permit.api.resourceRoles.update(
      derivation.resource,
      derivation.role,
      derivation.derivation
    );
  }
};

// Main execution function
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
// // First, let's create the necessary resources
// const repositoryResource = {
//   key: "repository",
//   name: "Repository",
//   description: "GitHub Repository",
//   actions: ["read", "write", "delete", "admin"]
// };

// const organizationResource = {
//   key: "organization",
//   name: "Organization",
//   description: "GitHub Organization",
//   actions: ["read", "write", "delete", "admin"]
// };

// const teamResource = {
//   key: "team",
//   name: "Team",
//   description: "GitHub Team",
//   actions: ["read", "write", "delete", "admin"]
// };

// // Create resources
// const createResources = async () => {
//   await permit.api.createResource(JSON.stringify(repositoryResource));
//   await permit.api.createResource(JSON.stringify(organizationResource));
//   await permit.api.createResource(JSON.stringify(teamResource));
// };

// // Define roles for each resource
// const roles = [
//   {
//     key: "admin",
//     name: "Admin",
//     description: "Full access to resource",
//     permissions: ["read", "write", "delete", "admin"]
//   },
//   {
//     key: "maintainer",
//     name: "Maintainer",
//     description: "Can read and write",
//     permissions: ["read", "write"]
//   },
//   {
//     key: "contributor",
//     name: "Contributor",
//     description: "Can read and submit changes",
//     permissions: ["read", "write"]
//   },
//   {
//     key: "viewer",
//     name: "Viewer",
//     description: "Read-only access",
//     permissions: ["read"]
//   }
// ];

// // Create roles for each resource
// const createRoles = async () => {
//   for (const resource of ["repository", "organization", "team"]) {
//     for (const role of roles) {
//       await permit.api.createRole(JSON.stringify({
//         ...role,
//         resource: resource
//       }));
//     }
//   }
// };

// // Create resource relations
// const createRelations = async () => {
//   // Organization owns repositories
//   await permit.api.resourceRelations.create("repository", {
//     key: "owned_by",
//     name: "Owned By",
//     subject_resource: "organization"
//   });

//   // Teams belong to organizations
//   await permit.api.resourceRelations.create("team", {
//     key: "belongs_to",
//     name: "Belongs To",
//     subject_resource: "organization"
//   });

//   // Repositories can be accessed by teams
//   await permit.api.resourceRelations.create("repository", {
//     key: "accessible_by",
//     name: "Accessible By",
//     subject_resource: "team"
//   });
// };

// // Set up role derivations
// const setupRoleDerivations = async () => {
//   // Organization admins get admin access to all repositories
//   await permit.api.resourceRoles.update("repository", "admin", {
//     granted_to: {
//       users_with_role: [
//         {
//           linked_by_relation: "owned_by",
//           on_resource: "organization",
//           role: "admin"
//         }
//       ]
//     }
//   });

//   // Team maintainers get contributor access to team's repositories
//   await permit.api.resourceRoles.update("repository", "contributor", {
//     granted_to: {
//       users_with_role: [
//         {
//           linked_by_relation: "accessible_by",
//           on_resource: "team",
//           role: "maintainer"
//         }
//       ]
//     }
//   });
// };

// // Create resource instances (example)
// const createInstances = async () => {
//   // Create organization instance
//   await permit.api.resourceInstances.create({
//     resource: "organization",
//     key: "acme-org",
//     tenant: "default"
//   });

//   // Create team instance
//   await permit.api.resourceInstances.create({
//     resource: "team",
//     key: "engineering-team",
//     tenant: "default"
//   });

//   // Create repository instance
//   await permit.api.resourceInstances.create({
//     resource: "repository",
//     key: "main-project",
//     tenant: "default"
//   });
// };

// // Create relationships between instances
// const createRelationships = async () => {
//   // Link repository to organization
//   await permit.api.relationshipTuples.create({
//     subject: "organization:acme-org",
//     relation: "owned_by",
//     object: "repository:main-project"
//   });

//   // Link team to organization
//   await permit.api.relationshipTuples.create({
//     subject: "organization:acme-org",
//     relation: "belongs_to",
//     object: "team:engineering-team"
//   });

//   // Link repository to team
//   await permit.api.relationshipTuples.create({
//     subject: "team:engineering-team",
//     relation: "accessible_by",
//     object: "repository:main-project"
//   });
// };

// // Assign roles to users
// const assignRoles = async () => {
//   // Assign organization admin
//   await permit.api.roleAssignments.assign({
//     user: "admin@acme.com",
//     role: "admin",
//     resource_instance: "organization:acme-org"
//   });

//   // Assign team maintainer
//   await permit.api.roleAssignments.assign({
//     user: "lead@acme.com",
//     role: "maintainer",
//     resource_instance: "team:engineering-team"
//   });

//   // Assign repository contributor
//   await permit.api.roleAssignments.assign({
//     user: "dev@acme.com",
//     role: "contributor",
//     resource_instance: "repository:main-project"
//   });
// };

// // Main function to set up the entire ReBAC policy
// const setupGitHubReBAC = async () => {
//   try {
//     await createResources();
//     await createRoles();
//     await createRelations();
//     await setupRoleDerivations();
//     await createInstances();
//     await createRelationships();
//     await assignRoles();
//     console.log("GitHub ReBAC policy setup completed successfully");
//   } catch (error) {
//     console.error("Error setting up GitHub ReBAC policy:", error);
//     throw error;
//   }
// };
// setupGitHubReBAC()
// Helper function to handle API calls
// async function createPermitResource(resourceKey, name, description) {
//     const resource={
//             key: resourceKey,
//             name: name,
//             description: description,
//             actions: {
//                 'read': {},
//                 'write': {},
//                 'delete': {},
//                 'admin': {}
//             },
//         }
//     try {
//         return await permit.api.createResource(JSON.stringify(resource));
//     } catch (error) {
//         console.error(`Error creating resource ${resourceKey}:`, error);
//     }
// }

// async function createPermitRole(roleKey, name, description, permissions) {
//     const role={
//             key: roleKey,
//             name: name,
//             description: description,
//             permissions: permissions
//         }
//     try {
//         return await permit.api.createRole(JSON.stringify(role));
//     } catch (error) {
//         console.error(`Error creating role ${roleKey}:`, error);
//     }
// }

// async function setupGithubStyleRebac() {
//     // 1. Create Resources
//     const resources = {
//         repo: await createPermitResource(
//             'repo',
//             'Repository',
//             'A GitHub repository resource'
//         ),
//         organization: await createPermitResource(
//             'organization',
//             'Organization',
//             'A GitHub organization resource'
//         ),
//         team: await createPermitResource(
//             'team',
//             'Team',
//             'A GitHub team resource'
//         ),
//         user: await createPermitResource(
//             'user',
//             'User',
//             'A GitHub user resource'
//         )
//     };

//     // 2. Create Roles for Repository
//     const repoRoles = {
//         reader: await createPermitRole(
//             'repo_reader',
//             'Repository Reader',
//             'Can read repository contents',
//             [{
//                 resource_key: 'repo',
//                 actions: ['read']
//             }]
//         ),
        
//         writer: await createPermitRole(
//             'repo_writer',
//             'Repository Writer',
//             'Can read and write repository contents',
//             [{
//                 resource_key: 'repo',
//                 actions: ['read', 'write']
//             }]
//         ),

//         triager: await createPermitRole(
//             'repo_triager',
//             'Repository Triager',
//             'Can triage issues and pull requests',
//             [{
//                 resource_key: 'repo',
//                 actions: ['read', 'write']
//             }]
//         ),

//         maintainer: await createPermitRole(
//             'repo_maintainer',
//             'Repository Maintainer',
//             'Can manage repository settings',
//             [{
//                 resource_key: 'repo',
//                 actions: ['read', 'write', 'admin']
//             }]
//         ),

//         admin: await createPermitRole(
//             'repo_admin',
//             'Repository Admin',
//             'Has full access to repository',
//             [{
//                 resource_key: 'repo',
//                 actions: ['read', 'write', 'delete', 'admin']
//             }]
//         )
//     };

//     // 3. Create Roles for Organization
//     const orgRoles = {
//         member: await createPermitRole(
//             'org_member',
//             'Organization Member',
//             'Basic organization member',
//             [{
//                 resource_key: 'organization',
//                 actions: ['read']
//             }]
//         ),

//         owner: await createPermitRole(
//             'org_owner',
//             'Organization Owner',
//             'Has full access to organization',
//             [{
//                 resource_key: 'organization',
//                 actions: ['read', 'write', 'delete', 'admin']
//             }]
//         ),

//         admin: await createPermitRole(
//             'org_admin',
//             'Organization Admin',
//             'Can manage organization settings',
//             [{
//                 resource_key: 'organization',
//                 actions: ['read', 'write', 'admin']
//             }]
//         )
//     };

//     // 4. Create Role Derivation Rules (ReBAC relationships)
//     const derivationRules = [
//         // Org owner inherits all repo admin permissions
//         await permit.api.roleDerivations.create({
//             role_key: 'org_owner',
//             on_resource: 'organization',
//             grants_role: 'repo_admin',
//             on_resource_type: 'repo',
//             when: {
//                 context: {
//                     organization: { id: '{organization.id}' }
//                 }
//             }
//         }),

//         // Org admin inherits repo admin on org repos
//         await permit.api.roleDerivations.create({
//             role_key: 'org_admin',
//             on_resource: 'organization',
//             grants_role: 'repo_admin',
//             on_resource_type: 'repo',
//             when: {
//                 context: {
//                     organization: { id: '{organization.id}' }
//                 }
//             }
//         }),

//         // Team member inheritance
//         await permit.api.roleDerivations.create({
//             role_key: 'org_member',
//             on_resource: 'team',
//             grants_role: 'repo_reader',
//             on_resource_type: 'repo',
//             when: {
//                 context: {
//                     team: { id: '{team.id}' }
//                 }
//             }
//         })
//     ];

//     return {
//         resources,
//         repoRoles,
//         orgRoles,
//         derivationRules
//     };
// }

// // Execute the setup
// async function main() {
//     try {
//         console.log('Setting up GitHub-style ReBAC policy...');
//         const setup = await setupGithubStyleRebac();
//         console.log('Setup completed successfully!');
//         return setup;
//     } catch (error) {
//         console.error('Error during setup:', error);
//         throw error;
//     }
// }

// main();