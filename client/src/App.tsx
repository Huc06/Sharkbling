import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import MyPredictions from "./pages/MyPredictions";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/not-found";
import { MarketsProvider } from "./contexts/MarketsContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/markets" component={Markets} />
      <Route path="/my-predictions" component={MyPredictions} />
      <Route path="/chatbot" component={Chatbot} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <MarketsProvider>
      <div className="theme-primary-bg">
        <Router />
        <Toaster />
      </div>
    </MarketsProvider>
  );
}

export default App;
