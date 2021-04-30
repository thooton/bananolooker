const express = require('express');
const app = express();
const cliProgress = require('cli-progress');
const port = 3010;
const fetch = require('node-fetch');
const rl = require('readline-sync');
const fs = require('fs');
var finaljson = {};
var knownaccounts = require('./known-accounts.json');

updateData().then(function() {
	console.log("Loaded rep data");
});

app.get('/api/delegators', (req, res) => {
	res.json(finaljson);
});

app.get('/api/known-accounts', (req, res) => {
	res.json(knownaccounts);
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});

const handler = async function (event, context) {
	/*if (!context.clientContext && !context.clientContext.identity) {
	  return {
		statusCode: 500,
		// Could be a custom message or object i.e. JSON.stringify(err)
		body: JSON.stringify({
		  msg: 'No identity instance detected. Did you enable it?',
		}),
	  }
	}
	const { identity, user } = context.clientContext*/

}

module.exports = { handler }

setTimeout(updateData, 1000 * 60 * 60);

async function updateData() {
	const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);
	var tjson = {
		"action": "representatives"
	}
	var tbody = await fetch("https://kaliumapi.appditto.com/api", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(tjson)
	});
	var data = await tbody.json();
	const reps = [];

	for (var rep in data.representatives) {
		if (BigInt(data.representatives[rep]) < raiToRaw(10000)) continue;
		reps.push(rep);
	}
	bar.start(reps.length, 0);
	for (var i = 0; i < reps.length; i++) {
		var maxtries = 3;
		for (var j = 0; j < maxtries; j++) {
			try {
				var repw = reps[i];
				var json = {
					"action": "delegators_count",
					"account": repw
				}
				var body = await fetch("https://kaliumapi.appditto.com/api", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(json)
				});
				var jsodn = await body.json();
				var count = jsodn.count;
				finaljson[repw] = parseInt(count);
				break;
			} catch (e) {
				console.log(e.message);
			}
		}
		bar.update(i);
	}
	bar.stop();
}

fs.watchFile('./known-accounts.json', function (event, filename) {
	try {
		knownaccounts = JSON.parse(fs.readFileSync('./known-accounts.json'));
		console.log("Reloaded known accounts");
	} catch (e) {
		console.log("Error reloading known accounts", e.message)
	}
});

function raiToRaw(num) {
	return BigInt(num) * (10n ** 29n);
}