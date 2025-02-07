import * as React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Typography } from "antd";
import BlockCount from "components/BlockCount";
import ActiveDifficulty from "components/ActiveDifficulty";
import Node from "components/Node";
import Ledger from "components/Ledger";
import Peers from "components/Peers";

const { Title } = Typography;

const NodeStatusPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title level={3}>{t("menu.nodeStatus")}</Title>
      <Row gutter={[{ xs: 6, sm: 12, md: 12, lg: 12 }, 12]}>
        <Col xs={24} sm={12} lg={8}>
          <BlockCount />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Ledger />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ActiveDifficulty />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Node />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Peers />
        </Col>
      </Row>
    </>
  );
};

export default NodeStatusPage;
