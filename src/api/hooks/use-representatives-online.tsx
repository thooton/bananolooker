import * as React from "react";
import { rpc } from "api/rpc";

export interface RepresentativesOnlineReturn {
  representatives: string[];
  isError: boolean;
}

const useRepresentativesOnline = (): RepresentativesOnlineReturn => {
  const [representatives, setRepresentatives] = React.useState<string[]>([]);
  const [isError, setIsError] = React.useState(false);

  const getBlockCount = async () => {
	  console.log("tets");
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
  };

  React.useEffect(() => {
    getBlockCount();
  }, []);

  return { representatives, isError };
};

export default useRepresentativesOnline;
