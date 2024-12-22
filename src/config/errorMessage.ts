export const supabaseErrorMessages: { [key: string]: string } = {
  anonymous_provider_disabled: '申し訳ありませんが、匿名でのサインインは現在ご利用いただけません。',
  bad_code_verifier: 'セキュリティ上の問題が発生しました。お手数ですが、もう一度お試しください。',
  bad_json: '送信されたデータに問題があります。入力内容をご確認ください。',
  bad_jwt: 'セキュリティトークンに問題があります。再度ログインをお願いします。',
  bad_oauth_callback:
    '外部サービスでのログインに問題が発生しました。別の方法でログインをお試しください。',
  bad_oauth_state: '外部サービスとの連携に問題が発生しました。もう一度最初からお試しください。',
  captcha_failed: 'セキュリティチェックに失敗しました。再度お試しください。',
  conflict: '同時に複数の操作が行われました。少し時間を置いてから再度お試しください。',
  email_address_not_authorized:
    'このメールアドレスは許可されていません。別のメールアドレスをお試しください。',
  email_conflict_identity_not_deletable:
    'アカウントの変更ができません。カスタマーサポートにお問い合わせください。',
  email_exists:
    'このメールアドレスは既に登録されています。ログインするか、別のメールアドレスをお使いください。',
  email_not_confirmed:
    'メールアドレスの確認が完了していません。メールをご確認いただき、確認リンクをクリックしてください。',
  email_provider_disabled: 'メールアドレスでのサインアップは現在ご利用いただけません。',
  flow_state_expired: 'セッションの有効期限が切れました。もう一度最初からお試しください。',
  flow_state_not_found: 'セッション情報が見つかりません。もう一度最初からお試しください。',
  hook_payload_over_size_limit:
    '送信されたデータが大きすぎます。データ量を減らしてお試しください。',
  hook_timeout:
    'サーバーの応答に時間がかかっています。しばらく時間をおいてから再度お試しください。',
  hook_timeout_after_retry:
    'サーバーとの通信に問題が発生しています。しばらく時間をおいてから再度お試しください。',
  identity_already_exists: 'このアカウントは既に別のユーザーと連携されています。',
  identity_not_found:
    'アカウント情報が見つかりません。ログアウトして再度ログインをお試しください。',
  insufficient_aal: 'セキュリティレベルが不足しています。二段階認証を設定してください。',
  invite_not_found: '招待が見つからないか、既に使用されています。新しい招待を依頼してください。',
  invalid_credentials:
    'ログイン情報が正しくありません。メールアドレスとパスワードをご確認ください。',
  manual_linking_disabled: 'アカウントの手動リンクは現在ご利用いただけません。',
  mfa_challenge_expired: '二段階認証の有効期限が切れました。もう一度最初からお試しください。',
  mfa_factor_name_conflict:
    '同じ名前の二段階認証方法が既に存在します。別の名前を使用してください。',
  mfa_factor_not_found: '指定された二段階認証方法が見つかりません。別の方法を選択してください。',
  mfa_ip_address_mismatch:
    'セキュリティ上の理由により、二段階認証の設定を完了できません。同じネットワーク接続で最初から設定をやり直してください。',
  mfa_verification_failed: '二段階認証コードが正しくありません。もう一度お試しください。',
  mfa_verification_rejected:
    '二段階認証が拒否されました。カスタマーサポートにお問い合わせください。',
  mfa_verified_factor_exists:
    'この電話番号は既に二段階認証に使用されています。別の電話番号を使用するか、既存の設定を解除してください。',
  mfa_totp_enroll_disabled:
    '時間ベースのワンタイムパスワード（TOTP）の登録は現在ご利用いただけません。',
  mfa_totp_verify_disabled:
    '時間ベースのワンタイムパスワード（TOTP）による認証は現在ご利用いただけません。',
  mfa_phone_enroll_disabled: '電話番号による二段階認証の登録は現在ご利用いただけません。',
  mfa_phone_verify_disabled: '電話番号による二段階認証は現在ご利用いただけません。',
  no_authorization: 'この操作を行う権限がありません。ログインしているかご確認ください。',
  not_admin: '管理者権限が必要です。適切な権限を持つアカウントでログインしてください。',
  oauth_provider_not_supported: '選択された外部サービスでのログインは現在ご利用いただけません。',
  otp_disabled: 'ワンタイムパスワードによるサインインは現在ご利用いただけません。',
  otp_expired: 'ワンタイムパスワードの有効期限が切れました。新しいコードを要求してください。',
  over_email_send_rate_limit:
    '短時間に多くのメールが送信されました。しばらく時間をおいてから再度お試しください。',
  over_request_rate_limit: 'リクエストが多すぎます。しばらく時間をおいてから再度お試しください。',
  over_sms_send_rate_limit:
    '短時間に多くのSMSが送信されました。しばらく時間をおいてから再度お試しください。',
  phone_exists:
    'この電話番号は既に登録されています。別の電話番号を使用するか、ログインしてください。',
  phone_not_confirmed:
    '電話番号の確認が完了していません。SMSに送信された確認コードを入力してください。',
  phone_provider_disabled: '電話番号でのサインアップは現在ご利用いただけません。',
  provider_disabled: '選択された認証方法は現在ご利用いただけません。別の方法をお試しください。',
  provider_email_needs_verification:
    '外部サービスでのログインにはメールアドレスの確認が必要です。メールをご確認ください。',
  reauthentication_needed: 'セキュリティのため、再度ログインが必要です。',
  reauthentication_not_valid: '再認証に失敗しました。もう一度ログインしてください。',
  request_timeout:
    'リクエストがタイムアウトしました。ネットワーク接続をご確認の上、再度お試しください。',
  same_password: '新しいパスワードは現在のパスワードと異なるものを設定してください。',
  saml_assertion_no_email:
    'SAML認証でメールアドレスが取得できませんでした。システム管理者にお問い合わせください。',
  saml_assertion_no_user_id:
    'SAML認証でユーザーIDが取得できませんでした。システム管理者にお問い合わせください。',
  saml_entity_id_mismatch: 'SAML設定に問題があります。システム管理者にお問い合わせください。',
  saml_idp_already_exists: 'この外部認証サービスは既に設定されています。',
  saml_idp_not_found:
    '指定された外部認証サービスが見つかりません。システム管理者にお問い合わせください。',
  saml_metadata_fetch_failed:
    '外部認証サービスの情報を取得できませんでした。システム管理者にお問い合わせください。',
  saml_provider_disabled: 'SAML認証は現在ご利用いただけません。',
  saml_relay_state_expired: 'SAML認証の有効期限が切れました。もう一度最初からお試しください。',
  saml_relay_state_not_found: 'SAML認証の状態が見つかりません。もう一度最初からお試しください。',
  session_not_found: 'セッションが見つかりません。再度ログインしてください。',
  signup_disabled: '新規アカウントの作成は現在ご利用いただけません。',
  single_identity_not_deletable:
    '最後の認証方法は削除できません。別の認証方法を追加してから再度お試しください。',
  sms_send_failed: 'SMSの送信に失敗しました。電話番号をご確認の上、再度お試しください。',
  sso_domain_already_exists: 'このドメインのシングルサインオンは既に設定されています。',
  sso_provider_not_found:
    '指定されたシングルサインオンプロバイダーが見つかりません。システム管理者にお問い合わせください。',
  too_many_enrolled_mfa_factors:
    '二段階認証の設定数が上限に達しました。不要な設定を削除してから再度お試しください。',
  unexpected_audience: '予期せぬエラーが発生しました。カスタマーサポートにお問い合わせください。',
  unexpected_failure: '予期せぬエラーが発生しました。しばらく時間をおいてから再度お試しください。',
  user_already_exists:
    'このユーザー情報は既に登録されています。ログインするか、別の情報をお使いください。',
  user_banned:
    'このアカウントは一時的に利用停止されています。カスタマーサポートにお問い合わせください。',
  user_not_found: 'ユーザーが見つかりません。正しい情報でログインしているかご確認ください。',
  user_sso_managed: 'シングルサインオンで管理されているユーザー情報は変更できません。',
  validation_failed: '入力内容に問題があります。各項目の入力条件をご確認ください。',
  weak_password: 'パスワードが脆弱です。より強力なパスワードを設定してください。',
};
