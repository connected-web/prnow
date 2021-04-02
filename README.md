# PR Now

Command line tool to create a PR now - minimal fuss - automated commit, push, and PR using hub

Taking the effort out of making pull requests, by linking together branch names, PR titles, and tickets by running one simple command.

![Photo of broken glass reflecting light on the road](./images/prnow-background.jpg)

## So what is PR Now?

PR Now is a command line tool that automates a streamlined workflow for making pull requests in the blink of an eye. PR Now assumes your project uses github, and you have a Github issue or Jira ticket associated with the change you're working on. If that's the case, then amazing; you're in for one crazily optimised PR experience!

## Prereqsuites

- `node js > 10.x` installed : https://nodejs.org/en/
- `hub > 2.14.x` installed : https://hub.github.com/
- `git > 2.x` installed : https://git-scm.com/downloads
- `GITHUB_TOKEN` set on your environment to a developer key for `hub`
- `PRNOW_JIRA_BASE_URL` set on your environment to integrate with Jira e.g. `https://connected-web.atlassian.net`
- `PRNOW_JIRA_API_KEY` set on your environment to use an API key with Jira
- `PRNOW_JIRA_CLIENT_KEY` set on your environment to point a private key PEM for use with Jira
- A project checked out from `github` : https://github.com/

## What does PR Now do?

PR Now will attempt to:
- Create a commit title out of the current arguments (if multiple arguments are supplied)
- Look at the current branch name, and attempt to extract a ticket ID or issue number   
- Try to find an issue from github based on the supplied ID and extract its title
- Try and find a Jira ticket based on the supplied ID and extract its title
- Create and checkout a branch based on the ticket ID
- Commit any unstaged files with the equivalent message "TICKET-24 Title of ticket"
- Push any changes to the remote branch; creating the remote branch if necessary
- Use `hub` to create a PR in github with a title, and a link to the ticket in the description
- Use `hub` to open a browser with the new PR so you can review and share with friends

That's a lot of things! Think through how you would normally create a Pull Request - write down all the steps.

That's what this tool is trying to do.

## Basic Commands

Create a PR using a Github Issue:
```
prnow 12
```

Create a PR using a Jira ticket:
```
prnow TICKET-123 
```

Create a PR using a commit message:
```
prnow "Update the README"
```

To reset to main and pull any changes from the remote:
```
prnow reset
```

## Quick setup

Before setting an alias you can just run:

```
npx github:connected-web/prnow TICK-24
```

## Alias use

Modify your `~/.profile`, add:

```
alias prnow="npx github:connected-web/prnow"
```

Then run `source ~/.profile` or restart your console.

You should then be able to use `prnow` from anywhere on the command line.

## Examples

### Example 1

```
prnow 14
```

This would:
- Find "Add support for finding ticket info from github issues" from https://github.com/connected-web/prnow/issues/14
- Create and checkout the branch `#14/add-support-for-finding-ticket-info-from-github-issues` in the local repo
- Commit all unsaved files with the message "#14 Add support for finding ticket info from github issues"
- Create an upstream branch and push the changes
- Create a draft Pull Request in Github with the title "#14 Add support for finding ticket info from github issues"
- Open the Pull Request in your web browser for you to review

### Example 2

```
On branch: #14/add-support-for-finding-ticket-info-from-github-issues
prnow
```

This would:
- Look at the current branch name, and extract `14` as the issue ID for this commit
- Find "Add support for finding ticket info from github issues" from https://github.com/connected-web/prnow/issues/14
- Create and checkout the branch `#14/add-support-for-finding-ticket-info-from-github-issues` in the local repo
- Commit all unsaved files with the message "#14 Add support for finding ticket info from github issues"
- Create an upstream branch and push the changes
- Create a draft Pull Request in Github with the title "#14 Add support for finding ticket info from github issues"
- Open the Pull Request in your web browser for you to review

### Example 3

``` 
On main.
prnow Update the README
```

This would:
- Create a commit title out of "Update the README"
- Create and checkout the branch `Update/update-the-readme`
- Commit all unsaved files with the message "Update the README"
- Create an upstream branch and push the changes
- Create a draft Pull Request in Github with the title "Update the README"
- Open the Pull Request in your web browser for you to review

### Example 4

```
On branch WORKOP-123/a-recently-merged-feature
prnow reset
```

This would:
- Checkout the local main branch
- Pull and rebase any changes to update your local repository
