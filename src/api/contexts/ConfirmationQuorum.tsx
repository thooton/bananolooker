import React from "react";
import { rpc } from "api/rpc";

export interface ConfirmationQuorumRPCResponse {
  quorum_delta: string;
  online_weight_quorum_percent: string;
  online_weight_minimum: string;
  online_stake_total: string;
  peers_stake_total: string;
  peers_stake_required: string;
  principal_representative_min_weight: number;
}

export interface ConfirmationQuorumReturn {
  confirmationQuorum: ConfirmationQuorumRPCResponse;
  isLoading: boolean;
  isError: boolean;
}

export const ConfirmationQuorumContext = React.createContext<ConfirmationQuorumReturn>(
  {
    confirmationQuorum: {} as ConfirmationQuorumRPCResponse,
    isLoading: false,
    isError: false,
  },
);

const Provider: React.FC = ({ children }) => {
  const [confirmationQuorum, setConfirmationQuorum] = React.useState(
    {} as ConfirmationQuorumRPCResponse,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const getConfirmationQuorum = async () => {
    setIsError(false);
    setIsLoading(true);
    //const json = await rpc("confirmation_quorum");
	const res = await fetch("https://api.creeper.banano.cc/confirmation_quorum");
	const json = await res.json();
	if (!json.error) {
		json.principal_representative_min_weight = (json.peers_stake_total_mnano / 1000).toFixed(2);
	}
	
    !json || json.error ? setIsError(true) : setConfirmationQuorum(json);
    setIsLoading(false);
  };

  React.useEffect(() => {
    getConfirmationQuorum();
  }, []);

  return (
    <ConfirmationQuorumContext.Provider
      value={{ confirmationQuorum, isLoading, isError }}
    >
      {children}
    </ConfirmationQuorumContext.Provider>
  );
};

export default Provider;
