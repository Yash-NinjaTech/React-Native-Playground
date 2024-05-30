#!/bin/bash

generate_core_client() {
    local output_dir=$1

    echo "Generating core client to ${output_dir}"

    # Generate client
    npx @hey-api/openapi-ts \
        --output "${output_dir}" \
        --name "ApiCore"

    echo "Client generated for core at ${output_dir}"
}

move_logs_to_directory() {
    local log_directory="$1"  # Directory to move logs to, passed as an argument

    # Create the directory if it does not exist
    mkdir -p "$log_directory"

    # Move all log files with the specified pattern to the logs directory
    mv openapi-ts-error-*.log "$log_directory/"
}

generate_core_client "./simplenight-sdk/api/core"

# Move logs to a directory
move_logs_to_directory "./logs"

echo "Clients generation complete for all services."
