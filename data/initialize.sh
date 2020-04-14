#!/bin/bash

# Check if a program is installed on system
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

# Check if chromedriver is present on system
check_for_driver() {
    local DRIVER=fetch/assets/chromedriver

    if test -f "$DRIVER"; then
        echo "Driver installed"
    else
        echo "$FILE missing, exiting"
        exit 1
    fi
}


fetch() {
     pipenv run python fetch/fetching.py
}

# Extract files 
extract() {
    pipenv run python extractors/create_and_update_db.py
    pipenv run python extractors/planned_hours.py
    pipenv run python extractors/students_with_minimum.py
    pipenv run python extractors/mean_grades.py
}

# Check if index.py is present on system
FILE=index.py
if test -f "$FILE"; then
    echo "$FILE exist"
    check_for_program "pipenv"
    check_for_driver 

    # Install dependencies
    pipenv install

    # Run index file
    pipenv run python index.py

    # Fetch excel files
    fetch

    # Extract files
    extract
else
    echo "$FILE missing, exiting"
    exit 1
fi
