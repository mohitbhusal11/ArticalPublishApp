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
    imageUploadComplaintRegister: "images/upload"
  },
  Home: {
    dashboard: "user-dashboards/me"
  },
  Stories: {
    postStory: "stories",
    getStory: "stories",
    postDraft: "stories/draft",
  },
  Assignment: {
    assignment: "assignments/myassignment",
  }
};
