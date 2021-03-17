import { lazy } from "react";

const Home = lazy(() => import("../../components/home/Home"));
const FrequencyAnalyzer = lazy(() =>
  import("../../components/analyzers/frequencyAnalyzer/FrequencyAnalyzer")
);
const SentimentAnalyzer = lazy(() =>
  import("../../components/analyzers/sentimentAnalyzer/SentimentAnalyzer")
);
const EmailWasVerified = lazy(() =>
  import("../../components/auth/views/EmailWasVerified")
);
const LoginPage = lazy(() => import("../../components/auth/views/LoginPage"));
const PasswordReset = lazy(() =>
  import("../../components/auth/views/PasswordReset")
);
const SignUpPage = lazy(() => import("../../components/auth/views/SignUpPage"));
const VerifyEmail = lazy(() =>
  import("../../components/auth/views/VerifyEmail")
);
const ReportForm = lazy(() =>
  import("../../components/dataUploader/ReportForm")
);
const MyTweets = lazy(() => import("../../components/myTweets/MyTweets"));
const ReportsCard = lazy(() =>
  import("../../components/reports/MyReportsCard")
);
const EmotionAnalyzer = lazy(() =>
  import("../../components/analyzers/emotionAnalyzer/EmotionAnalyzer")
);
const DataSelection = lazy(() =>
  import("../../components/dataSelection/DataSelection")
);
const TweetFetcher = lazy(() =>
  import("../../components/dataUploader/TweetFetcher")
);
const SimilarityAlgorithms = lazy(() =>
  import("../../components/similarityAlgorithms/SimilarityAlgorithms")
);

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
