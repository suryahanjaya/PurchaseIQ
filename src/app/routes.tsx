import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import { Overview } from "./components/screens/Overview";
import { SessionData } from "./components/screens/SessionData";
import { Prediction } from "./components/screens/Prediction";
import { Insights } from "./components/screens/Insights";
import { ModelAnalysis } from "./components/screens/ModelAnalysis";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      errorElement: <ErrorBoundary />,
      children: [
        { index: true, Component: Overview },
        { path: "session-data", Component: SessionData },
        { path: "prediction", Component: Prediction },
        { path: "insights", Component: Insights },
        { path: "model-analysis", Component: ModelAnalysis },
      ],
    },
  ],
  {
    basename: "/PurchaseIQ",
  }
);