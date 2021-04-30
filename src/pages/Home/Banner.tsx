import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Space, Typography } from "antd";
import {
  CrownFilled,
  DollarOutlined,
  EuroOutlined,
  PayCircleOutlined,
  PoundOutlined,
} from "@ant-design/icons";
import { Theme, PreferencesContext, Fiat } from "api/contexts/Preferences";
import Search from "components/Search";

const { Title } = Typography;

const Banner: React.FC = () => {
  const { t } = useTranslation();
  const { theme, fiat } = React.useContext(PreferencesContext);

  return (
    <div
      className="home-banner"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: "-12px -12px 12px -12px",
        backgroundColor: theme === Theme.DARK ? "#121212" : "#ffd34f",
        padding: "40px 0",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}
      >
        <img
          alt="Banano block-lattice explorer"
          height="30px"
          src={`/nano-${theme === Theme.DARK ? "dark" : "light"}.png`}
          style={{ marginRight: "12px" }}
        />
        <Title
          level={3}
          style={{
            display: "inline-block",
            color: "#fff",
            margin: 0,
            fontWeight: 200,
            fontSize: "28px",
            whiteSpace: "nowrap",
          }}
        >
          {t("common.blockExplorer")}
        </Title>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <Search isHome />
      </div>

      {/*<Space>
        <Link to={"/what-is-nano"}>
          <Button ghost>{t("menu.whatIsNano")}</Button>
        </Link>

        <Button
          ghost
          href="https://nanoroyale.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CrownFilled style={{ color: "gold" }} />
        </Button>

        <Button
          ghost
          href="https://earn-nano.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {[Fiat.CAD, Fiat.USD].includes(fiat) ? <DollarOutlined /> : null}
          {fiat === Fiat.EUR ? <EuroOutlined /> : null}
          {fiat === Fiat.GBP ? <PoundOutlined /> : null}
          {[Fiat.CNY, Fiat.JPY].includes(fiat) ? <PayCircleOutlined /> : null}
          {t("menu.earnNano")}
        </Button>
</Space>*/}
    </div>
  );
};

export default Banner;
