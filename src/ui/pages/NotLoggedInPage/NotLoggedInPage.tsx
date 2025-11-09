import { useMainDataContext } from "../../components/Context/useMainDataContext";
import { Footer } from "../../components/Footer/Footer";
import scss from "./NotLoggedInPage.module.scss";

/**
 * Strona informująca użytkownika, że nie jest zalogowany.
 * Wyświetlana, gdy autoryzacja nie powiedzie się.
 * Zawiera logo aplikacji, komunikat o błędzie logowania oraz stopkę.
 */
const NotLoggedInPage: React.FC = () => {
  const { auth } = useMainDataContext();
  const { errorAuth } = auth;

  return (
    <div className={scss["notLoggedInPage-main-container"]}>
      <div className={scss["notLoggedInPage-header"]}>
        <div className={scss["container-gold-text"]}>
          <p className={scss["gold-text"]}>Bilancio</p>
        </div>
      </div>
      <div className={scss["notLoggedInPage-container"]}>
        <div className={scss["notLoggedInPage-text-content"]}>
          <p>Nie jesteś zalogowany.</p>
          <p>Zamknij program</p>
          <p>i skontaktuj się z administratorem.</p>
        </div>
        <p>{errorAuth}</p>
      </div>
      <Footer />
    </div>
  );
};

export default NotLoggedInPage;
