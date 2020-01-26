const Project = require("../../models/Project");
const checkAuth = require("../../utils/checkAuth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getProjects() {
      try {
        const Projects = await Project.find().sort({ createdAt: -1 });
        return Projects;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getProject(_, { ProjectId }) {
      try {
        const project = await Project.findById(ProjectId);
        if (project) {
          return project;
        } else {
          throw new Error("Project not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createProject(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Project name must not be empty", {
          errors: {
            createProjectError: "Project name must not be empty"
          }
        });
      }

      const newProject = new Project({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      const project = await newProject.save();

      return project;
    },
    async deleteProject(_, { ProjectId }, context) {
      const user = checkAuth(context);

      try {
        const Project = await Project.findById(ProjectId);
        if (user.username === Project.username) {
          await Project.delete();
          return "Project deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async createComment(_, { ProjectId, body }, context) {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty"
          }
        });
      }

      const project = await Project.findById(ProjectId);

      if (project) {
        project.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await project.save();
        return project;
      } else {
        throw new UserInputError("Project not found");
      }
    },
    async deleteComment(_, { ProjectId, commentId }, context) {
      const { username } = checkAuth(context);
      const project = await Project.findById(ProjectId);
      if (project) {
        const commentIndex = project.comments.findIndex(
          c => c.id === commentId
        );
        if (project.comments[commentIndex].username === username) {
          project.comments.splice(commentIndex, 1);
          await project.save();
          return project;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Project not found");
      }
    },
    async likeProject(_, { ProjectId }, context) {
      const { username } = checkAuth(context);
      const project = await Project.findById(ProjectId);
      if (project) {
        if (project.likes.find(like => like.username === username)) {
          //Project already liked, so unlike it
          project.likes = project.likes.filter(
            like => like.username !== username
          );
        } else {
          project.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await project.save();
        return project;
      } else {
        throw new UserInputError("Project not found");
      }
    }
  }
};
