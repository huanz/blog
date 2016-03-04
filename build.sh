#!/bin/bash

MOD_FILES=$(git ls-files -m)

NEW_FILES=$(git ls-files -o --exclude-standard)

GIT_FILES="$MOD_FILES $NEW_FILES"

GIT_M="add:$NEW_FILES; modified: $MOD_FILES"

if [ "$GIT_FILES" != " " ];then
    git add $GIT_FILES
fi;

git commit -m $GIT_M
git push
echo $GIT_M