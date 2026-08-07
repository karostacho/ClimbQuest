from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    # Default (no "remember me"): a short-lived session that expires with
    # the browser session and, as a server-side backstop, after a day
    # regardless. "Remember me" opts into the long-lived version instead.
    jwt_session_expire_minutes: int = 60 * 24
    jwt_remember_me_expire_minutes: int = 60 * 24 * 30
    cookie_name: str = "climbquest_token"
    environment: str = "development"


settings = Settings()
