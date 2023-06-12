#!/usr/bin/env bash

KEYSTORE_HOST=${KEYSTORE_HOST:-$1}
KEYSTORE_ACCESS_TOKEN=${KEYSTORE_ACCESS_TOKEN:-$2}

setup_git() {
  echo "Setup git..."
  git config user.name "GitHub Action"
  git config user.email "action@github.com"
  git config pull.rebase true
}

update_npm() {
  echo "Update npm..."
  npm install npm@latest -g || exit 1
}

update_version() {
  local SEARCH_PATTERN="\"version\": "
  local FILE="package.json"

  echo "Patch version..."

  if git diff HEAD~ HEAD --unified=0 -- "$FILE" | grep -q "+.*$SEARCH_PATTERN.*"
    then
      echo "Parameter 'version' in $FILE already updated, skip auto-patching..."
    else
      git stash
      npm version patch
      git stash pop
  fi

  npm ci
}

publish() {
  local NPM_AUTH_TOKEN

  echo "Load npm access token for publishing..."
  NPM_AUTH_TOKEN=$(
    curl \
      -X "GET" \
      -H "Authorization: Bearer $KEYSTORE_ACCESS_TOKEN" \
      --url "$KEYSTORE_HOST/applications/monbernate/publishing/npm/access-token"
  )

  echo "Publish..."
  NODE_AUTH_TOKEN="$NPM_AUTH_TOKEN" npm publish --access public --provenance || exit 1
}

main() {
  setup_git
  update_npm
  update_version
  publish
}

main
