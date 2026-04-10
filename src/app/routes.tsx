import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import { Overview } from "./components/screens/Overview";
import { SessionData } from "./components/screens/SessionData";
import { Prediction } from "./components/screens/Prediction";
import { Insights } from "./components/screens/Insights";
import { ModelAnalysis } from "./components/screens/ModelAnalysis";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Overview },
      { path: "session-data", Component: SessionData },
      { path: "prediction", Component: Prediction },
      { path: "insights", Component: Insights },
      { path: "model-analysis", Component: ModelAnalysis },
    ],
  },
]);
