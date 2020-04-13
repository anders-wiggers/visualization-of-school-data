#!/bin/bash

check_for_program() {
  local program 
  program="${1}"

  printf "Checking for ${program}\\n  "
  command -v "${program}"

  if [[ "${?}" -ne 0 ]]; then
    printf "${program} is not installed, exiting\\n"
    exit 1
  fi 
}

check_for_driver() {
    local DRIVER=fetch/assets/chromedriver

    if test -f "$DRIVER"; then
        echo "Driver installed"
    else
        echo "$FILE missing, exiting"
        exit 1
    fi
}

FILE=index.py
if test -f "$FILE"; then
    echo "$FILE exist"
    check_for_program "pipenv"
    check_for_driver 
    pipenv install
    pipenv run python index.py
    pipenv run python fetch/fetching.py
else
    echo "$FILE missing, exiting"
    exit 1
fi
