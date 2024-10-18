const graphData = {
  nodes: [
    // Store nodes (brown)
    { id: "github", group: "store", color: "#6B6054" },

    // Type nodes (purple)
    { id: "repo", group: "type", color: "#9D8EC7" },
    { id: "organization", group: "type", color: "#9D8EC7" },
    { id: "user", group: "type", color: "#9D8EC7" },
    { id: "team", group: "type", color: "#9D8EC7" },

    // Relations nodes (green)
    { id: "triager", group: "relations", color: "#4CAF50" },
    { id: "reader", group: "relations", color: "#4CAF50" },
    { id: "writer", group: "relations", color: "#4CAF50" },
    { id: "maintainer", group: "relations", color: "#4CAF50" },
    { id: "owner", group: "relations", color: "#4CAF50" },
    { id: "admin", group: "relations", color: "#4CAF50" },
    { id: "repo_admin", group: "relations", color: "#4CAF50" },
    { id: "repo_reader", group: "relations", color: "#4CAF50" },
    { id: "repo_writer", group: "relations", color: "#4CAF50" },
    { id: "member", group: "relations", color: "#4CAF50" },
  ],
  links: [
    // Github connections
    { source: "github", target: "repo" },
    { source: "github", target: "organization" },
    { source: "github", target: "user" },
    { source: "github", target: "team" },

    // Repo connections
    { source: "repo", target: "triager" },
    { source: "repo", target: "reader" },
    { source: "repo", target: "writer" },
    { source: "repo", target: "maintainer" },
    { source: "repo", target: "owner" },
    { source: "repo", target: "admin" },

    // Organization connections
    { source: "organization", target: "repo_admin" },
    { source: "organization", target: "repo_reader" },
    { source: "organization", target: "repo_writer" },
    { source: "organization", target: "owner" },
    { source: "organization", target: "member" },

    // Team connection
    { source: "team", target: "member" },
  ],
};

export default graphData;
