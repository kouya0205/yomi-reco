import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスを入力してください' })
    .email('メールアドレスの形式が正しくありません'),
  password: z
    .string({ required_error: 'パスワードを入力してください' })
    .min(6, 'パスワードは6文字以上で入力してください'),
});

export const signupSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスを入力してください' })
    .email('メールアドレスの形式が正しくありません'),
  password: z
    .string({ required_error: 'パスワードを入力してください' })
    .min(6, 'パスワードは6文字以上で入力してください')
    .regex(
      /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
      'パスワードは半角英数字混合で入力してください',
    ),

  acceptCheckbox: z.boolean({
    required_error: '利用規約に同意してください',
  }),
});

export const userIdSchema = z.object({
  username: z
    .string({ required_error: 'ユーザー名を入力してください' })
    .min(3, 'ユーザー名は3文字以上で入力してください'),
  id: z.string({ required_error: 'ユーザーIDを入力してください' }),
});
export const profileSchema = z.object({
  username: z
    .string({ required_error: 'ユーザー名を入力してください' })
    .min(3, 'ユーザー名は3文字以上で入力してください'),
});
