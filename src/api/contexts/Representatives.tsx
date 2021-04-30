import * as React from "react";
import { rawToRai, raiToRaw } from "components/utils";
import { rpc } from "api/rpc";
import { KnownAccountsContext } from "./KnownAccounts";
import { ConfirmationQuorumContext } from "./ConfirmationQuorum";
import { RepresentativesOnlineContext } from "./RepresentativesOnline";

export interface Representative {
  account: string;
  weight: number;
  isOnline?: boolean;
  isPrincipal?: boolean;
  alias?: string;
}
export interface RepresentativesReturn {
  representatives: Representative[];
  isLoading: boolean;
  isError: boolean;
}

export const RepresentativesContext = React.createContext<RepresentativesReturn>(
  {
    representatives: [],
    isLoading: true,
    isError: false,
  },
);

let isEnhancedRepresentativeDone = false;

const Provider: React.FC = ({ children }) => {
  const [representatives, setRepresentatives] = React.useState<
    Representative[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);
  const {
    confirmationQuorum: {
      principal_representative_min_weight: principalRepresentativeMinWeight = 0,
    },
  } = React.useContext(ConfirmationQuorumContext);
  const { representatives: representativesOnline } = React.useContext(
    RepresentativesOnlineContext,
  );
  const { knownAccounts, isLoading: isKnownAccountsLoading } = React.useContext(
    KnownAccountsContext,
  );

  const getRepresentatives = async () => {
    setIsError(false);
    setIsLoading(true);
    var json = await rpc("representatives");
	//var res = await fetch("https://api.creeper.banano.cc/v2/representatives/online");
	//var json = await res.json();
	
	if (!json.error) {
		var reps = json.representatives;
		var newreps = [];
		for (var rep in reps) {
			if (rawToRai(reps[rep]) < 10000) continue;
			newreps.push({
				"account": rep,
				"weight": rawToRai(reps[rep])
			});
		}
		newreps.sort(function(a, b) {
			return a.weight < b.weight ? 1 : -1;
		});
		json = {
			"representatives": newreps
		};
		console.log(json);
	}

    isEnhancedRepresentativeDone = false;

    !json || json.error
      ? setIsError(true)
      : setRepresentatives(json.representatives);
  };

  React.useEffect(() => {
    getRepresentatives();
  }, []);

  React.useEffect(() => {
    if (
      isEnhancedRepresentativeDone ||
      isKnownAccountsLoading ||
      !representatives.length ||
      !principalRepresentativeMinWeight ||
      !representativesOnline.length
    )
      return;

    isEnhancedRepresentativeDone = true;

    setRepresentatives(representatives =>
      representatives.map(({ account, weight }) => ({
        account,
        weight,
        isOnline: representativesOnline.includes(account),
        isPrincipal: weight >= principalRepresentativeMinWeight,
        alias: knownAccounts.find(
          ({ account: knownAccount }) => account === knownAccount,
        )?.alias,
      })),
    );
    setIsLoading(false);
  }, [
    representatives,
    principalRepresentativeMinWeight,
    representativesOnline,
    knownAccounts,
    isKnownAccountsLoading,
  ]);

  return (
    <RepresentativesContext.Provider
      value={{ representatives, isLoading, isError }}
    >
      {children}
    </RepresentativesContext.Provider>
  );
};

export default Provider;
