import * as React from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "antd";
import { WalletOutlined, QrcodeOutlined } from "@ant-design/icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Copy from "components/Copy";
import QRCodeModal from "components/QRCodeModal";
import Bookmark from "components/Bookmark";
import { Natricon } from "components/Preferences/Natricons/Natricon";
import { PreferencesContext } from "api/contexts/Preferences";

interface Props {
  account: string;
  isLink?: boolean;
}

const AccountHeader: React.FC<Props> = ({ account, isLink = false }) => {
  const { natricons } = React.useContext(PreferencesContext);
  const isSmallAndLower = !useMediaQuery("(min-width: 576px)");

  return (
    <div
      style={{
        display: "flex",
        alignItems: natricons ? "center" : "",
        fontSize: "16px",
        wordWrap: "break-word",
        position: "relative",
      }}
      className="color-normal"
    >
      {natricons ? (
        <Natricon
          account={account}
          style={{
            margin: "-12px -6px -18px -18px",
            width: "80px",
            height: "80px",
          }}
        />
      ) : (
        <div style={{ alignSelf: "baseline" }}>
          <WalletOutlined
            style={{
              fontSize: "18px",
              marginRight: "6px",
            }}
          />
        </div>
      )}

      {!isLink ? (
        <span className="break-word" style={{ marginRight: "6px" }}>
          <span>
            {account.substr(account.length * -1, account.length - 60)}
          </span>
          <span style={{ color: "#FFC125" }}>{account.substr(-60, 7)}</span>
          <span>{account.substr(-53, 46)}</span>
          <span style={{ color: "#FFC125" }}>{account.substr(-7)}</span>
        </span>
      ) : (
        <Link
          to={`/account/${account}`}
          style={{ fontSize: "14px", marginRight: "6px" }}
          className="break-word"
        >
          {account}
        </Link>
      )}

      <Row gutter={6} justify="start" className="options-wrapper">
        <Col style={{ fontSize: 0, alignSelf: "center" }}>
          <Copy text={account} />
        </Col>
        <Col>
          <Bookmark
            type="account"
            bookmark={account}
            placement={isSmallAndLower ? "left" : "top"}
          />
        </Col>
        <Col>
          <QRCodeModal account={account}>
            <Button shape="circle" icon={<QrcodeOutlined />} size="small" />
          </QRCodeModal>
        </Col>
      </Row>
    </div>
  );
};

export default AccountHeader;
