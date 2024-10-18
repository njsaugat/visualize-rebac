terraform {
  required_providers {
    permitio = {
      source  = "registry.terraform.io/permitio/permit-io"
      version = "~> 0.0.1"
    }
  }
}

provider "permit" {
  # Configure the Permit Provider
  api_key = var.permit_api_key
  environment = "https://api.permit.io" # e.g., "prod"
}

# Resource Types
resource "permit_resource" "repo" {
  key         = "repo"
  name        = "Repository"
  description = "A GitHub repository resource"
  
  actions = {
    "read" = {
      name = "Read"
      description = "Read repository contents"
    }
    "write" = {
      name = "Write"
      description = "Write to repository"
    }
    "delete" = {
      name = "Delete"
      description = "Delete repository content"
    }
    "admin" = {
      name = "Admin"
      description = "Administrate repository"
    }
  }
}

resource "permit_resource" "organization" {
  key         = "organization"
  name        = "Organization"
  description = "A GitHub organization resource"
  
  actions = {
    "read" = {
      name = "Read"
      description = "Read organization details"
    }
    "write" = {
      name = "Write"
      description = "Modify organization settings"
    }
    "delete" = {
      name = "Delete"
      description = "Delete organization resources"
    }
    "admin" = {
      name = "Admin"
      description = "Administrate organization"
    }
  }
}

resource "permit_resource" "team" {
  key         = "team"
  name        = "Team"
  description = "A GitHub team resource"
  
  actions = {
    "read" = {
      name = "Read"
      description = "Read team details"
    }
    "write" = {
      name = "Write"
      description = "Modify team settings"
    }
    "admin" = {
      name = "Admin"
      description = "Administrate team"
    }
  }
}

resource "permit_resource" "user" {
  key         = "user"
  name        = "User"
  description = "A GitHub user resource"
  
  actions = {
    "read" = {
      name = "Read"
      description = "Read user profile"
    }
    "write" = {
      name = "Write"
      description = "Modify user settings"
    }
  }
}

# Repository Roles
resource "permit_role" "repo_reader" {
  key         = "repo_reader"
  name        = "Repository Reader"
  description = "Can read repository contents"
  
  permissions = [
    {
      resource_key = permit_resource.repo.key
      actions      = ["read"]
    }
  ]
}

resource "permit_role" "repo_writer" {
  key         = "repo_writer"
  name        = "Repository Writer"
  description = "Can read and write repository contents"
  
  permissions = [
    {
      resource_key = permit_resource.repo.key
      actions      = ["read", "write"]
    }
  ]
}

resource "permit_role" "repo_maintainer" {
  key         = "repo_maintainer"
  name        = "Repository Maintainer"
  description = "Can manage repository settings"
  
  permissions = [
    {
      resource_key = permit_resource.repo.key
      actions      = ["read", "write", "admin"]
    }
  ]
}

resource "permit_role" "repo_admin" {
  key         = "repo_admin"
  name        = "Repository Admin"
  description = "Has full access to repository"
  
  permissions = [
    {
      resource_key = permit_resource.repo.key
      actions      = ["read", "write", "delete", "admin"]
    }
  ]
}

# Organization Roles
resource "permit_role" "org_member" {
  key         = "org_member"
  name        = "Organization Member"
  description = "Basic organization member"
  
  permissions = [
    {
      resource_key = permit_resource.organization.key
      actions      = ["read"]
    }
  ]
}

resource "permit_role" "org_owner" {
  key         = "org_owner"
  name        = "Organization Owner"
  description = "Has full access to organization"
  
  permissions = [
    {
      resource_key = permit_resource.organization.key
      actions      = ["read", "write", "delete", "admin"]
    }
  ]
}

# Role Derivation Rules (ReBAC relationships)
resource "permit_role_derivation_rule" "org_owner_to_repo_admin" {
  role_key         = permit_role.org_owner.key
  on_resource      = permit_resource.organization.key
  grants_role      = permit_role.repo_admin.key
  on_resource_type = permit_resource.repo.key
  
  when = {
    context = {
      organization = {
        id = "{organization.id}"
      }
    }
  }
}

resource "permit_role_derivation_rule" "team_member_to_repo_reader" {
  role_key         = permit_role.org_member.key
  on_resource      = permit_resource.team.key
  grants_role      = permit_role.repo_reader.key
  on_resource_type = permit_resource.repo.key
  
  when = {
    context = {
      team = {
        id = "{team.id}"
      }
    }
  }
}