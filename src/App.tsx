import * as React from "react";
import { Helmet } from "react-helmet";
import { Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import { PreferencesContext } from "api/contexts/Preferences";
import NodeHealth from "components/NodeHealth";
import AppHeader from "components/AppHeader";
import AppFooter from "components/AppFooter";
import HomePage from "pages/Home";
import RepresentativesPage from "pages/Representatives";
import DeveloperFundPage from "pages/DeveloperFund";
import DeveloperFundTransactionsPage from "pages/DeveloperFund/Transactions";
import DistributionPage from "pages/Distribution";
import ExchangeTrackerPage from "pages/ExchangeTracker";
import FaucetsPage from "pages/Faucets";
import LargeTransactionsPage from "pages/LargeTransactions";
import KnownAccountsPage from "pages/KnownAccounts";
import AccountPage from "pages/Account";
import BlockPage from "pages/Block";
import NewsPage from "pages/News";
import NodeStatusPage from "pages/NodeStatus";
import NetworkStatusPage from "pages/NetworkStatus";
import EarnNanoPage from "pages/EarnNano";
import WhatIsNanoPage from "pages/WhatIsNano";
import PreferencesPage from "pages/Preferences";
import BookmarksPage from "pages/Bookmarks";
import useAnalytics from "hooks/use-analytics";

import "antd/dist/antd.css";
import "./App.css";
import "./Theme.css";

const { Content } = Layout;

const App: React.FC = () => {
  const { theme } = React.useContext(PreferencesContext);

  useAnalytics();

  return (
    <>
      <Helmet></Helmet>
      <Layout
        style={{ minHeight: "100vh" }}
        className={theme ? `theme-${theme}` : undefined}
      >
        <NodeHealth />
        <AppHeader />
        <Content>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/representatives" component={RepresentativesPage} />
            <Route exact path="/developer-fund" component={DeveloperFundPage} />
            <Route
              path="/developer-fund/transactions"
              component={DeveloperFundTransactionsPage}
            />
            <Route path="/known-accounts" component={KnownAccountsPage} />
            <Route path="/distribution" component={DistributionPage} />
            <Route path="/exchange-tracker" component={ExchangeTrackerPage} />
            <Route path="/faucets" component={FaucetsPage} />
            <Route
              path="/large-transactions/:sortBy?"
              component={LargeTransactionsPage}
            />
            <Route
              path="/account/:account?/:section?"
              component={AccountPage}
            />
            <Route path="/block/:block?" component={BlockPage} />
            <Route path="/news/:feed?" component={NewsPage} />
            <Route path="/node-status" component={NodeStatusPage} />
            <Route path="/network-status" component={NetworkStatusPage} />
            <Route path="/earn-nano/:section?" component={EarnNanoPage} />
            <Route path="/what-is-nano" component={WhatIsNanoPage} />
            <Route path="/preferences" component={PreferencesPage} />
            <Route path="/bookmarks" component={BookmarksPage} />
          </Switch>
        </Content>
        <AppFooter />
      </Layout>
    </>
  );
};

export default App;
