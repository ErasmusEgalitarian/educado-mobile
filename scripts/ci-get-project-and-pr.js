#!/usr/bin/env node
/*
 * Fetch project and PR data from GitHub GraphQL API and write pr_id to
 * GITHUB_OUTPUT.
 *
 * It expects to be run in a Node.js 18+ environment
 *
 * Expects environment variables:
 * - GH_TOKEN (required)
 * - ORGANIZATION (required)
 * - PROJECT_NUMBER (required)
 * - REPO_NAME (required)
 * - PR_NUMBER (required)
 * - GITHUB_OUTPUT (optional; if unset, prints to stdout)
 */

const fs = require('fs');

const {
  GH_TOKEN,
  ORGANIZATION,
  PROJECT_NUMBER,
  REPO_NAME,
  PR_NUMBER,
  GITHUB_OUTPUT,
} = process.env;

function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (!GH_TOKEN) die('GH_TOKEN is required');
if (!ORGANIZATION) die('ORGANIZATION is required');
if (!PROJECT_NUMBER) die('PROJECT_NUMBER is required');
if (!REPO_NAME) die('REPO_NAME is required');
if (!PR_NUMBER) die('PR_NUMBER is required');

const headers = {
  'Authorization': `bearer ${GH_TOKEN}`,
  'Content-Type': 'application/json',
  'User-Agent': 'educado-ci-script',
};

async function graphql(query, variables) {
  if (typeof fetch !== 'function') {
    die('Global fetch is not available in this Node runtime. Use Node 18+ or run the inline bash version.');
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    die(`Failed to parse JSON response: ${err.message}\nResponse text:\n${text}`);
  }

  if (!res.ok || json.errors) {
    const errText = json.errors ? JSON.stringify(json.errors, null, 2) : text;
    die(`GraphQL request failed: ${res.status} ${res.statusText}\n${errText}`);
  }

  return json;
}

const projectQuery = `
query ($org: String!, $number: Int!) {
  organization(login: $org) {
    projectV2(number: $number) {
      id
      fields(first: 50) {
        nodes {
          ... on ProjectV2Field { id name }
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name }
          }
        }
      }
    }
  }
}
`;

const prQuery = `
query ($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      id
      commits(first: 250) {
        nodes { commit { authors(first: 10) { nodes { user { id login } } } } }
      }
      closingIssuesReferences(first: 50) {
        nodes {
          id
          number
          repository { owner { login } name }
          projectItems(first: 20) { nodes { id project { id number } } }
        }
      }
      timelineItems(itemTypes: [CONNECTED_EVENT], first: 200) {
        nodes {
          ... on ConnectedEvent {
            subject {
              __typename
              ... on Issue {
                id
                number
                repository { owner { login } name }
                projectItems(first: 20) { nodes { id project { id number } } }
              }
            }
          }
        }
      }
    }
  }
}
`;

(async () => {
  const projectData = await graphql(projectQuery, { org: ORGANIZATION, number: Number(PROJECT_NUMBER) });
  fs.writeFileSync('project-data.json', JSON.stringify(projectData, null, 2));

  const prData = await graphql(prQuery, { owner: ORGANIZATION, repo: REPO_NAME, pr: Number(PR_NUMBER) });
  fs.writeFileSync('pr-data.json', JSON.stringify(prData, null, 2));

  const pr_id = prData?.data?.repository?.pullRequest?.id;
  if (!pr_id) {
    die('Could not find pullRequest.id in GraphQL response');
  }

  const out = `pr_id=${pr_id}\n`;
  if (GITHUB_OUTPUT) {
    fs.appendFileSync(GITHUB_OUTPUT, out);
  } else {
    // Fallback for local runs
    console.log(out.trim());
  }
})();
