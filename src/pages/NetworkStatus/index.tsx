import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Col, Empty, Row, Skeleton, Tag, Typography } from "antd";
import BigNumber from "bignumber.js";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Representative,
  RepresentativesContext,
} from "api/contexts/Representatives";
import { Theme, PreferencesContext } from "api/contexts/Preferences";
import useNetworkStatus, { NetworkStatus } from "api/hooks/use-network-status";
import { TwoToneColors } from "components/utils";

interface Node extends NetworkStatus {}
interface Node extends Representative {}

const { Text, Title } = Typography;

const NetworkStatusPage: React.FC = () => {
  const { t } = useTranslation();
  const [nodes, setNodes] = React.useState([] as Node[]);
  const [isLoading, setIsLoading] = React.useState(true);
  const {
    representatives,
    isLoading: isRepresentativesLoading,
  } = React.useContext(RepresentativesContext);
  const { theme } = React.useContext(PreferencesContext);
  const {
    isLoading: isNetworkStatusLoading,
    networkStatus,
  } = useNetworkStatus();
  const isMediumAndLower = !useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (isRepresentativesLoading || isNetworkStatusLoading) return;

    try {
      const nodes = networkStatus.map(node => {
        const representative = representatives.find(
          ({ account }) => account === node.account,
        );

        return {
          ...node,
          ...representative,
        };
      });

      // @ts-ignore
      setNodes(nodes);
    } catch (err) {}

    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepresentativesLoading, isNetworkStatusLoading]);

  return (
    <>
      {/* <Title level={3}>{t("menu.networkStatus")}</Title>
      <Card
        size="small"
        bordered={false}
        className="detail-layout"
        style={{ marginBottom: "12px" }}
      ></Card> */}

      <Title level={3}>
        {t("pages.status.nodeMonitors", {
          count: nodes.length,
        })}
      </Title>
      <Card
        size="small"
        bordered={false}
        className="detail-layout"
        style={{ marginBottom: "12px" }}
      >
        {!isMediumAndLower ? (
          <Row gutter={6}>
            <Col md={6}>
              <Text className="color-muted">{t("common.account")}</Text>
            </Col>
            <Col md={4}>
              <Text className="color-muted">{t("pages.status.version")}</Text>
            </Col>
            <Col md={4}>
              <Text className="color-muted">{t("common.block")}</Text>
            </Col>
            <Col md={2}>
              <Text className="color-muted">{t("pages.status.peers")}</Text>
            </Col>
            <Col md={4}>
              <Text className="color-muted">{t("pages.status.node")}</Text>
            </Col>
            <Col md={4}>
              <Text className="color-muted">{t("pages.status.stats")}</Text>
            </Col>
          </Row>
        ) : null}

        {isLoading
          ? Array.from(Array(3).keys()).map(index =>
              isMediumAndLower ? (
                <Row gutter={6} key={index}>
                  <Skeleton loading={true} paragraph={false} active />
                  <Skeleton loading={true} paragraph={false} active />
                  <Col xs={12}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                  <Col xs={12}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                </Row>
              ) : (
                <Row gutter={6} key={index}>
                  <Col md={6}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                  <Col md={4}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                  <Col md={4}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                  <Col md={2}>
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                  <Col md={4}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                  <Col md={4}>
                    <Skeleton loading={true} paragraph={false} active />
                    <Skeleton loading={true} paragraph={false} active />
                  </Col>
                </Row>
              ),
            )
          : null}

        {!isLoading && nodes.length
          ? nodes.map(
              (
                { account, isOnline, isPrincipal, alias, ip, monitor },
                index,
              ) => {
                const {
                  version = "",
                  nodeMonitorVersion = "",
                  currentBlock = 0,
                  uncheckedBlocks = 0,
                  cementedBlocks = 0,
                  numPeers = 0,
                  systemUptime = "",
                  usedMem = 0,
                  totalMem = 0,
                  // nanoNodeName,
                  nodeLocation = "",
                  active_difficulty: { multiplier = "" } = {},
                  blockSync = 0,
                } = monitor;

                return (
                  <Row gutter={6} key={index}>
                    <Col xs={24} md={6}>
                      <div style={{ display: "flex", margin: "3px 0" }}>
                        {typeof isOnline === "boolean" ? (
                          <Tag
                            color={
                              isOnline
                                ? theme === Theme.DARK
                                  ? TwoToneColors.RECEIVE_DARK
                                  : TwoToneColors.RECEIVE
                                : theme === Theme.DARK
                                ? TwoToneColors.SEND_DARK
                                : TwoToneColors.SEND
                            }
                            className={`tag-${isOnline ? "online" : "offline"}`}
                          >
                            {t(`common.${isOnline ? "online" : "offline"}`)}
                          </Tag>
                        ) : null}
                        {isPrincipal ? (
                          <Tag>{t("common.principalRepresentative")}</Tag>
                        ) : null}
                      </div>

                      {alias ? (
                        <div className="color-important">{alias}</div>
                      ) : null}

                      <Link to={`/account/${account}`} className="break-word">
                        {account}
                      </Link>
                    </Col>
                    {Object.keys(monitor).length ? (
                      <>
                        <Col xs={12} md={4}>
                          {version}
                          <br />
                          <Text className="color-muted">
                            {t("pages.status.monitor")}
                          </Text>{" "}
                          {nodeMonitorVersion}
                        </Col>
                        <Col xs={12} md={4}>
                          <Text className="color-muted">
                            {t("pages.status.count")}
                          </Text>{" "}
                          {new BigNumber(currentBlock).toFormat()}
                          <br />
                          <Text className="color-muted">
                            {t("pages.status.unchecked")}
                          </Text>{" "}
                          {new BigNumber(uncheckedBlocks).toFormat()}
                          <br />
                          <Text className="color-muted">
                            {t("pages.status.cemented")}
                          </Text>{" "}
                          {new BigNumber(cementedBlocks).toFormat()}
                        </Col>

                        {!isMediumAndLower ? (
                          <Col xs={12} md={2}>
                            {numPeers}
                          </Col>
                        ) : null}
                        <Col xs={12} md={4}>
                          <Text className="color-muted">
                            {t("pages.status.location")}
                          </Text>{" "}
                          {nodeLocation || t("common.unknown")}
                          <br />
                          <Text className="color-muted">
                            {t("pages.status.uptime")}
                          </Text>{" "}
                          {systemUptime}
                          <br />
                          <Text className="color-muted">
                            {t("pages.status.memory")}
                          </Text>{" "}
                          {new BigNumber(usedMem).dividedBy(1e3).toFormat(2)}/
                          {new BigNumber(totalMem).dividedBy(1e3).toFormat(2)}{" "}
                          GB
                        </Col>
                        <Col xs={12} md={4}>
                          <Text className="color-muted">
                            {t("pages.status.sync")}
                          </Text>{" "}
                          {blockSync} %
                          <br />
                          <Text className="color-muted">
                            {t("pages.status.multiplier")}
                          </Text>{" "}
                          {multiplier}
                          {isMediumAndLower ? (
                            <>
                              <br />
                              <Text className="color-muted">
                                {t("pages.status.peers")}
                              </Text>{" "}
                              {numPeers}
                            </>
                          ) : null}
                        </Col>
                      </>
                    ) : null}
                    {!Object.keys(monitor).length ? (
                      <Col
                        xs={24}
                        md={18}
                        style={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Text className="color-muted">
                          {t("pages.status.noMonitorFound")}
                        </Text>
                      </Col>
                    ) : null}
                  </Row>
                );
              },
            )
          : null}

        {!isLoading && !nodes.length ? (
          <Row>
            <Col xs={24} style={{ textAlign: "center" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("pages.status.noMonitorFound")}
                style={{ padding: "12px" }}
              />
            </Col>
          </Row>
        ) : null}
      </Card>
    </>
  );
};

export default NetworkStatusPage;
