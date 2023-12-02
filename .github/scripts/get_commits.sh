#!/bin/bash

# Get the last release tag
tag=$(curl --silent "https://api.github.com/repos/firsttris/chrome.sendtokodi/releases/latest" | jq -r .tag_name)

# Get the SHA of the last release
sha=$(git rev-list -n 1 $tag)

# Get the commits since the last release
list=$(git log --pretty=format:"%h %s" $sha..HEAD)

# Write the output to an environment variable
if [ -n "$GITHUB_ENV" ]; then
    echo "COMMIT_LIST=$list" >> $GITHUB_ENV
else
    export COMMIT_LIST=$list
fi

# Log the value of the environment variable
echo $COMMIT_LIST