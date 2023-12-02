#!/bin/bash

# Set GIT_PAGER to cat to disable paging
export GIT_PAGER=cat

# Get the last release tag
tag=$(curl --silent "https://api.github.com/repos/firsttris/chrome.sendtokodi/releases/latest" | jq -r .tag_name)

# Get the SHA of the last release
sha=$(git rev-list -n 1 $tag)

# Get the commits since the last release
git log --pretty=format:"%h %s" $sha..HEAD