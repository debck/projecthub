const ProjectsResolvers = require("./project");
const usersResolvers = require("./users");

module.exports = {
  Project: {
    likeCount: parent => parent.likes.length,
    commentCount: parent => parent.comments.length
  },
  Query: {
    ...ProjectsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...ProjectsResolvers.Mutation
  }
};
