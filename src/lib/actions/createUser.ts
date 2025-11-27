'use server'

type ActionState = {
  success: boolean,
  errors: Record<string, string[]>
}
export async function createUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState>
{
  // フォームから渡ってきた情報を取得

  // バリデーション

  // DBにメールアドレスが存在しているか確認
  // DBに登録

  // dashboardにリダイレクト
}
