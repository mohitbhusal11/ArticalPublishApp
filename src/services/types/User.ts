export interface User {
  id: number;
  userName: string;
  isActive: boolean;
  createdOn: string;
  defaultBusinessUnitId: number;
  defaultRoleId: number;
  userTypeId: number;
  userTypeName: string;
  fromTime: string;
  toTime: string;
  blockLogin: boolean;
  checkIP: boolean;
  mobileNo: string;
  imgUrl: string;
  securityQuestionId: number;
  securityAnswer: string;
  businessUnitName: string;
  fcmToken: string;
  platform: string;
  fcmTokenUpdatedAt: string;
  deviceId: string
}

export interface DeleteUser {
  id: number;
  userName: string;
  isActive: boolean;
  mobileNo: string;
}


export interface DeleteUserResponse {
  message: number;
  user: DeleteUser;
}