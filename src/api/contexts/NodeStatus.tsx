import * as React from "react";

interface NodeStatus {
  memory: {
    free: number;
    total: number;
  };
  ledgerSize: number;
  nodeStats: {
    cpu: number;
    memory: number;
    elapsed: number;
  };
}

export interface Return {
  nodeStatus: NodeStatus;
  getNodeStatus: Function;
  isLoading: boolean;
  isError: boolean;
}

export const NodeStatusContext = React.createContext<Return>({
  nodeStatus: {} as NodeStatus,
  getNodeStatus: () => {},
  isLoading: false,
  isError: false,
});

const Provider: React.FC = ({ children }) => {
  const [nodeStatus, setNodeStatus] = React.useState<NodeStatus>(
    {} as NodeStatus,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const getNodeStatus = async () => {
    setIsError(false);
    setIsLoading(true);

    const res = await fetch("https://api.creeper.banano.cc/system_info");
    const json = await res.json();
	if (!json.error) {
		json.ledgerSize = json.dbSize;
		delete json.dbSize;
		json.nodeStats = json.raiStats;
		delete json.raiStats;
	}

    !json || json.error ? setIsError(true) : setNodeStatus(json);
    setIsLoading(false);
  };

  React.useEffect(() => {
    getNodeStatus();
  }, []);

  return (
    <NodeStatusContext.Provider
      value={{ nodeStatus, getNodeStatus, isLoading, isError }}
    >
      {children}
    </NodeStatusContext.Provider>
  );
};

export default Provider;
