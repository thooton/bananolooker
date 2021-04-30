import * as React from "react";
import { rpc } from "api/rpc";

export interface RepresentativesOnlineReturn {
  representatives: string[];
  isLoading: boolean;
  isError: boolean;
}

export const RepresentativesOnlineContext = React.createContext<
  RepresentativesOnlineReturn
>({
  representatives: [],
  isLoading: false,
  isError: false,
});

const Provider: React.FC = ({ children }) => {
  const [representatives, setRepresentatives] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const getRepresentativesOnline = async () => {
    setIsError(false);
    setIsLoading(true);
    //const json = await rpc("representatives_online");
	
	var json;
	try {
		var res = await fetch("https://api.creeper.banano.cc/v2/representatives/online");
		json = await res.json();
	} catch (e) {
		json = {
			"error": e.toString()
		};
	}
	
	if (!json.error) {
		var newreps = [];
		var reps = json.representatives;
		for (var rep in reps) {
			newreps.push(rep);
		}
		json = {
			"representatives": newreps
		};
	}
	
    !json || json.error
      ? setIsError(true)
      : setRepresentatives(json.representatives);

    setIsLoading(false);
  };

  React.useEffect(() => {
    getRepresentativesOnline();
  }, []);

  return (
    <RepresentativesOnlineContext.Provider
      value={{ representatives, isLoading, isError }}
    >
      {children}
    </RepresentativesOnlineContext.Provider>
  );
};

export default Provider;
