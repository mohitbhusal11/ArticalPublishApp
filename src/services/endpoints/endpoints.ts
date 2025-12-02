export const Endpoints = {
  AUTH: {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    SENDOTP: "auth/send-otp",
    reset: "auth/reset",
    verifyOtp: "auth/verify-otp",
    changePassword: "auth/change-password",
  },
  USER: {
    PROFILE: "users/me",
  },
  DeleteUser: {
    DeleteUser: "user"
  },
  IMAGE: {
    fileUpload: "file-upload/multiple",
    deleteFile: "file-upload/delete"
  },
  Home: {
    dashboard: "user-dashboards/me"
  },
  Stories: {
    postStory: "stories",
    getStory: "stories/mystories",
    postDraft: "stories/draft",
  },
  Assignment: {
    assignment: "assignments/myassignment",
    statusUpdate: "assignments/updated-acceptance"
  }
};
