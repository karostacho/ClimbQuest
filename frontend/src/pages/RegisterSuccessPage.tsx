import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function RegisterSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="content-wrapper">
      <div className="form-container">
        <div className="form-body">
          <h1>{t('auth_accountCreatedTitle')}</h1>
          <p>{t('auth_accountCreatedBody')}</p>
          <Link className="submit-btn" to="/login">
            {t('auth_goToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
