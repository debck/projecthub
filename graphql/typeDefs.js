const gql = require("graphql-tag");

module.exports = gql`
  type Project {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getProjects: [Project]
    getProject(ProjectId: ID!): Project
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createProject(body: String!): Project!
    deleteProject(ProjectId: ID!): String!
    createComment(ProjectId: String!, body: String!): Project!
    deleteComment(ProjectId: ID!, commentId: ID!): Project!
    likeProject(ProjectId: ID!): Project!
  }
`;
