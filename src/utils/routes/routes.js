import { ReportForm } from "components/dataUploader/ReportForm";
import { ReportsCard } from "components/reports/MyReportsCard";
import { ReportsList } from "components/reports/MyReportsList";
import { DataSelection } from "../../components/dataSelection/DataSelection";
import { TweetFetcher } from "../../components/dataUploader/TweetFetcher";
import { Home } from "../../components/home/Home";
import { EmotionAnalyzer } from "../../components/emotionAnalyzer/EmotionAnalyzer";
import { SimilarityAlgorithms } from "../../components/similarityAlgorithms/SimilarityAlgorithms";
import { MyTweets } from "../../components/myTweets/MyTweets";
import { SignUpPage } from "components/auth/views/SignUpPage";
import { LoginPage } from "components/auth/views/LoginPage";
import { VerifyEmail } from "components/auth/views/VerifyEmail";
import { EmailWasVerified } from "components/auth/views/EmailWasVerified";
import { PasswordReset } from "components/auth/views/PasswordReset";
import { SentimentAnalyzer } from "components/sentimentAnalyzer/SentimentAnalyzer";
import { FrequencyAnalyzer } from "components/frequencyAnalyzer/FrequencyAnalyzer";

export const routes = {
  home: {
    name: "Inicio",
    path: "/home",
    component: Home,
  },
  tweets: {
    name: "Mis tweets",
    path: "/tweets",
    component: MyTweets,
  },
  reports: {
    name: "Mis noticias",
    path: "/reports",
    component: ReportsCard,
  },
  reportsList: {
    name: "Noticias",
    path: "/reportsList",
    component: ReportsList,
  },
  editReport: {
    name: "Editar noticia",
    path: "/report/edit/:id",
    component: ReportForm,
  },
  createReports: {
    name: "Crear noticias",
    path: "/report/create",
    component: ReportForm,
  },
  dataSelection: {
    name: "Selección de datos",
    path: "/dataSelection",
    component: DataSelection,
  },
  similarityAlgorithms: {
    name: "Algoritmos de similitud",
    path: "/similarityAlgorithms",
    component: SimilarityAlgorithms,
  },
  emotionAnalyzer: {
    name: "Análisis de emociones",
    path: "/emotionAnalyzer",
    component: EmotionAnalyzer,
  },
  sentimentAnalyzer: {
    name: "Análisis de sentimiento",
    path: "/sentimentAnalyzer",
    component: SentimentAnalyzer,
  },
  bubbleChart: {
    name: "Gráfico de burbujas",
    path: "/frequencyAnalyzer",
    component: FrequencyAnalyzer,
  },
  tweetFetcher: {
    name: "Buscar tweets",
    path: "/tweet/fetcher",
    component: TweetFetcher,
  },
  signUp: {
    name: "Registrarse",
    path: "/signUp",
    component: SignUpPage,
  },
  login: {
    name: "Iniciar sesión",
    path: "/login",
    component: LoginPage,
  },
  passwordReset: {
    name: "Password Reset",
    path: "/passwordReset",
    component: PasswordReset,
  },
  verifyEmail: {
    name: "Verificación de mail",
    path: "/verifyEmail",
    component: VerifyEmail,
  },
  emailWasVerified: {
    name: "Email Was Verified",
    path: "/emailWasVerified",
    component: EmailWasVerified,
  },
  default: {
    name: "Inicio",
    path: "/",
    component: Home,
  },
};
