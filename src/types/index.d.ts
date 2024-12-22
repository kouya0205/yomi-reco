export type SiteConfig = {
  title: string;
  description: string;
  url: string;
  header: {
    title: string;
    logo: string;
    icons: { src: string; alt: string }[];
  };
  auth: {
    title: string;
    description: string;
    url: string;
  };
};

export type AuthConfig = {
  tab: {
    login: string;
    signup: string;
  };
  login: {
    title: string;
    description: string;
    button: string;
    email: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
  };
  signup: {
    title: string;
    description: string;
    button: string;
    email: {
      label: string;
      placeholder: string;
    };
    username: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
    confirmPassword: {
      label: string;
      placeholder: string;
    };
  };
};
