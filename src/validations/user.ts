// validations/user.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1, '名前は必須です'),

    email: z
      .string({ required_error: 'メールアドレスは必須です' })
      .min(1, 'メールアドレスは必須です')
      .email('正しいメールアドレスを入力してください'),

    password: z
      .string({ required_error: 'パスワードは必須です' })
      .min(8, 'パスワードは8文字以上である必要があります')
      .max(32, 'パスワードは32文字以内にしてください'),

    confirmPassword: z // ← 正しい綴りはこれ！（wwwordじゃない）
      .string({ required_error: '確認用パスワードは必須です' })
      .min(1, '確認用パスワードを入力してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'], // ← ここも正しい綴りで統一
  });
