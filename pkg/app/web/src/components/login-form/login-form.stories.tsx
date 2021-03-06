import React from "react";
import { LoginForm } from "./login-form";
import { createDecoratorRedux } from "../../../.storybook/redux-decorator";

export default {
  title: "LOGIN/LoginForm",
  component: LoginForm,
  decorators: [createDecoratorRedux({})],
};

export const overview: React.FC = () => <LoginForm />;
