'use client';
import { SocialAccount } from '@/components/auth/socialAccount';
import { LoginForm } from '@/components/auth/loginForm';
import { SignupForm } from '@/components/auth/signupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authConfig } from '@/config/auth';
import { Fragment, useState } from 'react';
import UserIdForm from '@/components/auth/userIdForm';

export const AuthForm = () => {
  const [step, setStep] = useState<number>(0);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const renderContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <Tabs defaultValue="login" className="max-w-[400px]">
            <TabsList className="grid w-full grid-cols-2 bg-[#ffeedd]">
              <TabsTrigger value="login" className="font-semibold">
                {authConfig.tab.login}
              </TabsTrigger>
              <TabsTrigger value="signup" className="font-semibold">
                {authConfig.tab.signup}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>{authConfig.login.title}</CardTitle>
                  <CardDescription>{authConfig.login.description}</CardDescription>
                </CardHeader>
                <LoginForm handleNext={handleNext} />
                <CardContent>
                  <SocialAccount tab="login" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>{authConfig.signup.title}</CardTitle>
                  <CardDescription>{authConfig.signup.description}</CardDescription>
                </CardHeader>
                <SignupForm handleNext={handleNext} />
                <CardContent>
                  <SocialAccount tab="signup" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      case 1:
        // 登録後にユニークIDを設定するためのform画面
        return <UserIdForm />;
      default:
        return null;
    }
  };

  return <Fragment>{renderContent(step)}</Fragment>;
};
