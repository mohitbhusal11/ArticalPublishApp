export const Endpoints = {
  AUTH: {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    SENDOTP: "auth/send-otp",
    reset: "auth/reset-password/token",
    verifyOtp: "auth/verify-otp",
    changePassword: "auth/change-password",
    emailOtp: "auth/forgot-password/email-otp",
    verifyEmailOtp: "auth/reset-password/email-otp",
    resetPasswordWithToken: "auth/reset-password/token",
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
    descNewupdate: "stories"
  },
  Assignment: {
    assignment: "assignments/myassignment",
    statusUpdate: "assignments/updated-acceptance"
  },
  Notification: {
    getNotifications: "notifications/me",
    markAsRead: "notifications/mark-as-read"
  }
};
