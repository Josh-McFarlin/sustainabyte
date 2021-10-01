export type UnauthedNavParamList = {
  Login: Record<string, never>;
  ResetPassword: {
    email: string;
  };
  SignUp: Record<string, never>;
};
