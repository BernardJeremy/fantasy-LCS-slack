fantasy-LCS-slack
=================
Node.JS script allowing to send every roster change in a given fantasy league of Fantasy LCS to Slack.

## Features
- Retrieves every roster change in the watched league
- Send these changes to a configured Slack hook

## Installation
- Simply clone this depot anywhere on your server.
- Copy [config.json.exemple](https://github.com/BernardJeremy/fantasy-LCS-slack/blob/master/config.json.exemple) file into a `config.json` file.
- Add your fantasy league url to the `config.json` file.
- Install a [incoming-webhooks](https://api.slack.com/incoming-webhooks) on your Slack.
- Add your link of the Slack incoming-webhooks in the `config.json` file.
- Optional (but recommended) : Install a task scheduler (like `CRON`) to run the script regularly.

## Configuration
- `leagueUrl` : Link to the wanted fantasy league.
- `proDataUrl` : Link to the current pro season (players & teams).
- `slackHookUrl` :  Link to your Slack incoming-webhooks.
