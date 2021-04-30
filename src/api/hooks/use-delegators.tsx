import * as React from "react";
import qs from "qs";
import { rawToRai } from "components/utils";
import { isValidAccountAddress } from "components/utils";
import { rpc } from "api/rpc";

export interface Return {
  delegators: { [key: string]: number };
  isLoading: boolean;
  isError: boolean;
}

const useDelegators = (account: string): Return => {
  const [delegators, setDelegators] = React.useState({} as any);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const getDelegators = async (account: string) => {
    setIsError(false);
    setIsLoading(true);

    const query = qs.stringify(
      { account },
      {
		addQueryPrefix: false
        //addQueryPrefix: true,
      },
    );
	//const res = await fetch(`https://api.creeper.banano.cc/v2/accounts/${account}/delegators`);
    //const res = await fetch(`/api/delegators${query}`);
	var json = await rpc("delegators", { account: account });
	if (!json.error) {
		var delegators = json.delegators;
		var newdeleg: any = {
			
		};
		var deleglist = [];
		for (var del in delegators) {
			var delegated = (delegators[del] as string);
			if (delegated == "0") continue;
			deleglist.push({
				"id": (del as string),
				"val": (rawToRai(delegated) as number)
			});
			//newdeleg[(del as string)] = (rawToRai(delegated) as number);
		}
		deleglist.sort(function(a, b) {
			return b.val - a.val;
		});
		var len = deleglist.length;
		if (len > 100) len = 100;
		for (var i = 0; i < len; i++) {
			newdeleg[deleglist[i].id] = deleglist[i].val;
		}
		json = newdeleg;
	}

    !json || json.error ? setIsError(true) : setDelegators(json);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!isValidAccountAddress(account)) return;

    getDelegators(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { delegators, isLoading, isError };
};

export default useDelegators;
