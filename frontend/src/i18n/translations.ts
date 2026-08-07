// Grading-system names (French, UIAA, USA, British, Kurtyka, V-scale, Font
// Scale, "Bouldering") are intentionally NOT translated anywhere in the
// app - they're the actual international names of the scales, not English
// UI copy, the same way "Celsius" isn't translated.

export const translations = {
  en: {
    // Navbar / MobileNavbar
    nav_gradeConverter: 'Grade converter',
    nav_journal: 'Journal',
    nav_login: 'Log in',
    nav_logout: 'Log out',
    nav_loginRequiredTooltip: 'Log in to access your journal',
    nav_notLoggedInTitle: 'You are not logged in',
    nav_notLoggedInBody:
      'Log in to your profile or sign up to add new routes and boulders to your climbing journal, and keep an eye on your progress!',
    nav_signUp: 'Sign up',
    nav_haveAccountLogin: 'Have account? Log in',

    // HomePage
    home_title: 'Climbing grade converter',
    home_leadClimbing: 'Lead Climbing',

    // Login / Register / RegisterSuccess
    auth_signInTitle: 'Sign in',
    auth_signInSubtitle: 'Please fill in your details to access your account',
    auth_signUpTitle: 'Sign up',
    auth_signUpSubtitle: 'Please fill in your details to create your account',
    auth_email: 'E-mail',
    auth_password: 'Password',
    auth_name: 'Name',
    auth_repeatPassword: 'Repeat Password',
    auth_keepLoggedIn: 'Keep me logged in',
    auth_loginButton: 'Login',
    auth_loggingIn: 'Logging in…',
    auth_signUpButton: 'Sign up',
    auth_signingUp: 'Signing up…',
    auth_noAccount: "Don't have account?",
    auth_createNewAccount: 'Create new account',
    auth_haveAccount: 'Already have account?',
    auth_logIn: 'Log in',
    auth_somethingWentWrong: 'Something went wrong',
    auth_invalidEmail: 'Invalid e-mail',
    auth_passwordHint:
      'Password must be at least 8 characters and must contain at least: 1 lowercase letter, 1 uppercase letter, 1 numeric character, and 1 special character',
    auth_passwordsDontMatch: "Passwords don't match",
    auth_accountCreatedTitle: 'Account created',
    auth_accountCreatedBody: 'Your account was created successfully.',
    auth_goToLogin: 'Go to login',

    // JournalPage / RouteTable
    journal_title: 'Lead climbing journal',
    journal_addNewRoute: 'Add new route',
    journal_gradeScale: 'Grade Scale:',
    journal_loading: 'Loading your routes…',
    journal_loadError: 'Could not load your routes. Please refresh the page.',
    journal_addError: 'Could not add that route. Please try again.',
    journal_saveError: 'Could not save your changes. Please try again.',
    journal_deleteError: 'Could not delete that route. Please try again.',
    journal_deleteConfirm: 'Are you sure you want to delete this route?',
    journal_columnName: 'Name',
    journal_columnGrade: 'Grade',
    journal_columnDate: 'Date',
    journal_columnComment: 'Comment',
    journal_columnAction: 'Action',
    journal_editRouteTooltip: 'Edit route',
    journal_deleteRouteTooltip: 'Delete route',
    journal_filterFrom: 'From',
    journal_filterTo: 'To',
    journal_clearFilters: 'Clear filters',
    journal_noRoutesInRange: 'No routes in this date range.',

    // AddRouteModal
    modal_addTitle: 'Add new route to your journal',
    modal_editTitle: 'Edit route',
    modal_routeName: 'Route name:',
    modal_routeNamePlaceholder: 'Eg. Perfecto Mundo',
    modal_date: 'Date:',
    modal_comment: 'Comment:',
    modal_commentPlaceholder: 'Eg. Rather soft for the grade',
    modal_chooseScale: 'Choose the scale of your route',
    modal_gradeRequired: 'Grade must be selected',
    modal_submit: 'Submit',
    modal_submitting: 'Submitting…',
    modal_saveChanges: 'Save changes',
    modal_saving: 'Saving…',
  },
  pl: {
    // Navbar / MobileNavbar
    nav_gradeConverter: 'Przelicznik trudności',
    nav_journal: 'Dziennik',
    nav_login: 'Zaloguj się',
    nav_logout: 'Wyloguj się',
    nav_loginRequiredTooltip: 'Zaloguj się, aby uzyskać dostęp do dziennika',
    nav_notLoggedInTitle: 'Wymagane logowanie',
    nav_notLoggedInBody:
      'Zaloguj się na swoje konto lub załóż nowe, aby dodawać drogi i boulderingi do swojego dziennika wspinaczkowego i śledzić swoje postępy!',
    nav_signUp: 'Zarejestruj się',
    nav_haveAccountLogin: 'Masz już konto? Zaloguj się',

    // HomePage
    home_title: 'Przelicznik skali trudności wspinaczkowych',
    home_leadClimbing: 'Wspinaczka na prowadzeniu',

    // Login / Register / RegisterSuccess
    auth_signInTitle: 'Zaloguj się',
    auth_signInSubtitle: 'Podaj swoje dane, aby uzyskać dostęp do konta',
    auth_signUpTitle: 'Zarejestruj się',
    auth_signUpSubtitle: 'Podaj swoje dane, aby założyć konto',
    auth_email: 'E-mail',
    auth_password: 'Hasło',
    auth_name: 'Imię',
    auth_repeatPassword: 'Powtórz hasło',
    auth_keepLoggedIn: 'Zapamiętaj mnie',
    auth_loginButton: 'Zaloguj się',
    auth_loggingIn: 'Logowanie…',
    auth_signUpButton: 'Zarejestruj się',
    auth_signingUp: 'Rejestracja…',
    auth_noAccount: 'Nie masz konta?',
    auth_createNewAccount: 'Utwórz nowe konto',
    auth_haveAccount: 'Masz już konto?',
    auth_logIn: 'Zaloguj się',
    auth_somethingWentWrong: 'Coś poszło nie tak',
    auth_invalidEmail: 'Nieprawidłowy adres e-mail',
    auth_passwordHint:
      'Hasło musi mieć co najmniej 8 znaków i zawierać: 1 małą literę, 1 wielką literę, 1 cyfrę oraz 1 znak specjalny',
    auth_passwordsDontMatch: 'Hasła nie są zgodne',
    auth_accountCreatedTitle: 'Konto utworzone',
    auth_accountCreatedBody: 'Twoje konto zostało pomyślnie utworzone.',
    auth_goToLogin: 'Przejdź do logowania',

    // JournalPage / RouteTable
    journal_title: 'Dziennik wspinaczki na prowadzeniu',
    journal_addNewRoute: 'Dodaj nową drogę',
    journal_gradeScale: 'Skala trudności:',
    journal_loading: 'Wczytywanie Twoich dróg…',
    journal_loadError: 'Nie udało się wczytać dróg. Odśwież stronę.',
    journal_addError: 'Nie udało się dodać drogi. Spróbuj ponownie.',
    journal_saveError: 'Nie udało się zapisać zmian. Spróbuj ponownie.',
    journal_deleteError: 'Nie udało się usunąć drogi. Spróbuj ponownie.',
    journal_deleteConfirm: 'Czy na pewno chcesz usunąć tę drogę?',
    journal_columnName: 'Nazwa',
    journal_columnGrade: 'Trudność',
    journal_columnDate: 'Data',
    journal_columnComment: 'Komentarz',
    journal_columnAction: 'Akcja',
    journal_editRouteTooltip: 'Edytuj drogę',
    journal_deleteRouteTooltip: 'Usuń drogę',
    journal_filterFrom: 'Od',
    journal_filterTo: 'Do',
    journal_clearFilters: 'Wyczyść filtry',
    journal_noRoutesInRange: 'Brak dróg w tym zakresie dat.',

    // AddRouteModal
    modal_addTitle: 'Dodaj nową drogę do dziennika',
    modal_editTitle: 'Edytuj drogę',
    modal_routeName: 'Nazwa drogi:',
    modal_routeNamePlaceholder: 'Np. Perfecto Mundo',
    modal_date: 'Data:',
    modal_comment: 'Komentarz:',
    modal_commentPlaceholder: 'Np. Raczej łatwa jak na tę trudność',
    modal_chooseScale: 'Wybierz skalę trudności drogi',
    modal_gradeRequired: 'Musisz wybrać trudność',
    modal_submit: 'Dodaj',
    modal_submitting: 'Dodawanie…',
    modal_saveChanges: 'Zapisz zmiany',
    modal_saving: 'Zapisywanie…',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['en'];
