import { FrequencyAnalyzer } from "../../components/analyzers/frequencyAnalyzer/FrequencyAnalyzer";
import { SentimentAnalyzer } from "../../components/analyzers/sentimentAnalyzer/SentimentAnalyzer";
import { EmailWasVerified } from "../../components/auth/views/EmailWasVerified";
import { LoginPage } from "../../components/auth/views/LoginPage";
import { PasswordReset } from "../../components/auth/views/PasswordReset";
import { SignUpPage } from "../../components/auth/views/SignUpPage";
import { VerifyEmail } from "../../components/auth/views/VerifyEmail";
import { ReportForm } from "../../components/dataUploader/ReportForm";
import { MyTweets } from "../../components/myTweets/MyTweets";
import { ReportsCard } from "../../components/reports/MyReportsCard";
import { EmotionAnalyzer } from "../../components/analyzers/emotionAnalyzer/EmotionAnalyzer";
import { DataSelection } from "../../components/dataSelection/DataSelection";
import { TweetFetcher } from "../../components/dataUploader/TweetFetcher";
import { Home } from "../../components/home/Home";
import { SimilarityAlgorithms } from "../../components/similarityAlgorithms/SimilarityAlgorithms";

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
  frequencyAnalyzer: {
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
